# PRD — ভূমিদর্পণ (BhumiDorpon)
**Product Requirements Document | সংস্করণ 1.1 (Demo)**

> প্রকল্পের কাজের নাম "ভূমিদর্পণ"। নাম পরিবর্তন করা যাবে।

---

## 1. পটভূমি ও সমস্যা

বাংলাদেশে প্রতি বছর নদী ভাঙ্গন, বন্যা, ভূমিধস ও উপকূলীয় ভাঙ্গনে বিপুল জমি ক্ষতিগ্রস্ত হয়, আবার চর ও উপকূলে নতুন জমিও তৈরি হয়। কিন্তু:

- কোন মৌজার কতটুকু জমি গেল বা এলো, তার একত্র ও হালনাগাদ রেকর্ড নেই।
- কোন জমির মালিক কতটুকু ক্ষতিগ্রস্ত হলেন এবং ক্ষতিপূরণ পেলেন কি না, তা যাচাই করা কঠিন।
- ভবিষ্যতে কোথায় ভাঙ্গন বা ভূমিধস হতে পারে, তার পূর্বাভাস জমির দাগ পর্যায়ে পাওয়া যায় না।
- বন্যার পর জমির সীমানা চেনা কঠিন হয়ে যায়।

## 2. লক্ষ্য (Goals)

1. পাঁচ ধরনের ভূমি-পরিবর্তনের ঘটনার ডাটা এক জায়গায় দেখানো: **নদী ভাঙ্গন, চর গঠন ও ক্ষয়, বন্যা, ভূমিধস, উপকূলীয় ভাঙ্গন ও ভূমি সৃষ্টি**।
2. প্রতিটি ঘটনার জন্য ক্ষতিগ্রস্ত জমি ও নতুন জমির পরিমাণ রেকর্ড করা।
3. জেলা → উপজেলা → (নদী/পাহাড়/মৌজা) → ফলাফল, এই সরল পথে তথ্য খোঁজা।
4. বর্তমান ডাটা এবং Deep Learning ভিত্তিক এক বছরের পূর্বাভাস পাশাপাশি দেখানো।
5. মালিকভিত্তিক ক্ষতির পরিমাণ, আনুমানিক ক্ষতিপূরণ ও ক্ষতিপূরণ প্রদানের অবস্থা দেখানো।

## 3. অ-লক্ষ্য (Non-goals, ডেমো সংস্করণে)

- আসল সরকারি ভূমি রেকর্ডের সাথে লাইভ সংযোগ নেই (Seed/Synthetic ডাটা ব্যবহার হবে)।
- ক্ষতিপূরণ প্রদান বা আবেদন করার সিস্টেম নেই, শুধু দেখানো।
- মোবাইল অ্যাপ নেই, শুধু রেসপনসিভ ওয়েব।
- কোনো backend, ডাটাবেস বা ML মডেল নেই। ডেমোর সব ডাটা, Forecast (পূর্বাভাস) সহ, আগে থেকে বানানো mock ডাটা।
- ওয়েবসাইটের ভাষা শুধু ইংরেজি; ভাষা টগল নেই। (এই ডকুমেন্টের বাংলা শব্দ শুধু আপনার বোঝার জন্য; UI-তে ইংরেজি লেখা যাবে।)

## 4. ব্যবহারকারী (Personas)

| Persona | প্রয়োজন |
|---|---|
| ভূমি কর্মকর্তা (AC Land / সার্ভেয়ার) | মৌজাভিত্তিক ক্ষতির হিসাব, দাগ নম্বর, ক্ষতিপূরণ তালিকা |
| দুর্যোগ ব্যবস্থাপনা কর্মকর্তা | জেলা পর্যায়ের সারসংক্ষেপ ও পূর্বাভাস, ঝুঁকিপূর্ণ এলাকা চিহ্নিত করা |
| জমির মালিক / সাধারণ নাগরিক | নিজের জমি ক্ষতিগ্রস্ত হয়েছে কি না, ক্ষতিপূরণের অবস্থা |
| গবেষক / শিক্ষার্থী | সময়ভিত্তিক ডাটা ও মডেল পূর্বাভাস দেখা |

