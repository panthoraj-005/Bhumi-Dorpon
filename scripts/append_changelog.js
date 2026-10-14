const fs = require('fs');

const section = `

---

## Change 2: Four-Corner Plots & Flood Owner Page Coordinates (Part 1)

### Step 1: Baseline Audit Findings

1. **Current Flood Owner Page Audit (\`/flood/[mouzaId]/[floodId]/owner/[ownerId]\`)**:
   - **Observed Route**: Audited \`/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_35\` in live browser (captured screenshot \`audit_current_owner_page.png\`).
   - **Single Coordinate (Centroid) Display**: The parcel register table currently displays a single coordinate per plot under the header column \`"Centroid (Lat, Lon — 6 Decimals)"\` (e.g. \`24.555800° N, 89.628068° E\`).
   - **Hidden Corner Coordinates**: Corner coordinates are not visible by default and are tucked behind an expander row accordion (\`Corners ˅\` / \`Collapse ˄\`).
   - **Map Numbering & Markers**: The cadastral SVG map displays numbered badges (1, 2, 3) placed only at the plot centroids. It does not mark the four corners 1–4 on each plot polygon.
   - **Missing Exports**: The page only features \`"Copy Coordinates"\` and \`"Download GeoJSON"\` buttons; it lacks a \`"Download CSV"\` button with corner coordinate columns (\`c1_lat, c1_lon...\`), \`"Copy 4 corners"\` per plot card, and \`"Copy all coordinates"\` for the whole portfolio.

2. **Current Plot Geometry Generator Audit (\`/scripts/generate-mocks.ts\`)**:
   - **Generator Logic**: Plots are generated in lines 440–488 of \`scripts/generate-mocks.ts\` using an orthogonal grid layout (\`dLon = 2 * halfW / cols\`, \`dLat = 2 * halfH / rows\`).
   - **Polygon Vertices**: \`plots.json\` contains 3,500 plots, each represented as a closed rectangular loop of 5 points \`[ [lonMin, latMin], [lonMax, latMin], [lonMax, latMax], [lonMin, latMax], [lonMin, latMin] ]\`.
   - **Irregular Geometry**: Plots are currently axis-aligned rectangles, not irregular quadrilaterals with explicit labeled corners (\`NW\`, \`NE\`, \`SE\`, \`SW\`).
   - **Data Types**: \`Plot\` in \`lib/types.ts\` does not contain \`corners: [Corner, Corner, Corner, Corner]\`.
   - **Data Layer Response**: \`getOwnerPlots(floodId, ownerId)\` currently returns \`centroid\` and \`boundaryCoordinates\` rather than strict 4 corners.
`;

const current = fs.readFileSync('docs/CHANGE_LOG.md', 'utf8');
fs.writeFileSync('docs/CHANGE_LOG.md', current.trimEnd() + '\n' + section);
console.log('CHANGE_LOG.md updated!');
