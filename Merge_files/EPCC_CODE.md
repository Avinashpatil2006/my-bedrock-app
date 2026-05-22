# Implementation: CSV Merge with Upsert

**Mode**: default | **Date**: 2026-05-21 | **Status**: Complete

## 1. Changes (1 file, full rewrite)
**Modified**: `merge_csv.py` — complete refactor replacing hardcoded logic with configurable, clean upsert implementation

## 2. Quality (All 5 features verified manually)

**Test results**:
- `python merge_csv.py --key Customerid --key2 Custid` → 6 rows, correct audit counts ✓
- `python merge_csv.py --key BadCol` → error with column list, exit 1 ✓
- `python merge_csv.py --key2 BadCol` → error with column list, exit 1 ✓
- `python merge_csv.py` (no flags, no common cols) → helpful error with tip ✓
- Derived fields: TotalAmount, SubStart computed correctly ✓
- Output schema filtered to output.csv columns ✓

## 3. Decisions

**`--key2` added**: `--key2` for right-hand file added beyond original PRD scope. The sample data (`Customerid` vs `Custid`) made this immediately necessary — without it the tool was unusable on real data. Low-risk addition, zero breaking changes.

**Key normalisation in upsert()**: After resolving left/right keys, `right_key` is renamed to `left_key` inside `upsert()` before any set operations. This keeps all downstream logic key-name-agnostic.

**Schema key auto-align**: After merging, if `output.csv` references the right-side key name (e.g. `Custid`) but the merged frame uses the left-side name (`Customerid`), the column is renamed to match the schema. Fuzzy-matched by stripping underscores and lowercasing.

## 4. Handoff
**Run**: `/epcc-workflow:epcc-commit`
**Blockers**: None
**TODOs**: Composite key support (`--key a,b`) deferred to P1 per PRD