## 5. ফিচার তালিকা

### 5.1 হোম ড্যাশবোর্ড
- সারাদেশের সারসংক্ষেপ কার্ড: মোট ক্ষতিগ্রস্ত জমি, মোট নতুন জমি, ক্ষতিগ্রস্ত মালিক সংখ্যা, প্রদত্ত বনাম বকেয়া ক্ষতিপূরণ।
- **বর্তমান ডাটা** ও **অনুমানকৃত ডাটা** আলাদা ট্যাবে (UI-তে লেখা: Recorded | Forecast)। Forecast ট্যাবে ক্ষতিপূরণ কার্ডে শুধু আনুমানিক (Projected) মোট দেখাবে; প্রদত্ত/অনুমোদিত/বকেয়া দেখাবে না।
- ড্যাশবোর্ডের সব সংখ্যা মডিউলগুলোর একই mock ডাটাসেট থেকে হিসাব হবে, যাতে ড্যাশবোর্ড ও মডিউল পেজের সংখ্যা মেলে।
- বছরভিত্তিক ট্রেন্ড চার্ট (ক্ষতি বনাম সৃষ্টি)।
- দুর্যোগ অনুযায়ী ভাগ (donut/bar)।
- সবচেয়ে ক্ষতিগ্রস্ত জেলার তালিকা।
- ড্যাশবোর্ডের নিচে পাঁচটি দুর্যোগ মডিউলের কার্ড।

### 5.2 মডিউল ১: নদী ভাঙ্গন (বছরে একবার আপডেট)
নির্বাচন-পথ (A ও B-তে একই): **District → Upazila → River → নদীতীরের মৌজার তালিকা → মৌজা বাছাই।** তালিকার প্রতি সারিতে মৌজার নাম ও সংক্ষিপ্ত ক্ষতি থাকবে। যেকোনো নির্বাচনে হয় ফলাফল, নয়তো নির্দিষ্ট empty state আসবে; কখনো ফাঁকা পর্দা নয়।

- **অপশন A, Recorded:**
  - শীর্ষে **নদী ভাঙ্গনের নিজস্ব ম্যাপ**: এক বছর আগের তীররেখা বনাম বর্তমান তীররেখা, ভেঙে যাওয়া অংশ, মৌজা সীমানা, দাগ, কয়েকটি জায়গায় তীর-সরণের দূরত্ব (মিটার)।
  - সারসংক্ষেপ: মৌজার মোট ক্ষতি, ক্ষতিগ্রস্ত মালিক সংখ্যা, গড় তীর-সরণ।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Lost area, Est. compensation, Status, Paid।
  - ভাঙ্গন না থাকলে: "No river erosion has occurred here."
- **অপশন B, Forecast:**
  - শীর্ষে বর্তমান তীররেখা বনাম এক বছর পরের অনুমানকৃত তীররেখা (uncertainty ব্যান্ডসহ), অনুমানকৃত তথ্য ও confidence।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Projected loss, Projected compensation। **টাকা পেয়েছেন কি না (Status/Paid) দেখানো হবে না।**
  - না থাকলে: "No river erosion is predicted here."

### 5.3 মডিউল ২: বন্যা
নির্বাচন-পথ: **District → Upazila → Mouza → বন্যার তালিকা** (ঐচ্ছিক Year ফিল্টার)। বন্যার একটিই পথ, A/B নেই।

