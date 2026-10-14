const fs = require('fs');
const turf = require('@turf/turf');

// Load specs
const mouzas = JSON.parse(fs.readFileSync('./mocks/mouzas.json', 'utf8'));
const river = JSON.parse(fs.readFileSync('./mocks/river_erosion.json', 'utf8'));

// Test river mouzas
let totalPlotsGenerated = 0;
let waterCollisions = 0;

for (const mouza of mouzas) {
  const [mLon, mLat] = mouza.centroid || [89.65, 24.57];
  const halfW = 0.008;
  const halfH = 0.005;

  let waterPoly = null;
  // check if river mouza
  const recKey = `river_erosion_recorded_${mouza.id}`;
  if (river.geometries[recKey]) {
    const geo = river.geometries[recKey];
    const pts = geo.riverBefore;
    waterPoly = turf.polygon([[
      ...pts,
      [Number((mLon + halfW).toFixed(6)), pts[pts.length - 1][1]],
      [Number((mLon + halfW).toFixed(6)), pts[0][1]],
      pts[0]
    ]]);
  }

  const numPlots = mouza.totalPlots || 32;
  const lonMin = Number((mLon - halfW + 0.0004).toFixed(6));
  const lonMax = Number((mLon + halfW - 0.0004).toFixed(6));
  const latMin = Number((mLat - halfH + 0.0004).toFixed(6));
  const latMax = Number((mLat + halfH - 0.0004).toFixed(6));

  const cols = 8;
  const rows = Math.ceil((numPlots * 1.6) / cols);
  const dLon = (lonMax - lonMin) / cols;
  const dLat = (latMax - latMin) / rows;

  const validPlots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (validPlots.length >= numPlots) break;
      const sw = [Number((lonMin + c * dLon).toFixed(6)), Number((latMin + r * dLat).toFixed(6))];
      const se = [Number((lonMin + (c + 1) * dLon).toFixed(6)), Number((latMin + r * dLat).toFixed(6))];
      const ne = [Number((lonMin + (c + 1) * dLon).toFixed(6)), Number((latMin + (r + 1) * dLat).toFixed(6))];
      const nw = [Number((lonMin + c * dLon).toFixed(6)), Number((latMin + (r + 1) * dLat).toFixed(6))];

      const corners = [
        { label: "NW", lat: nw[1], lon: nw[0] },
        { label: "NE", lat: ne[1], lon: ne[0] },
        { label: "SE", lat: se[1], lon: se[0] },
        { label: "SW", lat: sw[1], lon: sw[0] },
      ];

      let inWater = false;
      if (waterPoly) {
        for (const pt of [sw, se, ne, nw]) {
          if (turf.booleanPointInPolygon(turf.point(pt), waterPoly)) {
            inWater = true;
            break;
          }
        }
      }
      if (inWater) continue;
      validPlots.push({ corners });
    }
    if (validPlots.length >= numPlots) break;
  }

  if (validPlots.length < numPlots) {
    console.error(`Mouza ${mouza.id} generated only ${validPlots.length} / ${numPlots} plots!`);
  } else {
    totalPlotsGenerated += validPlots.length;
  }
}

console.log(`Generated total ${totalPlotsGenerated} plots. Water collisions: ${waterCollisions}`);
