const urls = [
  "http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
  "http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
  "http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
  "http://localhost:3000/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
  "http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
  "http://localhost:3000/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
];

async function main() {
  for (const u of urls) {
    console.log("Warming up:", u);
    const start = Date.now();
    try {
      const res = await fetch(u);
      console.log(`Status: ${res.status} in ${Date.now() - start}ms`);
    } catch (e) {
      console.error(`Failed ${u}:`, e.message);
    }
  }
}

main();