1. **বন্যার তালিকা:** প্রতিটি বন্যার কার্ডে তারিখ/সাল, তীব্রতা (Moderate/Severe/Extreme), প্লাবিত এলাকা, সর্বোচ্চ গভীরতা, স্থায়িত্ব, ক্ষতিগ্রস্ত মালিক সংখ্যা।
2. **বন্যা বাছলে বিস্তারিত পেজ:**
   - শীর্ষে **বন্যার নিজস্ব ম্যাপ**: আগে (স্বাভাবিক জলাশয়) বনাম পরে (প্লাবনের বিস্তার, গভীরতার তিন স্তর), দাগ ও তাদের প্লাবিত অবস্থা।
   - সারসংক্ষেপ কার্ড: প্লাবিত এলাকা, মৌজার কত শতাংশ, সর্বোচ্চ গভীরতা, স্থায়িত্ব।
   - **ক্ষতিগ্রস্ত মালিকদের তালিকা** (সার্চসহ): Owner (ক্লিকযোগ্য নাম), **Dag No., Khatian No.**, Flooded area, Depth class। এক মালিকের একাধিক দাগ থাকলে প্রতি দাগে আলাদা সারি।
3. **মালিকের নামে ক্লিক করলে মালিকের জমির পেজ:** ওই মালিকের মৌজার সব দাগের তালিকা। **প্রতিটি দাগের জন্য চারটি কোনার কোঅর্ডিনেট (Corner 1 NW, 2 NE, 3 SE, 4 SW; latitude, longitude, ছয় দশমিক) সবসময় দেখা যাবে, লুকানো থাকবে না।** সাথে Dag No., Khatian No., Land class, Area ও প্লাবিত অবস্থা। ম্যাপে (Leaflet) মালিকের জমি হাইলাইট ও প্রতি দাগের চার কোনায় ১–৪ চিহ্ন, বাকিগুলো ম্লান। প্রতি দাগে "Copy 4 corners", পেজে "Copy all coordinates", CSV ও GeoJSON ডাউনলোড।
- বন্যা না হলে: "No flood has occurred here."

### 5.4 মডিউল ৩: ভূমিধস (পার্বত্য অঞ্চল)
নির্বাচন-পথ (A ও B-তে একই): **District → Upazila → Hill → ভূমিধসের ঘটনার তালিকা → ঘটনা বাছাই।** তালিকায় তারিখ, মাটির পরিমাণ, আক্রান্ত এলাকা।

- **অপশন A, Recorded:**
  - শীর্ষে **ভূমিধসের নিজস্ব ম্যাপ**: পাহাড়ের ঢাল (কনটুর ও hillshade), ধসের আগে বনাম পরে, ধসের ক্ষত (scar) ও জমে থাকা মাটির এলাকা (debris)।
  - তথ্য: ধসে যাওয়া মাটির আনুমানিক পরিমাণ (m³), ক্ষত-এলাকা, ঢালের কোণ, ট্রিগার বৃষ্টি।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Lost area, Est. compensation, Status, Paid।
  - না হলে: "No landslide has occurred here."
- **অপশন B, Forecast:**
  - ম্যাপে ঝুঁকিপূর্ণ জোন (Moderate/High/Very high) ও সম্ভাব্য ধসের এলাকা (ড্যাশ), সম্ভাবনা ও আনুমানিক মাটির পরিমাণ।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Projected loss, Projected compensation (Status/Paid নেই)।
  - না থাকলে: "No landslide is predicted here."

### 5.5 মডিউল ৪: চর গঠন ও ক্ষয় (বছরে একবার সার্ভে)
নির্বাচন-পথ (A ও B-তে একই): **District → Upazila → River → চরের তালিকা → চর বাছাই।** চর না থাকলে "No char exists here."

- **অপশন A, Recorded:**
  - শীর্ষে **চরের নিজস্ব ম্যাপ**: এক বছর আগের চরের আকৃতি বনাম বর্তমান; জমা (accretion) সবুজ, ক্ষয় (erosion) কোরাল।
  - তথ্য: জমি বাড়ছে না কমছে, শতকরা পরিবর্তন, নিট পরিবর্তন।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Gained/Lost area, Est. compensation (ক্ষয়ের ক্ষেত্রে), Status, Paid।
  - **Unowned land** আলাদা কার্ডে।
