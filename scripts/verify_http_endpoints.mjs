import http from "http";

const routes = [
  { url: "http://localhost:3000/", name: "Home Dashboard" },
  { url: "http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", name: "River Erosion Recorded" },
  { url: "http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", name: "River Erosion Forecast" },
  { url: "http://localhost:3000/flood?d=sylhet&u=gowainghat&m=mouza_gowainghat_2", name: "Flood Monitoring Explorer" },
  { url: "http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025", name: "Flood Event Detail" },
  { url: "http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_35", name: "Flood Owner Land Detail" },
  { url: "http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra", name: "Landslide Hazards Recorded" },
  { url: "http://localhost:3000/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra", name: "Landslide Hazards Forecast" },
  { url: "http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1", name: "Char Islands" },
  { url: "http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1", name: "Coastal Shifts" },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, data }));
    }).on("error", reject);
  });
}

async function run() {
  console.log("Checking HTTP endpoints and SSR output...");
  for (const r of routes) {
    const res = await fetchUrl(r.url);
    if (res.statusCode === 200) {
      console.log(`✅ [200 OK] ${r.name}`);
    } else {
      console.error(`❌ [${res.statusCode}] ${r.name}`);
    }
  }
}

run().catch(console.error);
