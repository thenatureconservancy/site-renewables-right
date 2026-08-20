# Clean Energy Compass (Site Renewables Right) — Decisions & Reusable Recipes

> A distilled reference of the architecture decisions, GIS gotchas, code patterns, and
> design choices worked out while building the Compass web-mapping app. Written so
> future-you can navigate by topic instead of re-deriving everything.

**Stack:** Vue 3 + Pinia · ArcGIS Maps SDK for JavaScript (4.3x, operators API) · Quasar · pdfMake · Shepherd.js
**Data:** ArcGIS image service (mosaic dataset, EPSG:5070) + AGOL vector/VTL feature layers
**Analysis SR:** NAD83 / Conus Albers — **EPSG:5070** (all area math happens here)

---

## 1. GIS / Raster Data-Prep Gotchas (the hard-won ones)

### 1.1 NoData must be an explicit value, not null
- On an 8-bit thematic raster, a **"null" NoData is ambiguous** and often isn't carried
  through the mosaic → `computeStatisticsHistograms` returns a degenerate **256-bin,
  0–255 all-zeros** fallback histogram.
- **Fix:** define NoData as an explicit value (e.g. `0`), then **rebuild statistics**.
- Order matters: **set NoData FIRST → then Calculate Statistics.**

### 1.2 1-bit rasters can't hold NoData → phantom coverage
- A 1-bit raster only has values 0 and 1 — **no room left for a NoData flag.**
- Symptom: an empty buffer reports ~73–100% coverage because background can't be excluded.
- **Fix:** convert to **8-bit unsigned** so 0 can become a real NoData value.

### 1.3 32-bit float rasters → 0–255 fallback histogram
- Float = continuous data, so the service can't produce a clean value-per-bin histogram.
- **Fix:** reclass to an integer in/out mask (see recipe 2.2). Float storage is the enemy
  of clean histograms; collapsing to a single integer value is the cure.

### 1.4 NoData promotion (8-bit → 16-bit) — the sneaky one
- Setting NoData=0 on a raster that **already uses its full bit range** silently **promotes
  it to the next bit depth** (8-bit → 16-bit, max 65535).
- Symptom: histogram comes back `min:3, max:65535, size:256` even after "running stats."
- **Fix:** bake NoData in *during* a Copy Raster to a fixed pixel type so it can't re-promote
  (recipe 2.3), then rebuild stats. Watch for `max: 65535` as the 16-bit tell.

### 1.5 Statistics on the MOSAIC ≠ statistics on the ITEMS
- `computeStatisticsHistograms` targeting `Name='...'` reads the **item's** stats.
- Running Calculate Statistics on the standalone raster **before** adding to the mosaic does
  NOT propagate. Symptom: `{ "statistics": [] }` from the service.
- **Fix:** `BuildPyramidsandStatistics` on the **mosaic** with `skip_existing="OVERWRITE"`.

### 1.6 Categorical data → ALWAYS resample NEAREST
- For 0/1 (or any thematic) rasters, bilinear/cubic/average resampling **invents in-between
  values** and smears classes → phantom coverage, wrong histograms.
- Applies to Project Raster, pyramids, everything. **NEAREST or no pyramids.**

### 1.7 Overviews/pyramids can smear categorical data in sparse regions
- Symptom (protected areas): a buffer with visibly *no* data returns `[0, 9032]` (100% in).
- Coarse overviews built with average/bilinear smear value-1 across background in sparse areas.
- **Fix:** rebuild pyramids with **NEAREST**, or drop overviews, + recalc stats.

### 1.8 "unknown" spatial reference breaks geometry queries
- A raster tagged `CRS["unknown"]` (same params as 5070 but not the recognized EPSG code)
  won't align with a 5070 buffer → **query returns nothing** (whole-raster stats still exist).
- The `_5070` in a filename is aspirational — verify the actual SR via the item stats endpoint.
- **Fix:** Project Raster to the real `SpatialReference(5070)` at 30 m NEAREST.

### 1.9 Wrong resolution silently breaks area math
- A raster at 250 m pixels vs. your 30 m pipeline: area math is off by ~(250/30)² ≈ 69×.
- Always confirm `pixelSizeX == 30` on every raster feeding the report.

---

## 2. Python / ArcPy Recipes

> Run in ArcGIS Pro: **Analysis tab → Python → Python Window**, or a Notebook, or
> `propy script.py` from the Python Command Prompt. Back up first; watch for schema locks.