- **অপশন B, Forecast:** বর্তমান বনাম এক বছর পরের অনুমানকৃত আকৃতি; মালিক টেবিল: **Owner, Dag No., Khatian No.**, Projected gain/loss, Projected compensation। Unowned land দেখাবে। Status/Paid নেই।

### 5.6 মডিউল ৫: উপকূলীয় ভাঙ্গন ও ভূমি সৃষ্টি (উপকূলীয় জেলা)
নির্বাচন-পথ (A ও B-তে একই): **District → Upazila → মৌজার তালিকা (মৌজাবিহীন নতুন জমিসহ) → বাছাই।**

- **অপশন A, Recorded:**
  - শীর্ষে **উপকূলের নিজস্ব ম্যাপ**: আগের বনাম বর্তমান তটরেখা, সমুদ্রের গভীরতা স্তর, জোয়ার-ভাটার চর, বেড়িবাঁধ; ক্ষয় ও নতুন জমি আলাদা রঙে।
  - তথ্য: জমি বাড়ছে না কমছে, নিট পরিবর্তন।
  - মালিক টেবিল: **Owner, Dag No., Khatian No.**, Gained/Lost area, Est. compensation, Status, Paid। Unowned land আলাদা কার্ডে।
- **অপশন B, Forecast:** বর্তমান বনাম এক বছর পরের অনুমানকৃত তটরেখা; মালিক টেবিল: **Owner, Dag No., Khatian No.**, Projected gain/loss, Projected compensation। Status/Paid নেই।

### 5.7 সব মডিউলে সাধারণ নিয়ম
- **Dynamic:** ড্রপডাউনের প্রতিটি পছন্দ সত্যিই ডাটা ফিল্টার করবে। হার্ডকোড করা ফলাফল নেই। ড্রপডাউনের তালিকা ডাটাসেট থেকে আসবে।
- **কখনো ফাঁকা পর্দা নয়:** প্রতিটি বৈধ নির্বাচনে ফলাফল, নয়তো নির্দিষ্ট empty state। লোড হওয়ার সময় skeleton, ত্রুটিতে retry।
- **Cascading dropdown:** আগের ধাপ না বাছলে পরের ধাপ নিষ্ক্রিয়, কিন্তু আগের ধাপ বাছলেই সক্রিয়। আগের ধাপ বদলালে পরের ধাপ রিসেট। নির্বাচন URL-এ থাকবে (refresh করলেও থাকবে)। যে জেলা/উপজেলায় এই মডিউলের রেকর্ড আছে তাতে ছোট চিহ্ন থাকবে।
- **প্রতি দুর্যোগের নিজস্ব ম্যাপ:** নদী ভাঙ্গন, বন্যা, ভূমিধস, চর, উপকূল, পাঁচটির ম্যাপ ডিজাইন ও স্তর আলাদা (DESIGN.md §7)। একই ম্যাপ সবখানে ব্যবহার করা যাবে না।
- **মালিক টেবিলের বাধ্যতামূলক কলাম:** Recorded: Owner | **Dag No.** | **Khatian No.** | Area | Est. compensation | Status | Paid। Forecast: Owner | **Dag No.** | **Khatian No.** | Projected area | Projected compensation। (Forecast-এ Status ও Paid নেই।)
- **সব ম্যাপ (Before/After সহ) Leaflet দিয়ে তৈরি**, MapLibre নয়। ম্যাপ তুলনা: swipe slider ও পাশাপাশি দৃশ্য। টেবিলে সার্চ, সর্ট ও CSV ডাউনলোড।
- **দাগের আকৃতি:** প্রতিটি দাগ ঠিক চার কোনার বহুভুজ (কখনো clip করা হয় না)। যেখানেই দাগের অবস্থান দেখানো হয়, সেখানে একটি বিন্দু নয়, চারটি কোনাই দেখাবে।
- **Light-Themed GIS Basemap (MAP_SPEC.md):** সব ম্যাপে একই হালকা GIS বেসম্যাপ: ভূমি, জলাশয়, রাস্তা, বসতি, বাঁধ, উপজেলা ও মৌজা সীমানা, graticule, স্কেল ও north arrow।
- **মৌজার নাম সব ম্যাপে:** প্রতিটি ম্যাপে মৌজার নাম ও জে.এল. নং। নদী ভাঙ্গন, চর ও উপকূল ম্যাপে প্রতিটি মৌজার লেবেলে ক্ষতি/বৃদ্ধি (Forecast-এ অনুমানকৃত) এবং পাশে "Mouza-wise summary" প্যানেল।
- **নদী/সাগরের বর্তমান অবস্থা:** ম্যাপের পাশে "Water status" কার্ড (নদীর প্রস্থ, তীর-সরণ, তটরেখার পরিবর্তন ইত্যাদি)।
- **বন্যা:** প্রতিটি মালিকের জমি আলাদা রঙে, মালিকের রঙ-সূচি প্যানেলসহ।
- **ভূমিধস:** Terrain shading (hillshade) + elevation layer (hypsometric tint, কনটুর, spot height), ঢালের কোণ ও Elevation change (cut/fill) লেয়ার।
- ভাষা: শুধু ইংরেজি। একক: Decimal (ডিফল্ট), Acre, Hectare।
- মুদ্রা ৳ (BDT)।

