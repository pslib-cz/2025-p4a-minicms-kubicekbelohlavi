---
allowed-tools: Bash(git *), Bash(gh *)
argument-hint: [#issue1 #issue2 ...]
description: Create a GitHub PR from current branch with detailed description and optional issue linking
---

Create a pull request using GitHub CLI with detailed analysis:

1. Run `git status` to verify current branch and uncommitted changes
2. Run `git log origin/main..HEAD` (or appropriate base branch) to see all commits in this branch
3. Run `git diff origin/main...HEAD` to see all changes that will be in the PR
4. If there are uncommitted changes, ask user if they want to commit them first

5. Analyze all commits and changes to create a comprehensive BILINGUAL PR description:
   - Write a clear title summarizing the main purpose (in English)
   - Create detailed description with BOTH Czech and English sections:

     **Czech section (první / primary):**
     - **Typ změny**: bugfix | feature | refactor | docs | chore
     - **Shrnutí**: Co tento PR dělá a proč
     - **Změny**: Seznam hlavních změn podle souboru/komponenty
     - **Breaking Changes**: Upozornění na nekompatibilní změny (pokud existují)
     - **Závislosti/Konfigurace**: Nové závislosti, env proměnné, migrace (pokud existují)
     - **Jak otestovat**: Podrobný návod na testování přes UI
     - **Screenshots**: Popis UI změn (pokud relevantní - reviewer si může pořídit vlastní)
     - **Související issues**: Odkazy na issues

     **English section:**
     - **Type of Change**: bugfix | feature | refactor | docs | chore
     - **Summary**: What does this PR do and why
     - **Changes**: List of main changes by file/component
     - **Breaking Changes**: Notes on incompatible changes (if any)
     - **Dependencies/Configuration**: New dependencies, env vars, migrations (if any)
     - **How to Test**: Step-by-step UI testing guide
     - **Screenshots**: Description of UI changes (if relevant)
     - **Related Issues**: Link to issues if provided in arguments

6. Handle issue linking:
   - If $ARGUMENTS provided (e.g., "#123 #456"), link those issues
   - **Default to "Closes #123"** - use this when the PR fully resolves/implements the issue
   - Use "Relates to #123" ONLY when:
     - PR is partial work that doesn't fully resolve the issue
     - PR is tangentially related but doesn't address the issue directly
   - When in doubt, prefer "Closes" - issues can always be reopened if needed

7. Push current branch if not already pushed:
   `git push -u origin HEAD`

8. Create PR using gh CLI with heredoc for proper formatting:

   ```
   gh pr create --title "PR Title" --body "$(cat <<'EOF'
   # 🇨🇿 Česky

   ## Typ změny
   - [x] ✨ Feature (nová funkcionalita)
   - [ ] 🐛 Bugfix (oprava chyby)
   - [ ] ♻️ Refactor (refaktorizace kódu)
   - [ ] 📚 Docs (dokumentace)
   - [ ] 🔧 Chore (údržba, konfigurace)

   ## Shrnutí
   [Detailní popis toho, co tento PR dělá a proč]

   ## Změny
   - Změna 1: [popis]
   - Změna 2: [popis]

   ## ⚠️ Breaking Changes
   <!-- Smazat sekci pokud žádné nejsou -->
   - Žádné breaking changes

   ## 📦 Závislosti a Konfigurace
   <!-- Smazat sekci pokud žádné nejsou -->
   - Nové env proměnné: žádné
   - Nové závislosti: žádné
   - Migrace DB: žádné

   ## Jak otestovat
   Postupujte podle těchto kroků pro ověření změn v UI:
   1. [Krok 1 - např. Přejděte na stránku Nastavení]
   2. [Krok 2 - např. Klikněte na tlačítko "Nová funkce"]
   3. [Krok 3 - např. Vyplňte formulář testovacími daty]
   4. [Očekávaný výsledek - např. Měla by se zobrazit zpráva o úspěchu]

   ## 📸 Screenshots
   <!-- Popište vizuální změny pokud jsou relevantní, nebo smažte sekci -->
   [Popis UI změn - reviewer si může pořídit vlastní screenshoty]

   ## Související issues
   Zavírá #123
   Souvisí s #456

   ## ✅ Checklist pro autora
   - [ ] Kód je otestovaný lokálně
   - [ ] Testy prochází
   - [ ] Dokumentace je aktualizovaná (pokud potřeba)
   - [ ] Breaking changes jsou zdokumentované

   ---

   # 🇬🇧 English

   ## Type of Change
   - [x] ✨ Feature (new functionality)
   - [ ] 🐛 Bugfix (bug fix)
   - [ ] ♻️ Refactor (code refactoring)
   - [ ] 📚 Docs (documentation)
   - [ ] 🔧 Chore (maintenance, configuration)

   ## Summary
   [Detailed description of what this PR does and why]

   ## Changes
   - Change 1: [description]
   - Change 2: [description]

   ## ⚠️ Breaking Changes
   <!-- Delete section if none -->
   - No breaking changes

   ## 📦 Dependencies and Configuration
   <!-- Delete section if none -->
   - New env variables: none
   - New dependencies: none
   - DB migrations: none

   ## How to Test
   Follow these steps to verify the changes in the UI:
   1. [Step 1 - e.g., Navigate to Settings page]
   2. [Step 2 - e.g., Click on "New Feature" button]
   3. [Step 3 - e.g., Fill in the form with test data]
   4. [Expected result - e.g., You should see a success message]

   ## 📸 Screenshots
   <!-- Describe visual changes if relevant, or delete section -->
   [Description of UI changes - reviewer can take their own screenshots]

   ## Related Issues
   Closes #123
   Relates to #456

   ## ✅ Author Checklist
   - [ ] Code is tested locally
   - [ ] Tests are passing
   - [ ] Documentation is updated (if needed)
   - [ ] Breaking changes are documented
   EOF
   )"
   ```

9. Return the PR URL for user to review

Important:

- Determine base branch automatically (usually main/master)
- Ask user for confirmation if unsure about issue relationship (Closes vs Relates to)
- Include all commits in the analysis, not just the latest one
- Keep description clear and informative
- Do NOT include "Generated with Claude Code" in PR description
- ALWAYS include both Czech (first) and English (second) sections in the PR description
- The "Jak otestovat" / "How to Test" section must be detailed and actionable:
  - Include specific UI navigation steps
  - Mention which pages/components to check
  - Describe what data to use for testing
  - Explain expected visual/behavioral outcomes
  - If there are multiple scenarios, list each one separately
- Only include Breaking Changes, Dependencies/Configuration, and Screenshots sections when relevant
- The Type of Change checkboxes should have exactly ONE item checked based on the actual changes