### 2.1 Batch Project Raster → EPSG:5070 @ 30 m (categorical, NEAREST)
```python
import arcpy, os
in_gdb  = r"C:\path\source.gdb"
out_gdb = r"C:\path\projected.gdb"
out_sr  = arcpy.SpatialReference(5070)   # NAD83 / Conus Albers
arcpy.env.workspace = in_gdb
arcpy.env.overwriteOutput = True

for ras in arcpy.ListRasters():
    out = os.path.join(out_gdb, f"{ras}_5070")
    try:
        arcpy.management.ProjectRaster(
            os.path.join(in_gdb, ras), out, out_sr,
            "NEAREST", "30 30")   # NEAREST = mandatory for categorical
        arcpy.management.CalculateStatistics(out, skip_existing="OVERWRITE")
        print(f"OK  {ras} -> {ras}_5070")
    except Exception as ex:
        print(f"FAIL {ras}: {ex}")
```

### 2.2 Float raster → binary in/out mask (>0 = in)  ⭐ the workhorse
```python
from arcpy.sa import Con
arcpy.CheckOutExtension("Spatial")
mask = Con(arcpy.Raster(src) > 0, 1)     # >0 -> 1, else NoData
mask.save(out)
arcpy.management.CalculateStatistics(out, skip_existing="OVERWRITE")
# Pattern: "float + only need in/out -> Con(raster > 0, 1) -> integer mask -> clean 2-bin histogram"
```

### 2.3 Convert to 8-bit WITHOUT re-promotion (bake NoData in during copy)
```python
arcpy.management.CopyRaster(
    in_raster=src, out_rasterdataset=out,
    pixel_type="8_BIT_UNSIGNED",
    nodata_value="0")                    # NoData set DURING copy, not after
arcpy.management.CalculateStatistics(out, skip_existing="OVERWRITE")
```

### 2.4 Extract one band from a multi-band raster + mask it
```python
from arcpy.ia import ExtractBand
from arcpy.sa import Con
arcpy.CheckOutExtension("ImageAnalyst"); arcpy.CheckOutExtension("Spatial")

# lasso_wind_solar_5070 (8 bands):  Solar = band 2, Wind = band 6   (1-based!)
for band, out in [(2, "lasso_solar_5070"), (6, "lasso_wind_5070")]:
    band_ras = ExtractBand(src, band_ids=[band])
    Con(band_ras > 0, 1).save(os.path.join(out_gdb, out))
    arcpy.management.CalculateStatistics(os.path.join(out_gdb, out), skip_existing="OVERWRITE")
```
- `ExtractBand` is **1-based**. Verify band identity via `arcpy.Raster(src).bandNames`.
- Lesson learned: the mix-up ("both bands showed wind") came from a **manual projection
  step feeding the same file twice** — not the script. When a step is mechanical & uniform,
  prefer the loop over hand-editing.

### 2.5 Rebuild stats on the MOSAIC after adding rasters
```python
arcpy.management.BuildPyramidsandStatistics(
    in_workspace=mosaic,
    include_subdirectories="INCLUDE_SUBDIRECTORIES",
    build_pyramids="NONE",               # thematic data: skip pyramids (or NEAREST)
    calculate_statistics="CALCULATE",
    skip_existing="OVERWRITE")           # OVERWRITE is essential — else stale items skip
```

### Standard reprocessing pipeline (order that avoids rework)
1. Project Raster → 5070, 30 m, NEAREST
2. (if masking) `Con(raster > 0, 1)`  /  (if 8-bit) Copy Raster with `nodata_value`
3. Calculate Statistics (OVERWRITE)
4. Create/replace items in the 5070 mosaic → Add Rasters
5. BuildPyramidsandStatistics on the mosaic (OVERWRITE)
6. **Republish the image service** (see §6)

---

## 3. Image Service — Query & Diagnostics

### 3.1 List every raster name in the mosaic (confirm a republish took)
```
.../ImageServer/query?where=1=1&outFields=Name&returnGeometry=false&orderByFields=Name&f=json
```
- Filter: `where=Name LIKE '%lasso%'`  ·  Human-readable: `&f=html`
- If new names aren't listed → **the service didn't update** (publish-side problem, not data).

