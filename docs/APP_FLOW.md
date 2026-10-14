# APP FLOW — ভূমিদর্পণ (BhumiDorpon) | সংস্করণ 1.1

> UI-র সব লেখা ইংরেজিতে। ডাটা শুধু mock। সব ম্যাপ Leaflet দিয়ে তৈরি। এই ডকুমেন্টে ইংরেজি লেবেলগুলো UI-তে যেভাবে লেখা হবে সেভাবেই দেওয়া আছে।

---

## 1. সাইট ম্যাপ ও রুট

```
Home Dashboard                                  /
├── River Erosion                               /river-erosion
│   ├── A. Recorded  /river-erosion/recorded?d=&u=&r=      → mouza list → /river-erosion/recorded/[mouzaId]
│   └── B. Forecast  /river-erosion/forecast?d=&u=&r=      → mouza list → /river-erosion/forecast/[mouzaId]
├── Flood                                       /flood?d=&u=&m=&year=
│   └── flood list → /flood/[mouzaId]/[floodId]
│        └── click owner name → /flood/[mouzaId]/[floodId]/owner/[ownerId]
├── Landslide                                   /landslide
│   ├── A. Recorded  /landslide/recorded?d=&u=&h=          → event list → /landslide/recorded/[eventId]
│   └── B. Forecast  /landslide/forecast?d=&u=&h=          → event list → /landslide/forecast/[eventId]
├── Char Formation & Erosion                    /char
│   ├── A. Recorded  /char/recorded?d=&u=&r=               → char list → /char/recorded/[resultId]
│   └── B. Forecast  /char/forecast?d=&u=&r=               → char list → /char/forecast/[resultId]
└── Coastal Erosion & Land Accretion            /coastal
    ├── A. Recorded  /coastal/recorded?d=&u=               → mouza list → /coastal/recorded/[resultId]
    └── B. Forecast  /coastal/forecast?d=&u=               → mouza list → /coastal/forecast/[resultId]
```

নির্বাচন (`d`=district, `u`=upazila, `r`=river, `h`=hill, `m`=mouza) URL query-তে থাকবে। ফলে refresh, back বাটন ও লিঙ্ক শেয়ার ঠিকঠাক কাজ করে এবং স্বয়ংক্রিয় টেস্ট সহজ হয়।

## 2. গ্লোবাল ন্যাভিগেশন

- **বাম সাইডবার (আইকন):** Home, River Erosion, Flood, Landslide, Char, Coastal, Settings।
- **টপবার:** বড় পেজ শিরোনাম, সময়কাল ফিল্টার ("Last 1 year"), একক টগল (Decimal | Acre | Hectare)।
- **ডেমো ব্যানার (সব পেজে):** "Demo data: all names, plots and figures are fictional."
- **Breadcrumb:** Home › Module › Option › District › Upazila › … › Result।

## 3. স্ক্রিন-বাই-স্ক্রিন

### S0: Home Dashboard
1. টগল: **Recorded | Forecast**।
2. KPI কার্ড: Total land lost, Total land gained, Affected owners, Compensation।
   - Recorded: Estimated, Paid, Approved, Pending।
   - **Forecast: শুধু "Projected compensation"।** Paid/Approved/Pending নেই।
3. ট্রেন্ড চার্ট (বছরভিত্তিক loss বনাম gain), hazard অনুযায়ী বার চার্ট, "Top affected districts" তালিকা, ডান "Affected owners" প্যানেল, ম্যাপ প্রিভিউ কার্ড।
4. নিচে ৫টি মডিউল কার্ড।
5. সব সংখ্যা মডিউলগুলোর একই mock ডাটাসেট থেকে হিসাব হবে।

### S1: Module Landing
- ব্যাখ্যা, শেষ আপডেটের তারিখ, আপডেট চক্র ("Updated yearly")।
- দুটি কার্ড: **A. Recorded Data** ও **B. Deep Learning Forecast** (Flood-এ একটিই পথ)।

### S2: Selector + Result List (একই পেজে)
**Selector ধাপ:**
| মডিউল | ধাপ |
|---|---|
| River Erosion | District › Upazila › River |
| Flood | District › Upazila › Mouza (+ ঐচ্ছিক Year) |
| Landslide | District › Upazila › Hill |
| Char | District › Upazila › River |
| Coastal | District › Upazila |

