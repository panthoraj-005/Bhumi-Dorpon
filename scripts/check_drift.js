const fs = require('fs');

const flood = JSON.parse(fs.readFileSync('./mocks/flood.json', 'utf8'));
const river = JSON.parse(fs.readFileSync('./mocks/river_erosion.json', 'utf8'));

let maxFloodDrift = 0;
for (const ev of flood.events) {
  const plotSum = ev.plotStatus.reduce((acc, ps) => acc + ps.floodedAreaDecimal, 0);
  const diff = Math.abs(plotSum - ev.floodedAreaDecimal);
  const pct = ev.floodedAreaDecimal > 0 ? (diff / ev.floodedAreaDecimal) * 100 : 0;
  if (pct > maxFloodDrift) maxFloodDrift = pct;
}
console.log('Max flood drift percent:', maxFloodDrift.toFixed(3) + '%');

let maxRiverDrift = 0;
for (const res of Object.values(river.results)) {
  const plotSum = (res.owners || []).reduce((acc, o) => acc + o.lossDecimal, 0);
  const diff = Math.abs(plotSum - res.totalLossDecimal);
  const pct = res.totalLossDecimal > 0 ? (diff / res.totalLossDecimal) * 100 : 0;
  if (pct > maxRiverDrift) maxRiverDrift = pct;
}
console.log('Max river drift percent:', maxRiverDrift.toFixed(3) + '%');