### 3.2 Inspect one item's statistics / pixel type / resolution / SR
```
.../ImageServer/<objectid>/info/statistics?f=json
```
This one call reveals almost every data bug at a glance:
| Field | Bad value → meaning |
|---|---|
| `pixelType` | `F32` → needs Con reclass; `U16` → NoData promotion |
| `pixelSizeX` | `250` → wrong resolution (should be 30) |
| spatialReference | `"unknown"` → won't align with 5070 buffer, returns empty |
| `statistics` | `[]` → stats not built on the mosaic item |
| `histograms[0].max` | `65535` → 16-bit fallback |

### 3.3 Max buffer size is NOT arbitrary — it's the service size limit
- Histogram fails ("exceeds size limit", returns 0 px) if the sampled grid exceeds the
  service's **Maximum image size per request** (rows × cols). Default often **4100 × 15000**.
- Formula: `maxRadiusMeters = (min(maxRows, maxCols) × pixelSize) / 2`
- At defaults (4100 rows × 30 m): **~38 mi radius ceiling** → our **35 mi cap is just under it.**
- Dynamic version: read `imageLayer.maxImageHeight/maxImageWidth` after load, compute the cap.
- To allow bigger buffers: raise service limits (heavier server load) **or** scale `pixelSize`
  up for large buffers (30→60 m doubles the max radius, halves resolution).

---

## 4. The Histogram Pipeline (JS / Pinia)

### 4.1 Area constants (module scope — NOT Pinia state, or `this` bites you)
```js
const PIXEL_SIZE   = 30
const PIXEL_M2     = PIXEL_SIZE * PIXEL_SIZE      // 900 m²
const HA_PER_PIXEL = PIXEL_M2 / 10000            // 0.09  ha
const AC_PER_PIXEL = PIXEL_M2 / 4046.8564224     // 0.2224 ac
const ALBERS = new SpatialReference({ wkid: 5070 })
```
- **Sanity rule:** `HA_PER_PIXEL` (0.09) and `AC_PER_PIXEL` (0.2224) must NEVER be equal,
  and neither should ever be `900`. `900` = the m² tell that a `/` was dropped.

### 4.2 Histogram params — pixelSize carries the 5070 SR
```js
const params = new ImageHistogramParameters({
  geometry: buffer,                                          // already in 5070
  mosaicRule: new MosaicRule({ method:'attribute',
                               where:`Name = '${name}'`, operation:'first' }),
  pixelSize: { x: PIXEL_SIZE, y: PIXEL_SIZE, spatialReference: ALBERS },
  renderingRule: null,
})
const res  = await imageLayer.computeStatisticsHistograms(params)
const hist = res.histograms?.[0]                             // band 0 (single-band rasters)
```

### 4.3 Bin lookup — robust to min = 0 / 0.5 / -0.5
```js
countForValue(hist, value) {
  if (!hist || !hist.counts?.length) return 0
  const binWidth = (hist.max - hist.min) / hist.size
  const idx = Math.floor((value - hist.min) / binWidth)
  return hist.counts[idx] ?? 0
}
```
- Bins are **value ranges centered on integers**; `min`/`max` are bin **edges** (hence −0.5).
- **Don't** index by raw value (`counts[2]`); always convert: `counts[value - min-ish]` via binWidth.

### 4.4 Per-value counting + guard against same-bin double-count
```js
// config: each raster declares its "in" value(s)
// { name:'...', elid:'...', values:[1] }            // single
// { name:'...', elid:'...', values:[1,2,3] }        // multi-value
const valueList = Array.isArray(values) ? values : values != null ? [values] : [1]

const seenBins = new Set()
const byValue  = {}
let pixelCount = 0
const binWidth = (hist.max - hist.min) / hist.size
for (const v of valueList) {
  const idx = Math.floor((v - hist.min) / binWidth)
  const pc  = this.countForValue(hist, v)
  byValue[v] = { pixelCount: pc,
                 areaHa: +(pc*HA_PER_PIXEL).toFixed(2),
                 areaAc: +(pc*AC_PER_PIXEL).toFixed(2) }
  if (!seenBins.has(idx)) { pixelCount += pc; seenBins.add(idx) }  // no triple-count on coarse hist
}
```
- **Why the Set:** on a coarse/fallback histogram, values 1/2/3 can collapse into the SAME
  bin index → summing each would triple the count (symptom: **299% of buffer**).
- **Don't** use "sum all non-zero bins" — it grabs the whole buffer on fallback histograms (99.99% bug).

### 4.5 % of buffer
```js
this.reportBufferAreaHa = +(Math.PI * (bufferMiles*1609.344)**2 / 10000).toFixed(2)
getPercentage = (areaHa) => reportBufferAreaHa ? ((areaHa/reportBufferAreaHa)*100).toFixed(1) : 0
```