**আচরণের নিয়ম:**
- ধাপ n সক্রিয় হয় যখনই ধাপ n−1-এ মান আছে। কখনো আটকে থাকে না।
- ড্রপডাউনের অপশন ডাটাসেট থেকে আসে, শুধু বৈধ সমন্বয় দেখায় (যেমন শুধু ওই উপজেলার নদী)।
- যে অপশনে এই মডিউল/মোডের রেকর্ড আছে তার পাশে ছোট ● চিহ্ন।
- আগের ধাপ বদলালে পরের ধাপগুলো রিসেট।
- শেষ ধাপ বাছামাত্র নিচে ফলাফলের তালিকা লোড হয় (skeleton → ফলাফল বা empty state)।
- A/B বদলালে নির্বাচন রেখে ডাটা রিলোড।

**ফলাফল তালিকার আইটেম:**
- River: riverside mouza (Mouza name, Total loss, Affected owners)।
- Flood: বন্যা কার্ড (Date, Severity, Flooded area, Max depth, Duration, Affected owners)।
- Landslide: ঘটনা (Date/Predicted period, Soil volume, Affected area)।
- Char: চর (Char name, Net change, Trend)।
- Coastal: মৌজা বা "Unassigned new land" (Name, Net change, Trend)।

### S3: Result Detail (River, Landslide, Char, Coastal)
উপর থেকে নিচে:
1. **Summary strip:** নাম, সময়কাল, total loss, total gain, trend; Forecast হলে Forecast ব্যাজ ও confidence।
2. **হ্যাজার্ডের নিজস্ব ম্যাপ** (DESIGN.md §7)। Before/After swipe, লেয়ার টগল, legend।
3. **Info cards:** শতকরা পরিবর্তন, গড় বার্ষিক হার; Landslide: soil volume, scar area, slope, trigger rainfall; Forecast: confidence।
4. **Owner table:**
   - Recorded: Owner | **Dag No.** | **Khatian No.** | Area | Est. compensation | Status | Paid।
   - **Forecast: Owner | Dag No. | Khatian No. | Projected area | Projected compensation। Status ও Paid নেই।**
5. Char ও Coastal-এ আলাদা **Unowned land** কার্ড।
6. Forecast পেজের নিচে disclaimer।

### S4: Flood Detail `/flood/[mouzaId]/[floodId]`
1. Summary strip: Date, Severity, Flooded area, % of mouza, Max depth, Duration।
2. **বন্যার ম্যাপ:** Before (normal water) বনাম After (inundation, ৩ গভীরতা স্তর), দাগ প্লাবনের ভগ্নাংশ অনুযায়ী রঙিন।
3. **Affected owners table** (সার্চসহ): Owner (লিঙ্ক) | **Dag No.** | **Khatian No.** | Flooded area | Depth class।
4. মালিকের নামে ক্লিক → S5।

### S5: Owner Land Page `/flood/[mouzaId]/[floodId]/owner/[ownerId]`
1. হেডার: Owner name, সারসংক্ষেপ (plots, total area, total flooded), "Back to flood" লিঙ্ক।
2. ম্যাপ (Leaflet): মালিকের সব দাগ হাইলাইট (বাকিগুলো ম্লান), প্রতি দাগের চার কোনায় ১–৪ মার্কার।
3. **প্রতিটি দাগের জন্য একটি কার্ড:** Dag No. | Khatian No. | Land class | Area | Flood status (Not flooded / Partial / Full + depth), এবং তার নিচে **চার কোনার কোঅর্ডিনেটের ছোট টেবিল** (Corner | Latitude | Longitude; 1 NW, 2 NE, 3 SE, 4 SW; ছয় দশমিক), সবসময় দৃশ্যমান। একটি কোঅর্ডিনেট বা centroid দেখানো হবে না।
4. বোতাম: প্রতি দাগে "Copy 4 corners"; পেজে "Copy all coordinates", "Download CSV", "Download GeoJSON"।
5. দাগের কার্ডে ক্লিক → ম্যাপ ওই দাগে জুম।

## 4. ইন্টার‍্যাকশন নিয়ম

| ঘটনা | আচরণ |
|---|---|
| District পরিবর্তন | Upazila ও পরের সব ধাপ রিসেট, URL আপডেট |
| Recorded ↔ Forecast | একই নির্বাচন রেখে রিলোড |
| ম্যাপে দাগ hover | টুলটিপ: Dag No., Khatian No., Owner, প্রভাবিত এলাকা |
| ম্যাপে দাগ ক্লিক | টেবিলের সারি হাইলাইট ও স্ক্রল |
| টেবিলের সারি ক্লিক | ম্যাপ ওই দাগে জুম |
| একক টগল | সব সংখ্যা তাৎক্ষণিক রূপান্তর |
| লোড হচ্ছে | skeleton |
| ত্রুটি | বার্তা ও "Try again" বোতাম |