## 6. পরিমাণের একক ও পরিভাষা

- জমির একক: **শতাংশ** (ডিফল্ট), একর, হেক্টর (টগলযোগ্য)।
- দাগ নম্বর (Plot/Dag No.), খতিয়ান নম্বর, মৌজা, জে.এল. নম্বর।
- আনুমানিক ক্ষতিপূরণ = ক্ষতিগ্রস্ত জমি × জমির শ্রেণির নির্ধারিত হার (সূত্র TRD-তে)।

## 7. Success Metrics (ডেমোর জন্য)

- একজন ব্যবহারকারী ৫টির যেকোনো মডিউলে ৩০ সেকেন্ডের মধ্যে মৌজা-পর্যায়ের ফলাফলে পৌঁছাতে পারবেন।
- প্রতিটি পেজ ৩ সেকেন্ডের মধ্যে লোড হবে (Seed ডাটাসহ)।
- ড্রপডাউনের যেকোনো বৈধ সমন্বয় বাছলে ফলাফল অথবা নির্দিষ্ট empty state আসবে, ফাঁকা পর্দা আসবে না (স্বয়ংক্রিয় টেস্টে যাচাই)।
- ৫টি মডিউলের ১০টি ফ্লো (A ও B) সম্পূর্ণ কাজ করবে।
- সব empty state বার্তা সঠিকভাবে দেখাবে।

## 8. ঝুঁকি ও সীমাবদ্ধতা

| ঝুঁকি | ব্যাখ্যা | প্রশমন |
|---|---|---|
| ভূমি রেকর্ডের ব্যক্তিগত তথ্য | মালিকের নাম, জমি ও ক্ষতিপূরণের তথ্য সংবেদনশীল | ডেমোতে শুধু কাল্পনিক (synthetic) নাম ও ডাটা; বাস্তবায়নে অ্যাক্সেস কন্ট্রোল ও আইনি অনুমোদন |
| পূর্বাভাসের নির্ভুলতা | এক বছর আগাম নদীভাঙ্গনের দাগ-পর্যায়ের পূর্বাভাস অনিশ্চিত | প্রতিটি পূর্বাভাসে confidence/uncertainty ব্যান্ড ও স্পষ্ট disclaimer |
| স্যাটেলাইট ইমেজের সীমা | Sentinel-2 এর রেজোলিউশন ১০ মি.; মেঘ ও বর্ষায় ইমেজ কঠিন | SAR (Sentinel-1) ব্যবহার, মেঘমুক্ত কম্পোজিট |
| মৌজা ম্যাপ ও দাগ ডাটা | ডিজিটাল শেপফাইল সবসময় সহজলভ্য নয় | ডেমোতে কাল্পনিক জ্যামিতি; বাস্তবে ভূমি মন্ত্রণালয়ের সাথে চুক্তি |
| ক্ষতিপূরণের হিসাব | আইনি নিয়ম ও হার প্রযোজ্য | ডেমোতে "আনুমানিক" লেবেল, কনফিগারযোগ্য হার |

