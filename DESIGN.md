# DESIGN — ভূমিদর্পণ (BhumiDorpon)
**Minimalistic Light Mode | রেফারেন্স: আপলোড করা ড্যাশবোর্ড ছবি**

---

> **নোট:** UI-র সব লেখা ইংরেজিতে এবং সব ডাটা mock। এই ডকুমেন্টের বাংলা লেবেল শুধু বর্ণনা। "অনুমান/পূর্বাভাস" = UI-তে **Forecast**।

## 1. ডিজাইন দর্শন

রেফারেন্স ছবিটি ডার্ক ও নিয়ন-লাইম। আমরা তার **লেআউট ভাষা** রাখছি (বাম আইকন সাইডবার, গোলাকার কার্ড গ্রিড, বড় সংখ্যা, লাইন/বার চার্ট, লাইম পিল বোতাম) কিন্তু **রং ও ঘনত্ব** লাইট মোডে নিয়ে যাচ্ছি।

- **শান্ত ও পরিষ্কার:** সাদা কার্ড, হালকা ধূসর-সবুজাভ ব্যাকগ্রাউন্ড, অল্প বর্ডার, প্রায় কোনো শ্যাডো নেই।
- **ডাটা আগে:** বড় সংখ্যা, স্পষ্ট লেবেল, কম সাজসজ্জা।
- **একটিমাত্র অ্যাকসেন্ট:** লাইম। শুধু প্রাইমারি বোতাম, সক্রিয় নেভ আইটেম ও হাইলাইটে।
- **অর্থবহ রং:** ক্ষতি = কোরাল, বৃদ্ধি = সবুজ, পূর্বাভাস = ড্যাশ/হ্যাচ প্যাটার্ন। রং একা অর্থ বহন করবে না (আইকন বা লেবেলও থাকবে)।

## 2. রং (Design Tokens)

```css
:root {
  /* সারফেস */
  --bg:            #F6F7F2;   /* পেজ ব্যাকগ্রাউন্ড */
  --surface:       #FFFFFF;   /* কার্ড */
  --surface-alt:   #F0F2EA;   /* ইনপুট, হালকা ব্লক */
  --border:        #E4E7DC;

  /* টেক্সট */
  --ink:           #14170F;   /* প্রধান */
  --ink-2:         #4A5043;   /* দ্বিতীয় */
  --muted:         #7B8274;   /* লেবেল, অক্ষ */

  /* অ্যাকসেন্ট (লাইম) */
  --accent:        #C8F23A;   /* বোতাম/হাইলাইট ফিল */
  --accent-ink:    #14170F;   /* লাইমের উপর টেক্সট */
  --accent-deep:   #4D7A0A;   /* লাইম-সবুজ লিঙ্ক/লাইন (সাদার উপর পড়ার মতো) */
  --accent-soft:   #EEF8C8;   /* সক্রিয় ব্যাকগ্রাউন্ড */

  /* সেমান্টিক ডাটা রং */
  --loss:          #E4604A;   /* ক্ষতি */
  --loss-soft:     #FBE5E0;
  --gain:          #2F9E62;   /* বৃদ্ধি/নতুন জমি */
  --gain-soft:     #DFF3E8;
  --predicted:     #6A5BD6;   /* অনুমান ব্যাজ/লাইন (ড্যাশ সহ) */
  --predicted-soft:#ECE9FB;
  --water:         #2F7FB8;   /* নদী/পানি লেয়ার */
  --warn:          #E5A200;

  /* স্টেট */
  --focus:         #14170F;
}
```

