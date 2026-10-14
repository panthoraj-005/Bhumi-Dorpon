# BACKEND SCHEMA — ভূমিদর্পণ (BhumiDorpon)
**PostgreSQL 16 + PostGIS | SRID 4326 (সংরক্ষণ), 32646 (এলাকা হিসাব)**

> এলাকা (শতাংশ/একর) হিসাবের সময় জ্যামিতি `ST_Transform(geom, 32646)` করে মিটারে হিসাব করতে হবে। ১ শতাংশ ≈ ৪০.৪৬ বর্গমিটার।

> **ডেমো নোট:** ডেমো সংস্করণে ডাটাবেস নেই। এই স্কিমা ভবিষ্যৎ প্রোডাকশনের জন্য এবং ডেমোর mock ডাটার আকৃতি (TypeScript টাইপ) ঠিক করতে ব্যবহার হবে। UI-র "Forecast" = এখানকার `predicted`।

---

## 1. এক্সটেনশন ও এনাম

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- নামের fuzzy সার্চ

CREATE TYPE hazard_type AS ENUM
  ('river_erosion','flood','landslide','char','coastal');
CREATE TYPE data_mode AS ENUM ('recorded','predicted');
CREATE TYPE change_kind AS ENUM ('loss','gain');
CREATE TYPE compensation_status AS ENUM
  ('not_applicable','not_applied','pending','approved','paid');
CREATE TYPE land_class AS ENUM
  ('agri','homestead','pond','commercial','forest','khas','other');
CREATE TYPE asset_kind AS ENUM
  ('satellite','survey_map','mouza_map','flood_extent','prediction_map');
```

## 2. প্রশাসনিক ও ভৌগোলিক টেবিল

```sql
CREATE TABLE districts (
  id           SERIAL PRIMARY KEY,
  name_bn      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  is_coastal   BOOLEAN DEFAULT FALSE,
  is_hilly     BOOLEAN DEFAULT FALSE,
  geom         GEOMETRY(MultiPolygon,4326)
);

CREATE TABLE upazilas (
  id           SERIAL PRIMARY KEY,
  district_id  INT REFERENCES districts(id),
  name_bn      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  geom         GEOMETRY(MultiPolygon,4326)
);

CREATE TABLE mouzas (
  id           SERIAL PRIMARY KEY,
  upazila_id   INT REFERENCES upazilas(id),
  name_bn      TEXT NOT NULL,
  name_en      TEXT,
  jl_no        TEXT,
  is_virtual   BOOLEAN DEFAULT FALSE,  -- মৌজাবিহীন নতুন জমির জন্য (উপকূল/চর)
  geom         GEOMETRY(MultiPolygon,4326)
);

CREATE TABLE rivers (
  id           SERIAL PRIMARY KEY,
  name_bn      TEXT NOT NULL,
  name_en      TEXT,
  geom         GEOMETRY(MultiLineString,4326)
);

CREATE TABLE river_upazilas (        -- কোন নদী কোন উপজেলার ভেতর দিয়ে
  river_id     INT REFERENCES rivers(id),
  upazila_id   INT REFERENCES upazilas(id),
  PRIMARY KEY (river_id, upazila_id)
);

CREATE TABLE river_mouzas (          -- নদীতীরের মৌজা
  river_id     INT REFERENCES rivers(id),
  mouza_id     INT REFERENCES mouzas(id),
  bank_side    TEXT CHECK (bank_side IN ('left','right','both')),
  PRIMARY KEY (river_id, mouza_id)
);

CREATE TABLE hills (
  id           SERIAL PRIMARY KEY,
  upazila_id   INT REFERENCES upazilas(id),
  name_bn      TEXT NOT NULL,
  name_en      TEXT,
  geom         GEOMETRY(MultiPolygon,4326)
);

CREATE TABLE chars (
  id           SERIAL PRIMARY KEY,
  river_id     INT REFERENCES rivers(id),
  upazila_id   INT REFERENCES upazilas(id),
  name_bn      TEXT NOT NULL,
  name_en      TEXT,
  first_seen   DATE,
  geom         GEOMETRY(MultiPolygon,4326)   -- সর্বশেষ আকৃতি
);

CREATE INDEX ON mouzas  USING GIST (geom);
CREATE INDEX ON rivers  USING GIST (geom);
CREATE INDEX ON hills   USING GIST (geom);
CREATE INDEX ON chars   USING GIST (geom);
```

## 3. ভূমি ও মালিকানা

```sql
CREATE TABLE plots (                 -- দাগ
  id           BIGSERIAL PRIMARY KEY,
  mouza_id     INT REFERENCES mouzas(id),
  plot_no      TEXT NOT NULL,        -- দাগ নম্বর
  khatian_no   TEXT,
  land_class   land_class DEFAULT 'agri',
  area_decimal NUMERIC(12,2),        -- রেকর্ডকৃত আয়তন (শতাংশ)
  geom         GEOMETRY(Polygon,4326),
  UNIQUE (mouza_id, plot_no)
);
CREATE INDEX ON plots USING GIST (geom);