---

## 5. Async State — the Race Condition Pattern ⭐

**Symptom:** intermittent — points show on first click, then show 0 after a buffer-size change.

**Cause:** `getHistogram` and `getIntersections` both run async and both write `reportResults`.
- `getHistogram` did a **full overwrite** (`this.reportResults = histResults`) and passed only
  raster elids to `applyResultsToLayers` → whichever finished **last won**; when histogram
  landed last it **wiped the vector/point results** and the `if(!r)` reset zeroed their display.

**Fix — merge-both + clear-once:**
```js
// createBuffer(): fresh slate before firing the two async funcs
this.reportResults = {}

// getHistogram(): MERGE, don't overwrite; apply the FULL set
this.reportResults = { ...this.reportResults, ...histResults }
this.applyResultsToLayers(this.reportResults)

// getIntersections(): same merge + full-set apply
this.reportResults = { ...this.reportResults, ...intersectionResults }
this.applyResultsToLayers(this.reportResults)
```
**Rule of thumb:** when two async functions write shared state, one must never *fully
overwrite* what the other *merges* into. Merge-both + clear-once removes order-dependence.

---

## 6. Publishing Gotchas
- "Republish didn't take" is a real failure mode — **confirm via the `/query` name list** (§3.1).
- Usual suspects: publish landed as a draft/copy; service points at an **old mosaic**; the
  server reads its **own copy** of the data (registered data store) so edits to your local
  gdb don't reach it; or it needs a **stop/start** to re-read.
- Enterprise AGS often serves from a server-local/registered copy — editing the source gdb
  on your machine may not reach the service until synced.

---

## 7. Vector / Point Intersections (getIntersections)
- **Config drives behavior** via `summaryType`:
  - `'boolean'` → present / not present (uses `queryFeatureCount` > 0)
  - `'count'`   → "N found" (uses `queryFeatureCount`)
  - `'attributes'` → one query, fan out to per-field sub-elids (CJEST community layers)
- **CJEST pattern:** 8 boolean fields tested `value === 1` in a single `queryFeatures`, PLUS
  one extra `where`-based count query for the percentile field (`P200_I_PFS <= 0.2`) so the
  server filters out null/sentinel values. Keyed by `elid`, fan-out returns `[elid, result]` pairs,
  flattened with `.flat()` after `Promise.all`.
- **Gotcha:** property name is `summaryType` (capital T). A lowercase `summarytype` → the task
  returns `undefined` → `Object.fromEntries` throws *"Iterator value undefined is not an entry object."*
- Buffer is 5070; AGOL layers are Web Mercator/4326 — the server reprojects the query geometry
  automatically (it carries `.spatialReference`).

---

## 8. Buffer + Projection (createBuffer)
- Draw/analyze in **5070**, display in Web Mercator (the 2D MapView reprojects on the fly).
- **Operators API** (geometryEngine/projection modules were removed in v5.0):
  - `bufferOperator` — `import bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'`
    (has a **default** export; no `load()` needed).
  - `projectOperator` — **named/namespace only**: `import * as projectOperator from
    '@arcgis/core/geometry/operators/projectOperator.js'` — and **must `await projectOperator.load()`**
    before `execute()`. (Default-import error: *"does not provide an export named 'default'"*.)
- Project the clicked point → 5070, buffer there, hand the 5070 buffer to the histogram.
- **Zoom to buffer with breathing room:** `view.goTo({ target: buffer.extent.clone().expand(1.3) },
  { duration: 800 }).catch(e => { if (e.name!=='AbortError') console.error(e) })`
- **Double-click zoom conflict:** the map's native double-click-to-zoom interrupts `goTo`
  ("goTo is interrupted"). Kill it with `view.on('double-click', ev => ev.stopPropagation())`.

---

## 9. The Unified Legend System

One normalized model → three consumers (layers list, report panel, PDF). Lives in `utils/legends.js`.

### Normalized shapes
`swatch` (single color) · `discrete` (multiple labeled) · `ramp` (gradient bar) ·
`symbol` (triangle/diamond) · `hatch` (diagonal) · `image` (legacy base64 fallback)

