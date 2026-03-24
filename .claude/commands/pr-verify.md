---
allowed-tools: Bash(gh issue view:*), Bash(gh pr view:*), Bash(gh pr diff:*), Bash(gh pr comment:*), Bash(gh api:*), Read, Grep, Glob, Task
argument-hint: <issue-number> <pr-number>
description: Verify that a PR fully addresses all requirements from the linked issue
---

# PR Verification Against Issue Requirements

You are tasked with analyzing whether Pull Request #$2 fully addresses all requirements from Issue #$1.

## Rules

- Do NOT switch branches or checkout any code
- Work only with GitHub API, PR diff, and local read-only inspection when needed
- Write the report in English
- Do NOT hallucinate or assume unverified requirements
- Read all issue and PR comments before making conclusions

## Step 0: Check for Multi-Issue Context

If a file `.forge/verify-context.md` exists in the repository root, read it first. This file contains related issues that were implemented together with the primary issue. You MUST verify requirements from ALL issues listed in the implementation scope, not just the primary issue.

If `.forge/verify-context.md` does not exist, proceed with single-issue verification as normal.

## Step 1: Fetch Issue Details

Run:

```bash
gh issue view $1 --json title,body,labels,comments
```

If Step 0 found implementation-scope issues, fetch each of them now as well. For every issue number `N` listed under "Implementation Scope (MUST verify)" in `.forge/verify-context.md`, run:

```bash
gh issue view N --json title,body,labels,comments
```

You need the full body and comments for every implementation-scope issue to correctly extract and verify their requirements in subsequent steps.

## Step 2: Fetch PR Details

Run:

```bash
gh pr view $2 --json title,body,files,commits,additions,deletions,headRefName,baseRefName,comments,reviews
gh pr diff $2
gh pr view $2 --json files --jq '.files[].path'
```

## Step 3: Extract Requirements

Identify all requirements from the primary issue AND every implementation-scope issue fetched in Step 1. For each issue, extract:

- explicit acceptance criteria
- edge cases
- checklist items
- clarifications added in comments

Group the extracted requirements by issue number so you can trace each one back to its source.

## Step 4: Verify Implementation

For each requirement:

1. Identify relevant changed files
2. Read the implementation
3. Verify whether the requirement is fully addressed, partially addressed, or not addressed

## Step 5: Generate Report

Create a markdown report with:

- issue and PR summary
- requirements checklist with evidence
- totals for fully addressed, partially addressed, and missing requirements
- concise overall assessment
- recommendations only if there are genuine gaps

## Step 5.5: Output Report with Markers

Before posting the report, output the complete report to stdout between these delimiters so it can be extracted programmatically. Output the report exactly once between these markers:

```
FORGE_PR_VERIFY_REPORT_START
[The full verification report markdown]
FORGE_PR_VERIFY_REPORT_END
```

## Step 6: Post Report

Post the same report as a PR comment:

```bash
gh pr comment $2 --body "$(cat <<'EOF'
[Insert the full verification report here]
EOF
)"
```

## Critical Rules

- Cite concrete evidence for each finding
- Only flag requirements that are clearly present in the issue or comments
- If the issue is vague, say so and avoid inventing scope
- Keep the verification report human-readable
- End the final stdout with exactly one line:
  `FORGE_PR_VERIFY_RESULT: PASS`
  or
  `FORGE_PR_VERIFY_RESULT: FAIL`
- Use `PASS` only when the PR fully satisfies the issue requirements
- Use `FAIL` if any issue requirement is missing, incorrect, or insufficiently implemented
- Do not output anything after the verdict line