কনট্রাস্ট নোট: লাইম (#C8F23A) সাদার উপর টেক্সট বা পাতলা লাইনের জন্য ব্যবহার করা যাবে না। সেখানে `--accent-deep` ব্যবহার করতে হবে। লাইমের উপর টেক্সট সবসময় `--ink`।

## 3. টাইপোগ্রাফি

| ভূমিকা | ফন্ট | সাইজ / ওজন |
|---|---|---|
| UI ও বডি | **Inter** | ১৪–১৫ px / ৪০০, ৫০০ |
| পেজ শিরোনাম | **Space Grotesk** | ২৮ px / ৫০০–৬০০ |
| KPI সংখ্যা | Inter (tabular-nums) | ৩২–৩৬ px / ৬০০ |
| কার্ড লেবেল | Inter | ১৩ px / ৫০০, `--muted` |

- সংখ্যায় `font-variant-numeric: tabular-nums`। মুদ্রা `৳1,25,000` (en-BD গ্রুপিং, ইংরেজি অঙ্ক)।

## 4. স্পেসিং, আকার, কোণ

- স্পেসিং স্কেল (px): 4, 8, 12, 16, 20, 24, 32, 40, 56।
- কার্ড রেডিয়াস: **20 px**, ছোট উপাদান: 12 px, পিল বোতাম: 999 px।
- কার্ড প্যাডিং: 20–24 px। গ্রিড গ্যাপ: 16 px।
- বর্ডার: 1 px `--border`। শ্যাডো: প্রায় নেই (`0 1px 2px rgba(20,23,15,.04)`)।
- কনটেন্ট সর্বোচ্চ প্রস্থ: 1440 px।

## 5. অ্যাপ শেল (রেফারেন্স ছবির লেআউট অনুযায়ী)

```
┌────┬──────────────────────────────────────────────────┐
│    │  পেজ শিরোনাম          [সময়কাল ▾] [বাংলা|EN] [শতাংশ ▾]│
│ আই │──────────────────────────────────────────────────│
│ কন │   মূল কনটেন্ট (কার্ড গ্রিড)                        │
│ সা │                                                   │
│ ইড │                                                   │
│ বার│                                                   │
└────┴──────────────────────────────────────────────────┘
```

- **সাইডবার:** প্রস্থ 72 px, সাদা, আইকন-অনলি (hover-এ টুলটিপ, ডেস্কটপে এক্সপ্যান্ড করলে লেবেল)। উপরে লোগো, নিচে সেটিংস/সাহায্য। সক্রিয় আইটেম: `--accent-soft` ব্যাকগ্রাউন্ড ও `--accent-deep` আইকন।
- **টপবার:** বামে বড় পেজ শিরোনাম, ডানে সময়কাল ফিল্টার ("Last 1 year ▾") ও একক টগল (Decimal | Acre | Hectare)। ভাষা টগল নেই।
- **কনটেন্ট:** 12-কলাম গ্রিড।

## 6. হোম ড্যাশবোর্ড লেআউট

রেফারেন্স ছবির গ্রিড অনুসরণ:

| এলাকা | কম্পোনেন্ট |
|---|---|
| উপরে-বামে (বড়, ৮ কলাম) | **ট্রেন্ড কার্ড:** বড় সংখ্যা (মোট ক্ষতিগ্রস্ত জমি), মাসের/বছরের লাইন চার্ট (ক্ষতি বনাম সৃষ্টি), hover টুলটিপ। ডানে ছোট ফিল্টার চিপ |
| উপরে-ডানে (৪ কলাম) | **ক্ষতিপূরণ কার্ড:** মোট আনুমানিক, তিনটি প্রগ্রেস বার (প্রদত্ত, অনুমোদিত, বকেয়া) |
| মাঝের-বামে (৪ কলাম) | **দুর্যোগ বিভাজন:** বার চার্ট (রেফারেন্সের Target Audience-এর মতো) |
| মাঝের-ডানে (৮ কলাম) | **শীর্ষ ক্ষতিগ্রস্ত জেলা:** নম্বরযুক্ত তালিকা, প্রতিটি সারিতে ছোট বার ও ডানে তীর (রেফারেন্সের Top Releases-এর মতো) |
| ডান কলাম | **"এখন" প্যানেল:** মোট ক্ষতিগ্রস্ত মালিক, ছোট sparkline, জেলাভিত্তিক শতাংশ বার (রেফারেন্সের Listeners Now-এর মতো) |
| নিচে | **৫টি মডিউল কার্ড** (আইকন, নাম, শেষ আপডেট, সংক্ষিপ্ত সংখ্যা, "দেখুন" বোতাম) |

- হোমের শীর্ষে **সেগমেন্টেড টগল:** `Recorded | Forecast`। Forecast ট্যাবে ড্যাশ লাইন ও `--predicted` ব্যাজ। **Forecast ট্যাবে ক্ষতিপূরণ কার্ডে শুধু "Projected compensation" মোট; প্রগ্রেস বার নেই।**
- রেফারেন্সের বড় ছবি/প্লেয়ার কার্ডের জায়গায় (নিচ-ডান) **ছোট ম্যাপ প্রিভিউ কার্ড**: সর্বাধিক ক্ষতিগ্রস্ত এলাকার থাম্বনেইল।

## 7. কম্পোনেন্ট স্পেক

### বোতাম
- **প্রাইমারি:** লাইম ফিল, `--ink` টেক্সট, পিল আকার, উচ্চতা 40 px (রেফারেন্সের "+ New Release"-এর মতো)।
- **সেকেন্ডারি:** সাদা ফিল, 1 px বর্ডার।
- **ঘোস্ট:** শুধু টেক্সট, `--accent-deep`।
- ফোকাস: 2 px `--focus` আউটলাইন, 2 px অফসেট।

### ড্রপডাউন / Cascading Selector
- উচ্চতা 44 px, `--surface-alt` ব্যাকগ্রাউন্ড, 12 px রেডিয়াস।
- নিষ্ক্রিয় ধাপ: 50% অপাসিটি, "আগে জেলা বাছুন" প্লেসহোল্ডার।
- ধাপ সূচক: ছোট সংখ্যাযুক্ত বৃত্ত (১ জেলা › ২ উপজেলা › ৩ নদী)।
- সার্চযোগ্য (বাংলা টাইপিং সমর্থিত)।

### স্ট্যাট কার্ড
- লেবেল (muted, 13px), বড় সংখ্যা (36px), ছোট পরিবর্তন চিপ (`▲ ১২.৩%` লাভ হলে `--gain`, ক্ষতি হলে `--loss`)।

### চার্ট
- লাইন: ২ px, লাইন-এর নিচে খুব হালকা গ্রেডিয়েন্ট ফিল (৮% অপাসিটি)।
- গ্রিড লাইন: `--border`, শুধু অনুভূমিক।
- Hover টুলটিপ: গাঢ় (`--ink`) পিল, সাদা টেক্সট (রেফারেন্সের "Mar 22 11,320" ট্যাগের মতো)।
- ক্ষতি = `--loss`, বৃদ্ধি = `--gain`, পূর্বাভাস = একই রং কিন্তু ড্যাশ ও `--predicted` লেবেল।

### ম্যাপ (পাঁচ দুর্যোগ, পাঁচ আলাদা ডিজাইন)

> **বিস্তারিত স্পেক `MAP_SPEC.md`-এ। এই সেকশন সারসংক্ষেপ; দ্বন্দ্ব হলে MAP_SPEC.md চূড়ান্ত।**

**সাধারণ ভিত্তি (MapCompare):**
- **সব ম্যাপ Leaflet দিয়ে।** দুটি সিঙ্ক্রোনাইজড Leaflet ম্যাপ ("Before" ও "After/Forecast") একই কার্ডে স্তূপ করা; উপরেরটি সোয়াইপ ডিভাইডার (CSS clip-path, ড্র্যাগ ও তীরচিহ্ন কী) দিয়ে খোলা হয়। ভিউ সুইচ: Swipe | Side by side | Toggle। Next.js-এ শুধু ক্লায়েন্ট-সাইডে লোড।
- বেসম্যাপ: **Light-Themed GIS Basemap**, সম্পূর্ণ MAP_SPEC.md অনুযায়ী (কাল্পনিক, জেনারেটর-নির্মিত স্তর; কোনো বাইরের tile layer নয়)।
- কন্ট্রোল: `L.control.zoom`, fit to area বোতাম, `L.control.scale`, north arrow, legend, লেয়ার টগল, ওপাসিটি স্লাইডার। হ্যাচ প্যাটার্ন: SVG `<pattern>` defs (দুই ম্যাপেই আলাদা) বা leaflet.pattern প্লাগইন। hillshade `L.imageOverlay` দিয়ে।
- দাগ hover-এ `bindTooltip` (Dag No., Khatian No., Owner, প্রভাবিত এলাকা); ক্লিকে টেবিলের সারি হাইলাইট; টেবিলের সারি ক্লিকে ম্যাপ ওই দাগে জুম। দাগ নম্বর স্থায়ী টুলটিপ/divIcon লেবেলে, জুম প্রায় ১৬-এর উপরে।
- কার্ড: 20 px রেডিয়াস, উচ্চতা 480–560 px। "Synthetic demo geometry" ছোট নোট।
- ক্ষতি: কোরাল হ্যাচ। বৃদ্ধি: সবুজ। Forecast: ড্যাশ আউটলাইন ও `--predicted`। মালিকানাহীন: ধূসর হ্যাচ।

**হ্যাজার্ড অনুযায়ী আলাদা ম্যাপ:**

| দুর্যোগ | Before | After / Forecast | বিশেষ উপাদান |
|---|---|---|---|
| নদী ভাঙ্গন | নদীর বাঁকানো জলরেখা ও গত বছরের তীররেখা (গাঢ় নীল) | বর্তমান তীররেখা, ভেঙে যাওয়া strip কোরাল হ্যাচ। Forecast: ড্যাশ বেগুনি তীররেখা ও uncertainty ব্যান্ড | ৩টি ট্রান্সেক্টে "42 m" ধরনের তীর-সরণ লেবেল, বাইরের বাঁকে বেশি ক্ষয় |
| বন্যা | স্বাভাবিক জলাশয়, খাল, বিল | প্লাবনের বিস্তার তিন গভীরতা স্তরে (Shallow/Moderate/Deep, ফিকে থেকে গাঢ় নীল); দাগ প্লাবনের ভগ্নাংশ অনুযায়ী রঙিন | গভীরতা legend, প্লাবিত দাগের সীমানা গাঢ় |
| ভূমিধস | পাহাড়ের ঢাল: কনটুর লাইন ও hillshade, সবুজ গাছপালা | ধসের ক্ষত (scar, মাটি-বাদামি কোরাল) ও জমে থাকা মাটি (debris runout, হ্যাচ), ঢালের দিক তীর। Forecast: ঝুঁকি জোন (Moderate/High/Very high) | কনটুর ইন্টারভাল লেবেল, ঝরনা/রাস্তা, ঢালের কোণ |
| চর | নদীতে চরের গত বছরের আকৃতি (বালুর রং `#EADFC0`) | বর্তমান আকৃতি: জমা সবুজ, ক্ষয় কোরাল, আগের আকৃতির ড্যাশ রেখা | মালিকানাহীন (খাস) অংশ ধূসর হ্যাচ, চর বাড়ার তীর |
| উপকূল | তটরেখা (ড্যাশ), সমুদ্রের গভীরতা স্তর, জোয়ার-ভাটার চর | বর্তমান তটরেখা (সলিড), সমুদ্রের দিকে নতুন জমি সবুজ, ক্ষয় কোরাল | বেড়িবাঁধ (গাঢ় ড্যাশ), ম্যানগ্রোভ প্যাচ, "No mouza" লেবেলসহ মৌজাবিহীন জমি |

প্রতিটি দুর্যোগের জন্য আলাদা কম্পোনেন্ট ও স্টাইল ফাইল থাকবে। একটি জেনারেটিক ম্যাপ সবখানে ব্যবহার করা যাবে না।

### মালিক টেবিল (সব দুর্যোগে একই কম্পোনেন্ট, `variant` প্রপ দিয়ে)
- হেডার: muted, 12–13px।
- সারি উচ্চতা 52 px, সারির মাঝে 1 px বর্ডার, hover-এ `--surface-alt`।
- **variant = recorded:** Owner | **Dag No.** | **Khatian No.** | Area (Lost/Gained) | Est. compensation (৳) | Status | Paid (৳)।
- **variant = forecast:** Owner | **Dag No.** | **Khatian No.** | Projected area | Projected compensation (৳)। **Status ও Paid কলাম নেই।**
- **variant = flood:** Owner (ক্লিকযোগ্য লিঙ্ক, `--accent-deep`) | **Dag No.** | **Khatian No.** | Flooded area | Depth class।
- Status ব্যাজ (শুধু recorded): Paid (সবুজ সফট), Approved (নীল সফট), Pending (হলুদ সফট), Not applied (ধূসর)।
- মালিকানাহীন জমির সারি: ডট বর্ডার, "Unowned" ট্যাগ।
- টেবিলের উপরে সার্চ, ডানে "Download CSV" ঘোস্ট বোতাম।

### মালিকের জমির পেজ (শুধু বন্যা)
- শীর্ষে মালিকের নাম ও সারসংক্ষেপ (দাগ সংখ্যা, মোট জমি, মোট প্লাবিত)।
- বামে Leaflet ম্যাপ: মালিকের দাগ হাইলাইট, বাকি ম্লান, ক্রমিক নম্বর মার্কার এবং প্রতি দাগের চার কোনায় ১–৪ চিহ্ন।
- ডানে/নিচে **প্রতিটি দাগের জন্য একটি কার্ড:** Dag No. | Khatian No. | Land class | Area | Flood status, এবং নিচে **চার কোনার কোঅর্ডিনেট টেবিল** (Corner 1 NW, 2 NE, 3 SE, 4 SW | Latitude | Longitude, ছয় দশমিক), সবসময় দৃশ্যমান, কোনো expander-এর ভেতরে নয়। একটি centroid দেখানো হবে না। প্রতি দাগে "Copy 4 corners"; পেজে "Copy all coordinates", "Download CSV", "Download GeoJSON"।

### Empty State
- মাঝখানে লাইন-আইকন (৬৪ px, muted), এক লাইনের বার্তা (১৮ px), নিচে ছোট ব্যাখ্যা ও "অন্য এলাকা বাছুন" বোতাম।
- বার্তাগুলো `APP_FLOW.md`-এর তালিকা অনুযায়ী।

### ব্যাজ ও চিপ
- "অনুমান" ব্যাজ: `--predicted-soft` ব্যাকগ্রাউন্ড, `--predicted` টেক্সট, ড্যাশ বর্ডার।
- "ডেমো ডাটা" ব্যানার: পেজের একদম উপরে সরু স্ট্রিপ (`--warn` সফট)।
- Confidence: ছোট বার (০–১০০%) ও সংখ্যা।

## 8. আইকন

- Lucide আইকন, ১.৫ px স্ট্রোক, 20 px।
- প্রস্তাবিত: হোম `LayoutGrid`, নদী ভাঙ্গন `Waves`, বন্যা `CloudRainWind`/`Droplets`, ভূমিধস `Mountain`, চর `Layers`/`Sprout`, উপকূলীয় `Anchor`/`Waves`, সেটিংস `Settings`।

## 9. মোশন

- ট্রানজিশন 150–200 ms, `ease-out`।
- কার্ড লোডে হালকা fade-up (8 px)।
- চার্ট লাইন ড্র অ্যানিমেশন ৬০০ ms (একবার)।
- `prefers-reduced-motion` সম্মান করতে হবে।

## 10. রেসপনসিভ

| ব্রেকপয়েন্ট | আচরণ |
|---|---|
| ≥ 1280 | সম্পূর্ণ লেআউট, ডান "এখন" কলামসহ |
| 768–1279 | ডান কলাম নিচে নামে, সাইডবার আইকন-অনলি |
| < 768 | সাইডবার নিচের ট্যাব বার/হ্যামবার্গার; কার্ড এক কলাম; টেবিল অনুভূমিক স্ক্রল; ম্যাপ তুলনা উপর-নিচ টগল |

## 11. অ্যাক্সেসিবিলিটি

- টেক্সট কনট্রাস্ট ≥ 4.5:1 (বড় টেক্সট ≥ 3:1)।
- ম্যাপ ও চার্টের জন্য টেক্সট বিকল্প (সারসংক্ষেপ লাইন ও ডাটা টেবিল)।
- সব ইন্টারঅ্যাকশন কিবোর্ডে চলবে; ম্যাপ slider তীরচিহ্ন কী দিয়ে নড়বে।
- রং ছাড়াও আইকন/লেবেল/প্যাটার্ন দিয়ে ক্ষতি, বৃদ্ধি, অনুমান আলাদা করা।

## 12. কন্টেন্ট টোন

- সব কপি সহজ ইংরেজিতে। ছোট বাক্য, পরিভাষা থাকলে পাশে ব্যাখ্যা (যেমন "Dag No. (plot number)", "Khatian No. (land record number)")।
- Forecast সবসময় "projected", "estimated", "forecast" শব্দে। কখনো নিশ্চিত ভাষা নয়।
- প্রতিটি Forecast পেজের নিচে: "This is a model-based estimate, not an official government record."
- প্রতিটি পেজে ডেমো ব্যানার: "Demo data: all names, plots and figures are fictional."

---

## 10. Map Comparison and Controls — Update

This section amends map presentation only; preserve all existing design tokens and component patterns.

### Comparison composition
- Use two equal-height map cards side by side on desktop: **Before** left, **After** right.
- Do not show a draggable swipe bar in the default comparison experience.
- Place the supporting information section below the entire map pair: summary metrics, legends, context cards, mouza summaries, and relevant tables.
- On narrow screens, stack Before above After, then show the supporting information. Keep each map title unambiguous.

### Zoom controls
- Provide visible, separate `+` and `−` buttons on each map card, placed in the map chrome without obscuring important geography.
- Buttons use existing button, border, radius, spacing, and focus-state tokens. Use clear accessible labels and visible keyboard focus.
- In paired maps, controls operate on both maps through synchronized zoom.

### Map type switch
- Place a compact `Map type` control within the map chrome with `Light GIS` and `Satellite` options; include `Street` only if a compliant source is configured.
- Retain the Light GIS map as the dependable fallback. Satellite mode must include visible provider attribution.
- On satellite imagery, maintain sufficient contrast for plot borders, loss/gain overlays, owner colours, mouza labels, hatches, and selected features. Do not redefine the semantic meaning of existing colors.
- When synthetic mock geometry is shown over real-world imagery, display a restrained but readable notice: `Demo geometry — not survey-accurate`.
- Loading and error states should be compact and non-blocking; do not obscure the map with a full-screen error.

### Responsive and accessibility rules
- Desktop: two columns. Tablet: two columns when each map remains usable; otherwise stack. Mobile: one column with Before first.
- Controls must be keyboard-operable, touch-friendly, and have accessible names. Do not rely on color alone to communicate status.

## 11. Corrective Map Context and Control Behavior

- Each hazard's map must show the selected hazard's actual region from the app's region/coordinate data. Do not reuse one static satellite picture for all hazards.
- Expected context, when supported by existing data: river corridor for river erosion, hilly terrain for landslides, river island/char landscape for char formation/erosion, and the selected affected area for flood/coastal hazards. These are geographic map tiles, not decorative photos.
- The map must focus on the selected region only. Avoid excessive empty space or a country-wide view when a smaller region is selected.
- Light GIS and Satellite must look like two basemaps of the same place: identical center, zoom, bounds, and aspect ratio. Switching types must not move or resize the geography.
- Keep the current design tokens, typography, panel styling, map controls, and existing visual language. This is a targeted correction, not a site redesign.
- The `+` and `−` buttons must zoom on the first click. Do not show an intermediate “zoom mode active” state. Keep buttons visibly clickable and keyboard/touch accessible.
- If coordinates are synthetic or not verified, keep the `Demo geometry — not survey-accurate` notice rather than pretending the overlay matches the imagery.
