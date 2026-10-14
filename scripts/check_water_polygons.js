const fs = require('fs');
const turf = require('@turf/turf');

const plots = JSON.parse(fs.readFileSync('./mocks/plots.json', 'utf8'));
const river = JSON.parse(fs.readFileSync('./mocks/river_erosion.json', 'utf8'));
const charData = JSON.parse(fs.readFileSync('./mocks/char.json', 'utf8'));
const mouzas = JSON.parse(fs.readFileSync('./mocks/mouzas.json', 'utf8'));
const mouzaMap = new Map(mouzas.map(m => [m.id, m]));

// Build water polygons per mouza:
// 1. River erosion water east of riverBefore for river mouzas within that mouza's boundary
const mouzaWaterMap = new Map();

for (const [key, geo] of Object.entries(river.geometries)) {
  // key is e.g. river_erosion_recorded_mouza_kazipur_1
  const mId = key.replace('river_erosion_recorded_', '').replace('river_erosion_forecast_', '');
  const mouza = mouzaMap.get(mId);
  if (!mouza || !geo.riverBefore || geo.riverBefore.length < 3) continue;

  const [mLon, mLat] = mouza.centroid || [89.65, 24.57];
  const halfW = 0.008;
  const halfH = 0.005;

  const pts = geo.riverBefore;
  try {
    const waterPoly = turf.polygon([[
      ...pts,
      [Number((mLon + halfW).toFixed(6)), pts[pts.length - 1][1]],
      [Number((mLon + halfW).toFixed(6)), pts[0][1]],
      pts[0]
    ]]);
    if (!mouzaWaterMap.has(mId)) mouzaWaterMap.set(mId, []);
    mouzaWaterMap.get(mId).push(waterPoly);
  } catch (e) {}
}

console.log(`Checking ${plots.length} plots against mouza water bodies...`);

let cornerWaterErrors = 0;
for (const plot of plots) {
  const waterList = mouzaWaterMap.get(plot.mouzaId) || [];
  if (waterList.length === 0) continue;

  for (const corner of plot.corners) {
    const pt = turf.point([corner.lon, corner.lat]);
    for (const wp of waterList) {
      if (turf.booleanPointInPolygon(pt, wp)) {
        cornerWaterErrors++;
        console.error(`Plot ${plot.id} in ${plot.mouzaId} corner ${corner.label} (${corner.lat}, ${corner.lon}) lies in water!`);
      }
    }
  }
}

console.log(`Water check complete. Corners in water: ${cornerWaterErrors}`);
if (cornerWaterErrors === 0) {
  console.log('SUCCESS: No plot corner lies in any water polygon!');
}
