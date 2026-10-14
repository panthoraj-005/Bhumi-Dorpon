# Antigravity Prompt — Add About Project and Team Information to Settings

Continue the existing **BhumiDorpon** project in its current project folder. This is a narrowly scoped feature addition, not a rebuild.

## Goal
When a user opens the existing **Settings** option, show exactly two options:
1. **About Project**
2. **Team Information**

Use the project's existing routing, component patterns, styling system, icon set, and navigation behavior. Inspect the source code and project Markdown files before editing. Do not invent paths or duplicate an existing settings page if one already exists.

## 1. About Project
Create an About Project view/page/dialog consistent with the existing UI. It must explain only the project's purpose and features that already exist in the project. Use the content in `ABOUT_PROJECT_CONTENT.md` as the factual content baseline, then verify it against the current source/docs. If a listed item is not actually implemented, describe it as a demo/mock capability only when the project documents support that, or omit the unsupported claim. Do not add generic promotional text, future plans, invented functionality, unsupported accuracy claims, or claims of live data.

The project content should cover, where confirmed by the existing implementation:
- BhumiDorpon's purpose: visualizing and comparing land/hazard-related changes.
- The five hazard modules: river erosion, flood, landslide, char formation/erosion, and coastal erosion/land formation.
- The side-by-side Before and After map comparison.
- Existing Light GIS and Satellite basemap options, if present.
- Map zoom/pan controls and synchronized comparison behavior, if present.
- Existing hazard overlays, legends, filters, and map information panels.
- Existing dashboard and owner map/page, if present.
- Existing Recorded/Forecast labels and how they are used in the current demo.
- An honest note that the demo uses mock/synthetic data where applicable; do not imply it is live or survey-accurate unless the code proves otherwise.

Keep the copy clear, concise, factual, and organized with short headings or feature bullets. Do not introduce features that are not already part of this project.

## 2. Team Information
Create a Team Information view/page/dialog using exactly these details:
- **Team Name:** GeoNeural
- **Team Leader:** Pantho Raj Biswas
- **Team Member:** Puja Paul
- **Copyright:** © 2026 GeoNeural. All rights reserved.

Preserve the supplied spelling and capitalization. Do not invent roles, biographies, contact information, social links, or extra members.

## UI and behavior requirements
- Settings must show exactly the two requested options: About Project and Team Information.
- Selecting either option opens its corresponding content.
- Provide a clear way to return to Settings or close the view, following the app's existing navigation conventions.
- Reuse the current visual design, spacing, typography, colors, and responsive behavior. Do not redesign the Settings screen or other pages.
- Keep all existing project functionality unchanged.
- Do not add a backend, database, authentication, external API, analytics, or unrelated dependency for this feature.
- Do not add extra Settings options.
- Ensure keyboard accessibility and appropriate labels if the current UI supports them.
- Avoid duplicate navigation entries if a matching route/component already exists.

## Documentation
Update the existing project documents only as needed to reflect this exact feature:
- `PRD.md`
- `APP_FLOW.md`
- `DESIGN.md`
- `CHANGE_LOG.md` (if present)

If any of these files do not exist, do not fabricate a complete replacement project specification. Add a clearly named, small addendum instead. Keep existing documents and the authoritative map specification intact. Do not rewrite unrelated requirements.

Use `ABOUT_PROJECT_CONTENT.md` and `TEAM_INFORMATION_CONTENT.md` as content references.

## Verification
Run the checks available in the repository (such as lint, type-check, build, and relevant tests). Report only checks actually run and their actual outcomes. Do not claim tests passed if they were not run.

## Final response
Summarize:
1. Files changed.
2. Where the two Settings options appear.
3. What About Project says and how the Team Information details are displayed.
4. Checks actually run and any limitations.

Do not make any unrelated changes.