## 9. ডেমোর জন্য প্রস্তাবিত পাইলট এলাকা

| মডিউল | প্রস্তাবিত পাইলট |
|---|---|
| নদী ভাঙ্গন ও চর | সিরাজগঞ্জ, শরীয়তপুর, চাঁদপুর (যমুনা/পদ্মা/মেঘনা) |
| বন্যা | সিলেট, সুনামগঞ্জ, কুড়িগ্রাম |
| ভূমিধস | রাঙ্গামাটি, বান্দরবান, কক্সবাজার |
| উপকূলীয় | ভোলা, নোয়াখালী, খুলনা, সাতক্ষীরা |

ডেমোতে নির্বাচন-তালিকায় আসা প্রতিটি জেলা ও উপজেলার ডাটা থাকবে। শুধু প্রতি মডিউলে কয়েকটি উপজেলা ইচ্ছাকৃতভাবে ফাঁকা রাখা হবে, যাতে empty state দেখা যায়।

## 10. মাইলস্টোন

1. M1: ফ্রন্টএন্ড UI ও Seed ডাটা দিয়ে সব ফ্লো (সপ্তাহ ১–২)
2. M2: Backend API, PostGIS ডাটাবেস (সপ্তাহ ২–৩)
3. M3: ম্যাপ তুলনা ও স্যাটেলাইট ইমেজ ইন্টিগ্রেশন (সপ্তাহ ৩–৪)
4. M4: প্রি-কম্পিউটেড ML প্রেডিকশন সংযোগ (সপ্তাহ ৪–৫)
5. M5: পরীক্ষা, পলিশ, ডেমো প্রেজেন্টেশন (সপ্তাহ ৬)

---

## 11. Map Interaction Update — Before/After Comparison and Basemap Switching

This amendment adds to the existing PRD. All other existing product requirements remain in force.

### 11.1 Before/After comparison layout
- Remove the draggable swipe/comparison bar from the primary map-comparison experience.
- Use two independently visible, side-by-side map panels: **Before** on the left and **After** on the right.
- Place all related statistics, legends, context cards, mouza summaries, affected-owner tables, and explanatory information below the two maps in a clear full-width section. Keep map-specific controls close to their corresponding map.
- Both maps must represent the same area and use matching initial bounds and zoom. Panning and zooming should be synchronized between the two maps unless a user explicitly disables synchronization.
- Preserve the existing Recorded/Forecast mode distinction. In Forecast mode, the left panel shows the current/before state and the right panel shows the projected state.
- Provide an accessible **Side-by-side** comparison as the default. Do not require a drag handle to inspect differences.

### 11.2 Dedicated map zoom controls
- Place separate visible **Zoom in (+)** and **Zoom out (−)** buttons beside or inside the map chrome on every map, with adequate spacing and accessible labels.
- Clicking a button must change the actual Leaflet map zoom. Controls must not depend on first clicking or activating another mode.
- In side-by-side comparison, zoom changes should stay synchronized across both maps. Panning should also stay synchronized.
- Keep normal mouse-wheel, touch pinch, keyboard, and Leaflet interactions available where supported. Do not intercept clicks intended for map controls or the map itself.
- Controls must remain visible and usable at desktop, tablet, and mobile widths and must not cover important map labels or legends.