CREATE TABLE owners (
  id           BIGSERIAL PRIMARY KEY,
  name_bn      TEXT NOT NULL,
  father_name  TEXT,
  is_synthetic BOOLEAN DEFAULT TRUE   -- ডেমোতে সবসময় TRUE
);
CREATE INDEX owners_name_trgm ON owners USING GIN (name_bn gin_trgm_ops);

CREATE TABLE ownerships (            -- দাগ ↔ মালিক (ভাগ সহ)
  id           BIGSERIAL PRIMARY KEY,
  plot_id      BIGINT REFERENCES plots(id),
  owner_id     BIGINT REFERENCES owners(id),
  share_decimal NUMERIC(12,2),       -- মালিকের অংশ (শতাংশ)
  valid_from   DATE,
  valid_to     DATE
);
CREATE INDEX ON ownerships (plot_id);
CREATE INDEX ON ownerships (owner_id);
```

## 4. ঘটনা ও পরিবর্তন

```sql
CREATE TABLE hazard_events (
  id            BIGSERIAL PRIMARY KEY,
  hazard        hazard_type NOT NULL,
  mode          data_mode NOT NULL,           -- recorded | predicted
  upazila_id    INT REFERENCES upazilas(id),
  mouza_id      INT REFERENCES mouzas(id),
  river_id      INT REFERENCES rivers(id),
  hill_id       INT REFERENCES hills(id),
  char_id       INT REFERENCES chars(id),
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  event_date    DATE,                         -- বন্যা/ভূমিধসের তারিখ
  total_loss_decimal   NUMERIC(14,2) DEFAULT 0,
  total_gain_decimal   NUMERIC(14,2) DEFAULT 0,
  unowned_decimal      NUMERIC(14,2) DEFAULT 0, -- মালিকানাহীন জমি
  trend         TEXT CHECK (trend IN ('increasing','decreasing','stable')),
  soil_volume_m3 NUMERIC(14,2),               -- ভূমিধসে মাটির আনুমানিক পরিমাণ
  flood_depth_m  NUMERIC(6,2),
  flood_duration_days INT,
  confidence    NUMERIC(4,3),                 -- শুধু predicted-এ
  model_version TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON hazard_events (hazard, mode, mouza_id, period_end DESC);

CREATE TABLE event_geometries (      -- ক্ষতি/বৃদ্ধির পলিগন
  id          BIGSERIAL PRIMARY KEY,
  event_id    BIGINT REFERENCES hazard_events(id) ON DELETE CASCADE,
  kind        change_kind NOT NULL,
  geom        GEOMETRY(MultiPolygon,4326) NOT NULL,
  area_decimal NUMERIC(14,2)
);
CREATE INDEX ON event_geometries USING GIST (geom);

CREATE TABLE plot_impacts (          -- দাগ-পর্যায়ের ফলাফল (ST_Intersection-এর পর)
  id            BIGSERIAL PRIMARY KEY,
  event_id      BIGINT REFERENCES hazard_events(id) ON DELETE CASCADE,
  plot_id       BIGINT REFERENCES plots(id),
  kind          change_kind NOT NULL,
  affected_decimal NUMERIC(12,2) NOT NULL
);
CREATE INDEX ON plot_impacts (event_id);

CREATE TABLE owner_impacts (         -- মালিকভিত্তিক ফলাফল (ডিনরমালাইজড, দ্রুত পড়ার জন্য)
  id            BIGSERIAL PRIMARY KEY,
  event_id      BIGINT REFERENCES hazard_events(id) ON DELETE CASCADE,
  owner_id      BIGINT REFERENCES owners(id),
  plot_id       BIGINT REFERENCES plots(id),
  kind          change_kind NOT NULL,
  affected_decimal NUMERIC(12,2) NOT NULL,
  est_compensation_bdt NUMERIC(14,2) DEFAULT 0,
  comp_status   compensation_status DEFAULT 'not_applied',
  paid_bdt      NUMERIC(14,2) DEFAULT 0,
  paid_on       DATE
);
CREATE INDEX ON owner_impacts (event_id);
CREATE INDEX ON owner_impacts (owner_id);
```

## 5. ক্ষতিপূরণ হার

```sql
CREATE TABLE compensation_rates (
  id           SERIAL PRIMARY KEY,
  upazila_id   INT REFERENCES upazilas(id),    -- NULL = জাতীয় ডিফল্ট
  land_class   land_class NOT NULL,
  rate_bdt_per_decimal NUMERIC(12,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to   DATE
);
```

## 6. ইমেজ ও ম্যাপ অ্যাসেট

```sql
CREATE TABLE imagery_assets (
  id           TEXT PRIMARY KEY,               -- যেমন 'img_a1'
  kind         asset_kind NOT NULL,
  source       TEXT,                           -- 'Sentinel-2', 'Survey 2025' ...
  captured_on  DATE,
  bbox         GEOMETRY(Polygon,4326),
  storage_url  TEXT NOT NULL,                  -- COG/টাইল/PNG
  is_synthetic BOOLEAN DEFAULT TRUE
);

CREATE TABLE event_assets (
  event_id     BIGINT REFERENCES hazard_events(id) ON DELETE CASCADE,
  asset_id     TEXT REFERENCES imagery_assets(id),
  role         TEXT CHECK (role IN ('before','after','overlay')),
  PRIMARY KEY (event_id, asset_id, role)
);
```

## 7. ডাটা পাইপলাইন মেটা

```sql
CREATE TABLE model_runs (
  id           BIGSERIAL PRIMARY KEY,
  hazard       hazard_type NOT NULL,
  model_name   TEXT NOT NULL,
  model_version TEXT NOT NULL,
  trained_on   DATERANGE,
  metrics      JSONB,                          -- {"iou":0.81,"f1":0.88}
  run_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE data_refresh_log (
  id           SERIAL PRIMARY KEY,
  hazard       hazard_type NOT NULL,
  refreshed_at TIMESTAMPTZ DEFAULT now(),
  next_due     DATE
);
```

## 8. দরকারি ভিউ ও কোয়েরি

```sql
-- মৌজাভিত্তিক সারসংক্ষেপ
CREATE VIEW v_mouza_event_summary AS
SELECT e.id AS event_id, e.hazard, e.mode, e.mouza_id, m.name_bn AS mouza,
       e.period_start, e.period_end,
       e.total_loss_decimal, e.total_gain_decimal, e.unowned_decimal,
       e.confidence
FROM hazard_events e JOIN mouzas m ON m.id = e.mouza_id;

-- দাগের সাথে ঘটনার ইন্টারসেকশন, শতাংশে
SELECT p.id AS plot_id,
       ROUND((ST_Area(ST_Transform(ST_Intersection(p.geom, g.geom),32646))/40.4686)::numeric,2) AS affected_decimal
FROM plots p
JOIN event_geometries g ON ST_Intersects(p.geom, g.geom)
WHERE g.event_id = :event_id AND g.kind = 'loss';

-- আনুমানিক ক্ষতিপূরণ
SELECT oi.owner_id, SUM(oi.affected_decimal * cr.rate_bdt_per_decimal) AS est_bdt
FROM owner_impacts oi
JOIN plots p ON p.id = oi.plot_id
JOIN compensation_rates cr ON cr.land_class = p.land_class AND cr.upazila_id IS NULL
WHERE oi.event_id = :event_id AND oi.kind = 'loss'
GROUP BY oi.owner_id;

-- মালিকের নামে সার্চ (বন্যা)
SELECT o.id, o.name_bn, similarity(o.name_bn, :q) AS score
FROM owners o WHERE o.name_bn % :q ORDER BY score DESC LIMIT 10;
```

## 9. ER সারসংক্ষেপ

```
districts 1─* upazilas 1─* mouzas 1─* plots *─* owners (ownerships)
upazilas *─* rivers (river_upazilas)        rivers *─* mouzas (river_mouzas)
upazilas 1─* hills                          rivers 1─* chars
hazard_events ─* event_geometries
hazard_events ─* plot_impacts ─ plots
hazard_events ─* owner_impacts ─ owners, plots
hazard_events *─* imagery_assets (event_assets)
```

## 10. Seed ডাটা পরিকল্পনা (ডেমো)

- ৪টি পাইলট জেলা-গুচ্ছ, প্রতিটিতে ২–৩ উপজেলা, ৩–৫ মৌজা।
- প্রতি মৌজায় ২০–৫০টি দাগ, ১৫–৪০ কাল্পনিক মালিক (`is_synthetic = TRUE`)।
- প্রতিটি মডিউলে অন্তত ১টি ঘটনা `recorded` ও ১টি `predicted`।
- কিছু এলাকায় ইচ্ছা করে কোনো ঘটনা রাখা হবে না, যাতে empty state পরীক্ষা করা যায়।
- ইমেজ: সরল করা PNG/COG (আগে/পরে জোড়া), `is_synthetic = TRUE` চিহ্নিত।

## 11. ডেটা গোপনীয়তা

- ডেমোতে কোনো বাস্তব ব্যক্তির নাম নয়।
- প্রোডাকশনে `owners` টেবিল এনক্রিপ্টেড কলাম/রো-লেভেল সিকিউরিটি, অডিট লগ ও আইনি অনুমোদন ছাড়া ব্যবহার করা যাবে না।

## 12. সংযোজন (সংস্করণ 1.1)

- `owner_impacts` সারিতে `plots.plot_no` (Dag No.) ও `plots.khatian_no` সবসময় জয়েন করে দেখাতে হবে।
- `mode = 'predicted'` সারিতে শুধু `est_compensation_bdt` অর্থবহ। `comp_status` ও `paid_bdt` UI-তে দেখানো হবে না (ডাটাবেসে ডিফল্ট থাকতে পারে)।
- বন্যার মালিক-পেজের জন্য প্রতি দাগের ফল:

```sql
CREATE TABLE flood_plot_status (
  event_id    BIGINT REFERENCES hazard_events(id) ON DELETE CASCADE,
  plot_id     BIGINT REFERENCES plots(id),
  flooded_decimal NUMERIC(12,2) NOT NULL,
  max_depth_m NUMERIC(6,2),
  depth_class TEXT CHECK (depth_class IN ('shallow','moderate','deep')),
  PRIMARY KEY (event_id, plot_id)
);

-- একজন মালিকের সব দাগ, কোঅর্ডিনেটসহ
SELECT p.plot_no, p.khatian_no, p.land_class, own.share_decimal,
       -- ঠিক চার কোনা (ring-এর ৫ম পয়েন্ট প্রথমটির পুনরাবৃত্তি)
       ST_Y(ST_PointN(ST_ExteriorRing(p.geom),1)) AS c1_lat, ST_X(ST_PointN(ST_ExteriorRing(p.geom),1)) AS c1_lon,
       ST_Y(ST_PointN(ST_ExteriorRing(p.geom),2)) AS c2_lat, ST_X(ST_PointN(ST_ExteriorRing(p.geom),2)) AS c2_lon,
       ST_Y(ST_PointN(ST_ExteriorRing(p.geom),3)) AS c3_lat, ST_X(ST_PointN(ST_ExteriorRing(p.geom),3)) AS c3_lon,
       ST_Y(ST_PointN(ST_ExteriorRing(p.geom),4)) AS c4_lat, ST_X(ST_PointN(ST_ExteriorRing(p.geom),4)) AS c4_lon,
       ST_AsGeoJSON(p.geom) AS boundary
FROM ownerships own JOIN plots p ON p.id = own.plot_id
WHERE own.owner_id = :owner_id AND p.mouza_id = :mouza_id;
```
- প্রতি হ্যাজার্ডের নিজস্ব ম্যাপ-জ্যামিতি `event_geometries`-এ `layer` কলাম দিয়ে আলাদা করা যাবে (যেমন `bank_before`, `bank_after`, `flood_extent_deep`, `scar`, `debris`, `shoreline_before`)।
- `plots.geom` সবসময় ঠিক চার কোনার বহুভুজ: `ALTER TABLE plots ADD CONSTRAINT plots_four_corners CHECK (ST_NPoints(geom) = 5);` (ring বন্ধ করতে ৫ম পয়েন্ট)। দাগ কখনো clip করা হয় না। কোনার ক্রম: 1 NW, 2 NE, 3 SE, 4 SW।
- ডেমোর mock ডাটায় `Plot.corners` ঠিক ৪টি `{label, lat, lon}`; GeoJSON-এ [lon, lat] ক্রম, UI-তে lat আগে।
- **নোট ১০ (Frontend GIS Integration & Coordinate Order)**:
  - GeoJSON স্পেসিফিকেশন (RFC 7946) অনুযায়ী `Plot.boundary` ও `polygon` ডেটাসেটে `[longitude, latitude]` ক্রমে সংরক্ষিত।
  - Leaflet ম্যাপিং ইঞ্জিনে রেন্ডার করার সময় ক্লায়েন্ট-সাইড রূপান্তরকারী `toLeafletLatLng` ব্যবহার করে `[latitude, longitude]` হিসেবে পাস করা হয়, যা স্থানাঙ্ক ইনভার্সনজনিত ত্রুটি প্রতিহত করে।
  - ম্যাপ এলাকার `bounds` বিন্যাস: `[minLon, minLat, maxLon, maxLat]` (EPSG:4326/WGS84)। কোনো নতুন ব্যাকএন্ড টেবিল তৈরি না করেই এক্সিস্টিং এরিয়া ও জ্যামিতি স্কিমা দ্বারা এই সমন্বয় নিশ্চিত করা হয়েছে।

