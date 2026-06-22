---
description: Run lint, typecheck, tests, and build; report a structured, honest pass/fail
---

Run the project's checks and report honestly. Never claim green without the output to back it.

1. Detect the package manager and available scripts from `package.json`. Use the monorepo task runner (e.g. `turbo`) if present.
2. Run, in order: lint, typecheck, test, build.
3. On the first failure, show the failing output verbatim and stop. Do not continue or paper over it.
4. On success, report each gate as passed, with the exact command used.