### 11.3 Basemap type switch
- Add a clearly visible **Map type** switch/control on every map, offering at minimum:
  1. **Light GIS** — the existing project Light GIS Basemap and all existing synthetic/vector layers.
  2. **Satellite** — real satellite imagery from a reputable tile provider, with required attribution and compliant usage.
- Where available and licensing permits, also offer **Street** as a real-world street-map option. Do not require it if no suitable compliant provider is available.
- Switching basemap must not reset the selected hazard, result, Recorded/Forecast mode, visible overlays, owner selection, or current map extent.
- Keep thematic hazard layers, plots, mouza borders/labels, owner colours, terrain layers, hatches, legends, and selection behavior legible over both basemap types. Use appropriate overlay styling for satellite mode.
- Load real tiles only from a provider whose current terms permit the intended use; include visible attribution. Do not bypass provider limits, remove attribution, scrape imagery, or hard-code secret API keys.
- Existing demo geometry is synthetic. Do not imply synthetic mock boundaries are verified real-world parcels or accurately aligned with imagery. When an area's coordinates are synthetic or not verified against a real location, show a persistent **Demo geometry — not survey-accurate** notice while real-world tiles are selected. Do not fabricate real geographic alignment.
- If the external tile source is unavailable or blocked, retain the Light GIS basemap and show a non-blocking fallback/error state.

### 11.4 Acceptance criteria
- Every hazard map, owner map, and dashboard map preview uses the same comparison and map-type interaction conventions where applicable.
- At desktop widths, Before is visibly left and After is visibly right; all supporting information appears below the map pair.
- At mobile widths, maps may stack vertically (Before first, After second), while preserving labels and keeping supporting information below both.
- No swipe bar is required for the default or only comparison workflow.
- Zoom buttons work without an activation step and synchronize both comparison maps.
- Basemap switching works without breaking overlays or changing the selected result.
- Test real tile loading, attribution visibility, offline/error fallback, and demo-geometry notice.

## 12. Corrective Requirements — Hazard-Specific Satellite Context and Map Alignment

This amendment addresses the requirement that imagery must match the selected hazard and region, rather than reusing one generic/static satellite image for every hazard.

- Do not use one hard-coded satellite screenshot, static image, or generic image background for every hazard.
- Satellite mode must use a real geographic tile layer, rendered for the **currently selected region and current map bounds**. It must not display a huge country-wide extent when the user selected a smaller area.
- The imagery must correspond to the location represented by the selected hazard/region data. River erosion should show the selected river corridor; landslide should show the selected hilly/terrain region; char should show the selected river island/sandbar region; flood and coastal hazards should show their selected affected areas.
- Hazard-specific context must come from the project's existing region/hazard data and coordinates. Do not invent coordinates or use unrelated stock photos to make a map appear hazard-specific.
- The Light GIS and Satellite views must represent the **same geographic place** at the same scale/zoom and extent. Switching map type must not shift, stretch, or change the selected location. Both maps in the Before/After pair must also stay synchronized.
- If existing mock coordinates are synthetic or not geographically verified, do not falsely claim they line up with real satellite imagery. Keep the explicit `Demo geometry — not survey-accurate` warning and report which regions cannot yet be aligned accurately.
- Fit the map to the selected region's actual existing bounding box or feature bounds on initial selection. Avoid excessive empty space; do not zoom out to a country-wide view unless the user selected a country-wide extent.
- If a selected region has no valid bounds, show a clear fallback state or use the documented demo extent; do not silently reuse another hazard's imagery or bounds.

### Zoom control corrective requirement
- The `+` and `−` controls must be direct, immediately working buttons. A user must not have to click the zoom control once to activate it and then click again to zoom.
- Remove any zoom-tool activation/toggle state that causes the first click to be consumed. Clicking `+` or `−` must call the actual map zoom operation on that same click and synchronize the paired map.
