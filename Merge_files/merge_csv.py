#!/usr/bin/env python3
"""
Reads input1.csv (base) and input2.csv (updates), applies upsert logic:
  - Rows in both files (matched on --key): input2 values overwrite input1
  - Rows only in input1: kept unchanged
  - Rows only in input2: inserted as new rows
Computes derived fields and writes merged_file.csv matching output.csv schema.

Usage:
  python merge_csv.py --key <column>   # join on named column
  python merge_csv.py                  # auto-detect common column
"""

import argparse
import sys
from pathlib import Path

import pandas as pd

BASE = Path(__file__).parent


def load_csv(name: str) -> pd.DataFrame:
    path = BASE / name
    if not path.exists():
        print(f"Error: '{path}' not found.", file=sys.stderr)
        sys.exit(1)
    return pd.read_csv(path)


def resolve_key(
    df1: pd.DataFrame, df2: pd.DataFrame, key_arg: str | None, key2_arg: str | None
) -> tuple[str, str]:
    """Returns (key_in_df1, key_in_df2). Renames df2 key to df1 key if they differ."""
    if key_arg:
        left_key = key_arg
        right_key = key2_arg if key2_arg else key_arg

        if left_key not in df1.columns:
            print(
                f"Error: --key '{left_key}' not found in input1.\n"
                f"  input1 columns: {list(df1.columns)}",
                file=sys.stderr,
            )
            sys.exit(1)
        if right_key not in df2.columns:
            print(
                f"Error: --key2 '{right_key}' not found in input2.\n"
                f"  input2 columns: {list(df2.columns)}",
                file=sys.stderr,
            )
            sys.exit(1)
        return left_key, right_key

    # Auto-detect: first common column
    common = [c for c in df1.columns if c in df2.columns]
    if not common:
        print(
            "Error: no common columns found for auto-detection.\n"
            f"  input1 columns: {list(df1.columns)}\n"
            f"  input2 columns: {list(df2.columns)}\n"
            "Tip: use --key <col> [--key2 <col>] to specify the join key.",
            file=sys.stderr,
        )
        sys.exit(1)
    key = common[0]
    print(f"Auto-detected join key: '{key}'")
    return key, key


def upsert(
    df1: pd.DataFrame, df2: pd.DataFrame, left_key: str, right_key: str
) -> tuple[pd.DataFrame, int, int, int]:
    """
    Applies upsert semantics: df2 values win on conflict.
    Returns (merged_df, n_updated, n_unchanged, n_inserted).
    """
    # Normalise: rename right_key → left_key in df2 so both use the same name
    if right_key != left_key:
        df2 = df2.rename(columns={right_key: left_key})
    key = left_key

    df1_keys = set(df1[key])
    df2_keys = set(df2[key])

    # Rows in df1 matched by df2 key — rebuild using df2 as authoritative source,
    # then carry forward df1-only columns that df2 doesn't have
    matched_df2 = df2[df2[key].isin(df1_keys)].copy()
    matched_df1 = df1[df1[key].isin(df2_keys)].set_index(key)

    df1_only_cols = [c for c in df1.columns if c not in df2.columns and c != key]
    if df1_only_cols:
        extra = matched_df1[df1_only_cols].rename_axis(key).reset_index()
        matched_df2 = matched_df2.merge(extra, on=key, how="left")

    updated = matched_df2

    # Rows in df1 with no match in df2 — keep as-is
    unchanged = df1[~df1[key].isin(df2_keys)].copy()

    # Rows in df2 with no match in df1 — insert
    inserted = df2[~df2[key].isin(df1_keys)].copy()

    merged = pd.concat([updated, unchanged, inserted], ignore_index=True)
    return merged, len(updated), len(unchanged), len(inserted)


def derive_fields(df: pd.DataFrame) -> pd.DataFrame:
    if "SubsAmount" in df.columns and "SubsTerm" in df.columns:
        df["TotalAmount"] = df["SubsAmount"] * df["SubsTerm"]
        df["TotalAmount"] = df["TotalAmount"].apply(
            lambda x: f"${x:,.0f}" if pd.notna(x) else ""
        )
    if "SubStartDate" in df.columns:
        df["SubStartDate"] = pd.to_datetime(df["SubStartDate"], errors="coerce")
        df["SubStart"] = df["SubStartDate"].dt.strftime("%B-%Y")
    return df


def main() -> None:
    parser = argparse.ArgumentParser(description="Upsert-merge two CSV files.")
    parser.add_argument("--key", help="Join column in input1 (auto-detected if omitted)")
    parser.add_argument("--key2", help="Join column in input2 if different from --key")
    args = parser.parse_args()

    df1 = load_csv("input1.csv")
    df2 = load_csv("input2.csv")
    schema = load_csv("output.csv")

    left_key, right_key = resolve_key(df1, df2, args.key, args.key2)
    print(f"Join key: input1['{left_key}'] ↔ input2['{right_key}']")

    merged, n_updated, n_unchanged, n_inserted = upsert(df1, df2, left_key, right_key)
    n_total = len(merged)
    print(f"Updated {n_updated} | Unchanged {n_unchanged} | Inserted {n_inserted} | Total {n_total} rows")

    merged = derive_fields(merged)

    # If output.csv uses a different key name than left_key, rename to match
    desired = list(schema.columns)
    schema_key = next((c for c in desired if c.lower().replace("_", "") in
                       {left_key.lower().replace("_", ""), right_key.lower().replace("_", "")}), None)
    if schema_key and schema_key != left_key and left_key in merged.columns:
        merged = merged.rename(columns={left_key: schema_key})
    missing = [c for c in desired if c not in merged.columns]
    if missing:
        print(f"Warning: output.csv columns not found in merged data (skipped): {missing}")

    output_cols = [c for c in desired if c in merged.columns]
    result = merged[output_cols]

    out_path = BASE / "merged_file.csv"
    result.to_csv(out_path, index=False)
    print(f"Written: '{out_path}'")
    print(result.to_string(index=False))


if __name__ == "__main__":
    main()
