# Product Requirement Document: CSV Merge with Upsert

**Created**: 2026-05-21
**Version**: 1.0
**Status**: Draft
**Complexity**: Medium

---

## Executive Summary

Extend `merge_csv.py` to be a robust, configurable CSV merge tool with upsert semantics, a configurable join key via CLI argument, conflict resolution (input2 always wins), and a console audit trail showing what was updated, inserted, and unchanged.

---

## Problem Statement

The current `merge_csv.py` does a basic outer join and applies some hardcoded transformations. It lacks:
- Proper upsert semantics (update-or-insert based on key match)
- A way to specify the join key without editing source code
- Explicit conflict resolution rules
- A readable audit trail of what changed

---

## Target Users

**Primary**: Developer (personal automation tool, run locally from terminal)

---

## Goals & Success Criteria

### Product Goals
1. Merge two CSVs with upsert logic — existing rows updated, new rows inserted, unmatched rows preserved
2. Join key configurable at runtime via `--key` CLI argument (no code changes needed)
3. Conflict resolution: input2 value always overwrites input1 for matching rows
4. Console output clearly reports rows updated / inserted / unchanged

### Success Metrics
- Script runs end-to-end without errors on valid inputs
- `--key` flag correctly drives the join with no hardcoded column names
- Output row count = (input1 rows updated) + (input1 rows unchanged) + (input2-only inserts)
- Console summary matches actual output row breakdown

### Acceptance Criteria
- [ ] `python merge_csv.py --key Custid` joins on `Custid` correctly
- [ ] Row in input1 that matches input2 key → output has input2 values (conflict: input2 wins)
- [ ] Row in input1 with no match in input2 → kept unchanged in output
- [ ] Row in input2 with no match in input1 → inserted into output
- [ ] Console prints: Updated X | Unchanged Y | Inserted Z | Total N rows
- [ ] Missing `--key` column in either file → clear error message with available columns listed
- [ ] Missing input file → error with filename
- [ ] Output columns still filtered to `output.csv` schema

---

## Core Features

### Must Have (P0 — MVP)

1. **Upsert logic**
   - Rows matching on key: merge with input2 values overwriting input1
   - Rows only in input1: pass through unchanged
   - Rows only in input2: insert into output
   - *Why essential*: the primary purpose of this tool

2. **Configurable join key via `--key` CLI argument**
   - `python merge_csv.py --key <column_name>`
   - If `--key` not provided, fall back to auto-detection (current behaviour)
   - *Why essential*: removes hardcoded `Custid` dependency

3. **Conflict resolution: input2 always wins**
   - For matching rows, all non-key columns from input2 overwrite input1
   - Blank/NaN values in input2 also overwrite (explicit rule, no "keep old value" fallback)
   - *Why essential*: deterministic, no ambiguity

4. **Console audit trail**
   - Print per-category count: Updated / Unchanged / Inserted / Total
   - Print final output table to console (current behaviour retained)
   - *Why essential*: user visibility into what the merge did

### Should Have (P1)

5. **Derived field computation preserved**
   - `TotalAmount = SubsAmount × SubsTerm` (formatted as `$N,NNN`)
   - `SubStart` reformatted from `SubStartDate`
   - Keep as-is from current implementation

### Out of Scope (V1)
- Per-column conflict strategy (all columns → input2 wins)
- Log file / audit file output
- Config file (YAML/JSON) for key specification
- Batch processing of multiple file pairs
- Database integration

---

## User Journey

### Primary: Running a merge

1. User places `input1.csv`, `input2.csv`, `output.csv` in the project folder
2. User runs: `python merge_csv.py --key Custid`
3. Script validates files exist and `Custid` column exists in both
4. Upsert logic runs: updated/unchanged/inserted rows computed
5. Derived fields computed, output filtered to `output.csv` schema
6. `merged_file.csv` written to project folder
7. Console prints audit summary + final table

### Error path: bad key
1. User runs: `python merge_csv.py --key WrongCol`
2. Script prints: `Error: 'WrongCol' not found. input1 columns: [...] input2 columns: [...]`
3. Exits with code 1

---

## Technical Approach

### Architecture
Single-file Python script (`merge_csv.py`). No new files or modules — all logic stays in `main()` and helper functions.

### Tech Stack
- Python 3 (existing venv at `.venv/`)
- `pandas` (already installed)
- `argparse` (stdlib) for `--key` CLI argument

### Key Design Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| CLI arg parsing | `argparse` | stdlib, zero deps |
| Conflict resolution | input2 always wins | Simple, predictable |
| Missing key fallback | Auto-detect common columns | Backward compatible |
| Audit output | Console only | Sufficient for personal use |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Key column has different name in each file | M | Require both files to have exact same key column name; error clearly if not |
| NaN propagation from outer join | L | Upsert concat approach avoids full outer join |
| Derived field columns not in merged data | L | Existing guards already handle this |

---

## Open Questions
- Should `--key` support composite keys (multiple columns)? *Deferred to P1.*
- Should blank input2 values still overwrite, or skip? *Current decision: yes, input2 always wins including blanks.*

---

## Next Steps

Greenfield extension of existing file — skip Explore phase.

1. Review & approve this PRD
2. Run `/epcc-workflow:epcc-plan` to create implementation plan
3. Run `/epcc-workflow:epcc-code` to implement
4. Run `/epcc-workflow:epcc-commit` to finalize

---

**End of PRD**
