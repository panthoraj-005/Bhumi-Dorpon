Antigravity Prompt — BhumiDorpon Land Information Update (Additive Only)

Update the existing BhumiDorpon project using the six updated specification files supplied with this task. First inspect the actual repository and existing implementation; do not blindly create duplicate components or assume paths/types without checking.

GOAL
On the “ভূমির তথ্য / Land Information” search results page, display these seven primary information cards in exactly this order:
1. জমির পরিচয় ও পরিমাণ
2. মালিকানা সংক্রান্ত তথ্য
3. বিক্রি ও হস্তান্তর সংক্রান্ত তথ্য
4. আইনি তথ্য
5. ভূমি উন্নয়ন কর
6. নিবন্ধন ও ভূমির ইতিহাস
7. এই জমি বন্ধক রেখে ব্যাংক ঋণ নেওয়ার তথ্য

The seventh card should show any available record indicating whether the land parcel is recorded as mortgaged/used as security for a bank loan, bank name, masked loan/mortgage reference, mortgage deed/reference, record date, current status, release date, data source and verification badge. Show only fields supported by the data. Do not expose full account numbers or unmasked personal identifiers.

ORDER OF REMAINING INFORMATION
After these seven primary cards, keep all other existing information below them, including disaster-change history, historical land loss/gain, hazard risk forecasts, submerged-land notices, maps and supplementary analysis. Do not delete or hide existing features.

IMPLEMENTATION RULES
- This is an additive change only. Preserve existing features, page routes, search filters, search behavior, design system and unrelated code. Do not rewrite the app or refactor unrelated components.
- Inspect the actual land search result type, service, translations, mock JSON, report UI and tests first. Extend existing structures and components where possible. Avoid duplicate types or duplicate translation keys.
- Add an optional, backward-compatible loan/mortgage information model using the schema in the updated BACKEND_SCHEMA and TRD files. Represent unknown as unknown/null; never treat missing data as proof that no loan exists.
- This project currently uses deterministic mock data. Do not claim live access to banks, land offices or mortgage registries. Use “বাহ্যিক ডেটা সংযোগ প্রয়োজন” when official verification requires an integration that is not present. If using sample records, label them “ডেমো ডেটা”. Never invent a real verified loan record.
- Add complete Bangla and English translations for the new card, fields, statuses, helper text, tooltips and empty states through the central translation system. Bangla is the default. In Bangla mode, ensure table headings, row labels, values/statuses and empty states are also Bangla where applicable, with Bengali numerals consistent with existing localization. Do not leave hard-coded English labels in the Bangla UI.
- Match existing styling, status badges, spacing and responsive behavior. Keep the seven cards in the required order. On mobile, prevent horizontal overflow.
- Keep the existing disaster/risk information below the seven primary cards.
- Add/update tests for demo record, unavailable record, unknown status, released mortgage, bilingual rendering, and old records with no loanMortgageInfo property.
- Run the relevant tests, lint/type checks and production build available in the project. Fix issues caused by this change.

DONE WHEN
The seven cards appear in the exact requested order; the new bank loan/mortgage card works with honest source/status handling; the remaining existing information appears below; Bangla and English both work; existing functionality is preserved; and checks are reported accurately. At the end, summarize the exact files changed, tests/checks run and any limitations. Do not say a check passed unless it was actually run.
