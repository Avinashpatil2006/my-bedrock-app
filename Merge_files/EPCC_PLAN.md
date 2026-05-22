# Plan: CSV Merge with Upsert — merge_csv.py

**Created**: 2026-05-21 | **Effort**: ~1.5h | **Complexity**: Medium

## 1. Objective
**Goal**: Refactor `merge_csv.py` to support a `--key` CLI argument, clean upsert logic (input2 always wins), and a clear console audit summary — replacing the current hardcoded `Custid` and partial upsert implementation.

**Why**: The script currently has a hardcoded column rename (`Customerid → Custid`), a partially-correct upsert that can produce duplicate rows, and no CLI configurability.

**Success**:
- `python merge_csv.py --key Custid` produces correct merged output with no hardcoded column names
- Console prints: `Updated X | Unchanged Y | Inserted Z | Total N rows`
- Invalid `--key` value exits with a helpful error listing available columns

---

## 2. Approach

**From PRD.md**: Single-file script, `argparse` for CLI, `pandas` for data, input2 always wins on conflict, console-only audit.

**Current code issues to fix**:
1. `df1.rename(columns={"Customerid": "Custid"})` — hardcoded, must be replaced by `--key` validation
2. `KEY = "Custid"` — hardcoded, must come from `--key` arg or auto-detect fallback
3. The upsert merge using `suffixes=("_old", "")` works but relies on column overlap to drop `_old` cols — fragile; replace with explicit column union approach
4. `argparse` not yet wired in

**New flow**:
```
parse_args() → --key or auto-detect
→ validate key exists in both files
→ upsert(df1, df2, key): updated + unchanged + inserted
→ derive_fields(merged)
→ filter to output.csv schema
→ write merged_file.csv + print audit
```

**Trade-off**: Keep all logic in `main()` with one `upsert()` helper extracted for clarity vs full function decomposition. Chosen: extract `upsert()` only — minimal refactor, maximum clarity.

---

## 3. Tasks

**Phase 1: CLI + key validation** (~0.5h)
1. Add `argparse` with `--key` optional argument (0.25h) | Deps: None | Risk: L
2. Validate `--key` column exists in both `df1` and `df2`; if not, print available columns and exit (0.25h) | Deps: Task 1 | Risk: L

**Phase 2: Clean upsert logic** (~0.5h)
3. Extract `upsert(df1, df2, key)` helper function (0.5h) | Deps: Task 2 | Risk: M
   - `updated`: rows in df1 whose key is in df2, merged so df2 cols overwrite df1 cols (column-union approach, no `_old` suffix fragility)
   - `unchanged`: rows in df1 whose key is NOT in df2
   - `inserted`: rows in df2 whose key is NOT in df1
   - Returns `(merged_df, updated_count, unchanged_count, inserted_count)`

**Phase 3: Wire everything together + audit** (~0.5h)
4. Replace `main()` body to use `parse_args()` → `upsert()` → derive fields → filter → write (0.3h) | Deps: Tasks 1–3 | Risk: L
5. Print audit line: `Updated X | Unchanged Y | Inserted Z | Total N rows` (0.1h) | Deps: Task 4 | Risk: L
6. Remove all hardcoded column references (`Customerid`, `Custid`) from script body (0.1h) | Deps: Task 4 | Risk: L

**Total**: ~1.5h

---

## 4. Quality Strategy

**Validation** (manual run against existing CSVs):
- `python merge_csv.py --key Custid` → correct output, audit counts match
- `python merge_csv.py --key BadCol` → error with column list, exit 1
- `python merge_csv.py` (no flag) → auto-detect common columns, backward compatible

**Edge cases to verify**:
- Key column present in both files under same name ✓
- Key only in input1 (unchanged row preserved) ✓
- Key only in input2 (inserted row appears) ✓
- NaN in input2 field → overwrites input1 value (explicit test)

---

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Column-union upsert produces unexpected NaNs for cols only in input1 | M | Use `pd.concat` after aligning columns; fill with NaN explicitly — expected and acceptable |
| Auto-detect fallback breaks if no common columns | L | Existing error path already handles this |
| Derived field logic depends on specific column names | L | Guard `if col in merged.columns` already in place — keep as-is |

**Assumptions**:
- `--key` column has the **same name** in both files (different names → user must rename manually; out of scope)
- `output.csv` always present; schema filtering always applied

**Out of scope**: composite keys, log file, per-column conflict strategy
