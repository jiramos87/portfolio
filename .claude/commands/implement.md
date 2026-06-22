---
description: Implement a feature from its PRD with minimal diffs, then run the verify gate
---

Implement the feature defined in `docs/prd/{slug}.md`.

1. Read the PRD acceptance, quality bar, and out-of-scope. If the acceptance is ambiguous, stop and ask.
2. Plan the smallest diff that satisfies the acceptance. Match the surrounding code style.
3. Implement in place. Grow one test file for the feature from its acceptance scenarios (red then green).
4. Run the verify gate (see the `verify` skill). Iterate until green.
5. Stop before commit. Summarize what changed and the next command.

Do not exceed the PRD scope. New ideas become new PRDs.
