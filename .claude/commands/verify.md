---
description: Run all project checks (build, tests, lint) on backend and frontend, and fix any issues found
---

# Full Project Verification & Auto-Fix

Run all quality checks across the entire project and automatically fix any issues found.

## Phase 1: Project Discovery

Analyze the project to determine:

- Project structure and package boundaries
- Package manager and build system
- Build, test, lint, and typecheck commands
- CI checks that must pass

Check these locations when relevant:

- `package.json`
- `Makefile`, `Taskfile.yml`, `justfile`
- `.github/workflows/*.yml`
- language-specific config files such as `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`
- linter and formatter config files
- `tsconfig.json`

## Phase 2: Execute All Checks

Run every discovered check systematically:

1. Ensure dependencies are installed if needed
2. Run build
3. Run type checking
4. Run linting and auto-fix when safe
5. Run tests
6. Run any additional checks found in CI

## Phase 3: Issue Resolution

For every issue found:

- Fix the root cause precisely
- Do not skip or disable failing tests
- Re-run affected checks after each fix
- Keep changes focused on the branch scope

## Phase 4: Verification Loop

After fixes are applied:

1. Re-run all checks
2. If new issues appear, fix them
3. Repeat until all checks pass cleanly
4. Stop after 3 iterations if the repository still cannot be stabilized

## Phase 5: Summary Report

Provide a clear summary of:

- Which components were checked
- Which checks passed
- Which issues were fixed
- Any unresolved issues requiring manual action

$ARGUMENTS