### `resolveLegend(layer)` priority order
1. `CUSTOM_LEGENDS[elid]` (explicit override — discrete/ramp/symbol)
2. inline `layer.legendType === 'ramp'`
3. `HATCH_LAYERS[elid]`
4. `LAYER_COLORS[elid]` (migrated square color)
5. legacy `layer.legendImg` / `pngLegend`
- Lets you migrate incrementally; anything unmigrated falls back to its old base64.

### `LegendSwatch.vue`
- Props: `layer`, `legend`, `size`, `showLabels`, **`compact`**.
- **Compact mode** (report panel): discrete → diagonal **cascade** of small chips
  (`CHIP=11, OFFSET=4`, white borders separate overlaps); ramp → tiny **gradient chip**.
- Layers list: compact types (swatch/image/hatch/symbol) render **on the right** (`:size=20`,
  no labels) to keep the long list short; ramp/discrete stack under the checkbox.

### Migrated colors (decoded from old base64 legendImg)
```
protectedAreas #13684a  floodPlainsWetlands #96c7fc  threatenedEndangeredSpecies #d398fb
prairieGrouse #878170   whoopingCrane(S+W) #ff7b39   bigGameSolar #feccee
landscapeIntactness #b2b2b2  birdsWind #a17f6d  migratoryBirdStopoverWind #f6b69a
qualitywater #69b7e4  ag2 #d6bf9e  ag3 #fdfc2f  ag4 #fdb52f  abandonedag #e4947c
nativeLands #d6d6d6   cjest_* (all 8) #773f87   waterLimited = HATCH #c7c7c7
```
- PDF mirror (`buildLegend`/`swatchCanvas`) uses pdfMake **canvas rects** — filters to
  `visible === true` layers so the legend matches the map screenshot. Ramp → sampled color
  chips (canvas can't do gradients); discrete → diagonal cascade of rects.

---

## 10. The Site Report + PDF

### Panel
- Driven off `mapStore.reportResults` (keyed by elid) + `applyResultsToLayers` writes
  `totalArea` / `intersected` / `count` / `summaryType` onto each sublayer.
- `layerHit(layer)` = `intersected === true || totalArea > 0` (works for raster & vector).
- Category pill: **`intersected / count Items`** (blue "present" vs. gray "none") — neutral,
  no value judgment (team preference: report presence, not good/bad).
- Subheader dividers: show only when the subheader **changes** AND differs from the category;
  compare with `norm()` (trim + lowercase) so stray spaces don't cause false dividers.

### PDF (`generateSiteReport.js`, pdfMake)
- Blue navy branding `#1a3a5c` · map screenshot · Energy Type subtitle · summary band
  (lat/lon, buffer, layers intersected, total area) · category roll-up · per-category detail.
- **Blank page bug:** an empty `{ text:'', pageBreak:'after' }` node creates a stray blank
  page — put `pageBreak:'before'` on the next real header instead.
- **% of buffer:** computed in the PDF from `areaHa / reportBufferAreaHa` (results don't store %).
- **Version-proof font init:** `pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs || pdfMake.vfs`
- `npm install pdfmake` (one package covers `build/pdfmake` + `build/vfs_fonts`).

### State policy callouts (CA / GA / ME)
- `getStatePolicy(point)` queries the `states` layer (`queryFeatures`, field **`STATE_NAME`**),
  checks state × category eligibility (CA: wind/solar · GA: solar · ME: wind/solar/floating solar),
  sets `mapStore.statePolicy = { state, html }`.
- Fired from `createBuffer` with the clicked point. Cleared on reset.
- In Conservation Values: **auto-expand** on policy, show the policy note, and **suppress the
  layer list** for those states (`isPolicyOnly` gate). Styled green callout (`.state-policy`).

---

## 11. UI / Design System

### Palette (the "solar-blue anchors structure, green signals nature" system)
```
--structure  #34406b   deep solar blue   → section headers, report header, PDF banners
--accent     #64b45b   TNC green         → left-border stripes, logo, active toggles, hit dots
--action     #0079c1   blue              → buttons (Download, Site Report, PDF)
--neutral    #9aa7b2   windmill steel    → borders, muted labels
title strong #1a3a2e   deep near-black green   title accent #64b45b ("Compass")
```
- Section headers: `background:#34406b; color:#fff; border-left:4px solid #64b45b`.
- Report panel header gradient: `#34406b → #2a3557`, white text, green bottom border.
- Title = two-tone ("Clean Energy" dark + "Compass" green) **with a space between**.
- Tagline: *"Navigating 3Cs considerations for clean energy planning"* (11–12px, muted).

### UI patterns & preferences
- Header soft shadow: `box-shadow: 0 3px 10px rgba(0,0,0,0.05)` (softer than Quasar `shadow-1`).
- Hit dot (intersect indicator): `rgba(25,118,210,0.5)` fill + faint halo. Needed `!important`
  to beat a competing rule — a small specificity bump alone didn't win.
- Category count pill kept **blue/neutral** (no red/green) — team avoids implying good/bad.
- Per-pill **cold-start loader**: horizontal shimmer gated on `reportLoading` (invisible when
  fast, reassuring on a cold service). Global flag, no per-category tracking needed.
- Floating panel: `position:fixed`, `z-index:5000` (above Quasar header) so it can drag over
  the header on small screens. If a `fixed` el won't cross the header → raise z-index or Teleport.

### State overlay masking (mostly hide, faint hint)
- Solid fill at **~0.92 alpha** (`[246,245,239,0.92]`) — NOT blend mode (blend can't "mostly hide").
- Tuck basemap **reference (label) layers below** the overlay so labels get masked too:
  `map.add(ref, map.layers.indexOf(statesLayer))` (dynamic index, not a hardcoded number).
- Small state-info label button: shrink via `haloSize` (3 → 0.5) — text-symbol padding ≈ halo.

---

## 12. The Tour (Shepherd.js)

- `startTour(mapStore)` in `utils/appTour.js`; theme in `tour-theme.css` (import AFTER
  `shepherd.js/dist/css/shepherd.css`).
- **Targets:** `data-tour="..."` attributes. For `v-for` elements apply CONDITIONALLY so only
  one matches: `:data-tour="item.header === 'Conservation Values' ? 'cat-conservation' : null"`.
- **Panels driven via the store** (`showSiteReport`, `showHelpPanel`, expand + `filterLayers`),
  not simulated clicks.
- **Auto vs. interactive:** per-step; auto uses `beforeShowPromise`, interactive swaps to
  waiting on state. Easy to flip any single step later.
- **Map-clickable step gotcha:** hiding the overlay (`display:none`) lets map clicks through,
  but Shepherd treats outside-clicks as cancel → tour closes. It was fragile; current version
  keeps the Site Report step **descriptive** (overlay on, no interactivity) to avoid it.
- **Auto-start** (if adopted): localStorage first-visit flag + a `waitForApp()` poll for the
  `arcgis-map` view + a tour target before starting. **Status: parked pending team decision
  (first-visit vs. button-only).**

---

## 13. Layer Config Schema (per sublayer)

Keep: `index, mapIndex, elid, filter, visible, visibleModel, opacity, category, title,
description, longDescription`, plus optional `serviceId, type, style, legendType/lowLabel/
highLabel/gradient, pngWidth`.

Removed as dead (were runtime/legacy): `inBuffer, inExtent, totalArea, percentOfTotal,
pngLegend, legendImg`.

Histogram config adds **`values: [...]`** (the raster's "in" pixel value(s)) — e.g.
`protectedAreas [255]`, `bats [1,2]`, `resilientConnected [1,2,3]`, in/out masks `[1]`.

---

## 14. Open Threads / TODO (as of Jul 2026)
- [ ] **Lasso solar** — re-project the CORRECT solar band file to 5070/30m (a manual projection
      fed the same file twice → both showed wind), swap into mosaic, rebuild stats, republish.
- [ ] **One more layer** not working — diagnose via the item `/info/statistics` endpoint (§3.2).
- [ ] **Tour auto-start** — awaiting team call on first-visit vs. button-only.
- [ ] Consider stripping orphan `pngWidth` keys now that legendImg/pngLegend are gone.
- [ ] Confirm `abandonedag` value handling (24 year-values vs. reclass to single in/out mask).

---

## 15. Reusable Debug Checklist (any misbehaving raster)
1. `/ImageServer/query?where=Name LIKE '%x%'&outFields=Name` → is it even in the mosaic?
2. `/ImageServer/<oid>/info/statistics?f=json` → pixelType? pixelSize? SR? empty stats? max 65535?
3. Does the app's `values:[...]` config match the raster's real pixel value(s)?
4. Log `{ elid, min, max, size, counts, pixelCount }` — coarse bins? values colliding?
5. Test over a **known-data area** to rule out "correctly zero."

> Every failure mode hit on this project maps to one of: NoData/bit-depth, SR/resolution,
> stats-not-built-on-mosaic, republish-didn't-take, value-config-mismatch, or the async race.