## 5. Empty State বার্তা (ইংরেজি, হুবহু)

| প্রসঙ্গ | বার্তা |
|---|---|
| River erosion, Recorded | No river erosion has occurred here. |
| River erosion, Forecast | No river erosion is predicted here. |
| Flood | No flood has occurred here. |
| Landslide, Recorded | No landslide has occurred here. |
| Landslide, Forecast | No landslide is predicted here. |
| Char | No char exists here. |
| Coastal | No significant coastal change here. |
| Flood owner search | No owner found with this name. |
| মালিক নেই | No registered owner in this area. |

প্রতিটি empty state: ৬৪ px আইকন, বার্তা, এক লাইনের ব্যাখ্যা, "Choose another area" বোতাম। empty state শুধু সত্যিকারের "কোনো রেকর্ড নেই" অবস্থায় আসবে। বাগের কারণে ফাঁকা পর্দা আসা চলবে না।

## 6. ইউজার জার্নি উদাহরণ

**১. নদী ভাঙ্গন, Recorded:** Home → River Erosion → A. Recorded → Sirajganj › Kazipur › Jamuna → মৌজা বাছাই → নদী-ম্যাপে তীররেখার আগে/পরে ও টেবিলে Dag/Khatian-সহ ক্ষতি দেখা।

**২. বন্যা:** Flood → Sylhet › Companiganj › একটি মৌজা → বন্যার তালিকা → একটি বন্যা বাছাই → ম্যাপ ও মালিক টেবিল → "Abdul Karim" নামে ক্লিক → তার সব দাগের কোঅর্ডিনেট।

**৩. চর, Forecast:** Char → B. Forecast → Bhola › Char Fasson › Meghna → একটি চর → বর্তমান বনাম অনুমানকৃত আকৃতি; টেবিলে Projected loss ও Projected compensation (Paid নেই)।

## 7. স্টেট ডায়াগ্রাম

```
[Home] ─► [ModuleLanding] ─► [Selector + List]
                                   │ (সব ধাপ পূর্ণ)
                      ┌────────────┴────────────┐
                (খালি)                    (আইটেম বাছাই)
                   ▼                           ▼
             [EmptyState]               [ResultDetail]
                                               │ (শুধু Flood)
                                               ▼
                                        [OwnerLandPage]
```

## 8. ম্যাপ ভিউপোর্ট ও ইন্টারেকশন ফ্লো (Map Viewport & Interaction Flow)

1. **নির্বাচন থেকে ভিউপোর্ট রূপান্তর (Selection-to-Viewport)**:
   - সিলেক্টর চেইনে দুর্যোগ ও অঞ্চল নির্বাচন করামাত্র উভয় ম্যাপ উক্ত অঞ্চলের সুনির্দিষ্ট ভৌগোলিক বাউন্ডসে ফিট হয় (`maxZoom: 16` সুরক্ষাসহ)।
2. **দাগ ও মৌজা ফোকাস ফ্লো (Feature Focus Flow)**:
   - ব্যবহারকারী কোনো দাগ নম্বর (Dag No.) বা মালিক সিলেক্ট করলে ম্যাপ স্বয়ংক্রিয়ভাবে উক্ত প্লটের উপর স্মুথ প্যান ও জুম করে (`maxZoom: 17`, `padding: [50, 50]`)।
   - মৌজা পরিবর্তনের সাথে সাথে ম্যাপ মৌজা বাউন্ডারিতে পুনঃসমন্বিত হয়।
3. **বেসম্যাপ রূপান্তর ফ্লো (Basemap Switch Flow)**:
   - Light GIS থেকে Satellite-এ স্যুইচ করলে কোনো প্যান/জুম পরিবর্তন হয় না। কেবল ব্যাকগ্রাউন্ড টাইলে পরিবর্তন আসে; প্রশাসনিক সীমানা ও দুর্যোগের দাগ ওভারলে যথাস্থানে বজায় থাকে।
4. **সিঙ্ক্রোনাইজড ন্যাভিগেশন (Synchronous Dual Zoom & Pan)**:
   - যেকোনো ম্যাপের `+` বা `−` বাটনে প্রথম ক্লিকেই উভয় ম্যাপ একত্রে জুম হয়।
   - একটি ম্যাপ ড্র্যাগ করলে অপর ম্যাপ সমান্তরালভাবে অনুগমন করে।

