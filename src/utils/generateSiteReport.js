import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { resolveLegend } from "@/utils/legends";
// Version-proof font init (handles 0.1.x, 0.2.x, and bundler quirks)
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs || pdfMake.vfs;
// ============================================================================
//  Clean Energy Compass — Site Report PDF
//  Adapted from the CCI Tool report. Driven entirely by mapStore.
//
//  Usage:
//    import { generateSiteReport } from '@/utils/generateSiteReport'
//    generateSiteReport(mapStore, { includeDescriptions: true })
// ============================================================================
const BRAND = {
  navy: "#34406b",       // solar-blue (matches app UI section headers / panel)
  blue: "#2f6db0",       // accent blue
  bluePill: "#1976d2",   // the panel's count-pill blue
  bluePillBg: "#e3f2fd",
  grayText: "#666",
  lightRule: "#e5e7eb",
  infoBg: "#f4f7fb",
  subLabel: "#9aa5b1",   // subheader divider color (matches panel)
  subLabelBg: "#fafbfc",
};
// Groups to exclude from the report entirely (per team request)
const EXCLUDE_GROUPS = ["Probability of Renewable Energy Buildout"];
// legend swatch geometry (pdf points)
const SW = 9;      // swatch square size
const SW_GAP = 5;  // gap between swatch and label
const CASCADE_CHIP = 7;
const CASCADE_OFFSET = 3;
export async function generateSiteReport(mapStore, options = {}) {
  const { includeDescriptions = false } = options;
  // ---- Map screenshot (buffer + point are already drawn on the view) ----
  const view = document.querySelector("arcgis-map").view;
  const screenshot = await view.takeScreenshot({
    format: "png",
    width: 1400,
    height: 700,   // original 2:1 capture
  });
  // ---- Header meta ----
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  // ---- Location (from currentPoint.detail.mapPoint) ----
  const mp = mapStore.currentPoint?.detail?.mapPoint;
  const lat = mp?.latitude;
  const lon = mp?.longitude;
  const latStr = lat != null ? lat.toFixed(4) : "—";
  const lonStr = lon != null ? lon.toFixed(4) : "—";
  // ---- Energy type (wind / solar), from the active category ----
  const energyType = capitalize(mapStore.category);
  // ---- Buffer area (acres) — denominator for % of buffer ----
  const bufferAreaAc = mapStore.reportBufferAreaAc || 0;
  // ---- Build category → layers structure from the store (mirrors the panel) ----
  const categories = buildCategories(mapStore);
  // ---- Site-level summary metrics ----
  const summary = buildSummary(mapStore, categories);
  // ---- Map legend (only VISIBLE layers for the current category) ----
  const mapLegend = buildMapLegend(mapStore);
  // ---- Assemble document ----
  const content = [
    // ===== HEADER =====
    {
      columns: [
        { text: "Clean Energy Compass\nSite Report", style: "title", width: "*" },
        {
          text: [
            { text: "REPORT DATE\n", style: "metaLabel" },
            { text: dateStr, style: "metaValue" },
          ],
          alignment: "right",
          width: "auto",
        },
      ],
      margin: [0, 0, 0, 12],
    },
    // Thin brand rule
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: BRAND.navy },
      ],
      margin: [0, 0, 0, 14],
    },
    // ===== MAP =====
    { image: screenshot.dataUrl, width: 515, margin: [0, 0, 0, 6] },
    {
      text: "Selected project location with analysis buffer.",
      fontSize: 8, italics: true, color: "#999", margin: [0, 0, 0, 10],
    },
    // ===== MAP LEGEND (visible layers) =====
    ...mapLegend,
    // --- Disclaimer sits under the legend to fill page 1 ---
    {
      text: "The Clean Energy Compass provides national-scale information to support early-stage planning and should be used alongside site-specific assessments, input from state and federal wildlife agencies, robust community engagement, Tribal consultation and other local analyses. It is important to note that the presence of wildlife and habitat resources or community considerations does not necessarily preclude wind and solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures.",
      fontSize: 10, italics: true, color: "#555", lineHeight: 1.25, margin: [0, 6, 0, 14],
    },
    // ===== SITE SUMMARY (flows naturally; no forced page break) =====
    { text: "Site Summary", style: "sectionHeader" },
    {
      text: [
        { text: "Energy Type:  ", fontSize: 10, bold: true, color: BRAND.grayText },
        { text: energyType, fontSize: 10, color: "#333" },
      ],
      margin: [0, 0, 0, 8],
    },
    {
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            { text: "LOCATION (LAT, LON)", style: "statLabel" },
            { text: "BUFFER (RADIUS / AREA)", style: "statLabel" },
            { text: "LAYERS INTERSECTED", style: "statLabel" },
            { text: "SENSITIVE AREA (% OF BUFFER)", style: "statLabel" },
          ],
          [
            { text: `${latStr}, ${lonStr}`, style: "statValue" },
            { text: `${summary.bufferMiles} mi / ${formatArea(summary.bufferAreaAc)}`, style: "statValue" },
            { text: `${summary.totalIntersected} / ${summary.totalLayers}`, style: "statValue" },
            { text: formatPercent(summary.sensitivePct), style: "statValue" },
          ],
        ],
      },
      layout: {
        hLineWidth: (i) => (i === 1 ? 1 : 0),
        vLineWidth: () => 0,
        hLineColor: () => BRAND.lightRule,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
      margin: [0, 0, 0, 8],
    },
    // ===== CATEGORY ROLL-UP (starts page 2; page 1 = map + disclaimer + summary) =====
    { text: "Category Overview", style: "sectionHeader", pageBreak: "before" },
    buildRollupTable(categories),
    // ===== PER-CATEGORY DETAIL (flows right after; no forced page break) =====
    { text: "Detailed Results", style: "sectionHeaderLarge", margin: [0, 16, 0, 10] },
    ...buildCategorySections(categories, includeDescriptions, bufferAreaAc),
  ];
  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 50],
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: "Clean Energy Compass — Site Report", fontSize: 8, color: "#999", margin: [40, 0, 0, 0] },
        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 8, color: "#999", alignment: "right", margin: [0, 0, 40, 0] },
      ],
    }),
    content,
    styles: {
      title: { fontSize: 18, bold: true, color: BRAND.navy },
      metaLabel: { fontSize: 9, color: "#999", bold: true },
      metaValue: { fontSize: 11, color: "#333" },
      sectionHeader: { fontSize: 13, bold: true, color: BRAND.navy, margin: [0, 12, 0, 8] },
      sectionHeaderLarge: { fontSize: 15, bold: true, color: BRAND.navy, margin: [0, 0, 0, 10] },
      categoryHeader: { fontSize: 12, bold: true, color: "#fff" },
      statLabel: { fontSize: 8, color: "#999", bold: true },
      statValue: { fontSize: 13, bold: true, color: "#333" },
      layerName: { fontSize: 10, color: "#333" },
      layerDesc: { fontSize: 8, color: "#777", italics: true },
      legendHeader: { fontSize: 11, bold: true, color: BRAND.navy, margin: [0, 0, 0, 6] },
    },
  };
  pdfMake.createPdf(docDefinition).download("srr-site-report.pdf");
}
// ============================================================================
//  DATA BUILDERS
// ============================================================================
function buildCategories(mapStore) {
  const results = mapStore.reportResults || {};
  const categories = [];
  mapStore.layers.forEach((group) => {
    if (!group.header) return;
    if (EXCLUDE_GROUPS.includes(group.header)) return;   // drop excluded groups
    const layers = [];
    group.subheaders?.forEach((subheader) => {
      subheader.sublayers?.forEach((sublayer) => {
        if (
          (sublayer.category === mapStore.category || sublayer.category === "both") &&
          sublayer.filter
        ) {
          const r = results[sublayer.elid] || null;
          layers.push({
            elid: sublayer.elid,
            title: sublayer.title || sublayer.elid,
            description: sublayer.infoAbout || "",   // ← reads from infoAbout
            subheaderTitle: subheader.title || "",   // ← carried through for dividers
            result: r,
          });
        }
      });
    });
    if (layers.length) {
      categories.push({
        name: group.header,
        layers,
        intersected: layers.filter((l) => isHit(l.result)).length,
        count: layers.length,
      });
    }
  });
  return categories;
}
function buildSummary(mapStore, categories) {
  let totalIntersected = 0;
  let totalLayers = 0;
  let totalAreaAc = 0;
  categories.forEach((cat) => {
    totalLayers += cat.count;
    totalIntersected += cat.intersected;
    cat.layers.forEach((l) => {
      if (l.result?.areaAc != null) totalAreaAc += l.result.areaAc;
    });
  });
  const bufferAreaAc = mapStore.reportBufferAreaAc || 0;
  // Sensitive area as a % of the buffer. NOTE: layers can overlap, so this can
  // exceed 100% (it's a summed footprint, not a unioned one).
  const sensitivePct = bufferAreaAc ? (totalAreaAc / bufferAreaAc) * 100 : 0;
  return {
    bufferMiles: mapStore.bufferSize ?? "—",
    bufferAreaAc,
    totalIntersected,
    totalLayers,
    totalAreaAc,
    sensitivePct,
  };
}
// ============================================================================
//  MAP LEGEND BUILDER (visible layers for current category — mirrors the map)
// ============================================================================
function buildMapLegend(mapStore) {
  // Collect every VISIBLE sublayer that applies to the current category.
  const entries = [];
  mapStore.layers.forEach((group) => {
    //if (EXCLUDE_GROUPS.includes(group.header)) return;   // keep excluded groups out of the legend too
    group.subheaders?.forEach((subheader) => {
      subheader.sublayers?.forEach((sublayer) => {
        if (sublayer.visible !== true) return;          // only what's on the map
        // match the technology type chosen (fixes e.g. whooping crane twice)
        if (sublayer.category !== mapStore.category && sublayer.category !== "both") return;
        const spec = resolveLegend(sublayer);
        if (!spec) return;                              // no legend → skip
        entries.push({ title: sublayer.title || sublayer.elid, spec });
      });
    });
  });
  if (!entries.length) return []; // nothing visible → no legend block
  // Build one legend column entry (swatch canvas + title) per layer.
  const items = entries.map((e) => legendItem(e.title, e.spec));
  // Two-column layout to keep the legend compact under the map.
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);
  return [
    { text: "Map Legend", style: "legendHeader" },
    {
      columns: [
        { width: "50%", stack: col1 },
        { width: "50%", stack: col2 },
      ],
      columnGap: 12,
      margin: [0, 0, 0, 10],
    },
  ];
}
/** One legend row: a small canvas swatch beside the layer title. */
function legendItem(title, spec) {
  return {
    columns: [
      { width: "auto", canvas: swatchCanvas(spec), margin: [0, 1, 0, 0] },
      { width: "*", text: title, fontSize: 8, color: "#333", margin: [SW_GAP, 0, 0, 0] },
    ],
    columnGap: 0,
    margin: [0, 0, 0, 3],
  };
}
/** Build a pdfMake canvas array that mirrors the LegendSwatch shapes. */
function swatchCanvas(spec) {
  switch (spec.type) {
    case "swatch":
      return [rect(0, 0, SW, SW, spec.color)];
    case "hatch":
      // approximate the diagonal hatch with a few diagonal lines in a bordered box
      return [
        rect(0, 0, SW, SW, "#ffffff", spec.color),
        { type: "line", x1: 0, y1: SW, x2: SW, y2: 0, lineWidth: 1, lineColor: spec.color },
        { type: "line", x1: SW / 2, y1: SW, x2: SW, y2: SW / 2, lineWidth: 1, lineColor: spec.color },
        { type: "line", x1: 0, y1: SW / 2, x2: SW / 2, y2: 0, lineWidth: 1, lineColor: spec.color },
      ];
    case "symbol":
      if (spec.shape === "triangle") {
        return [{ type: "polyline", closePath: true, color: spec.color,
          points: [{ x: SW / 2, y: 0 }, { x: SW, y: SW }, { x: 0, y: SW }] }];
      }
      // diamond
      return [{ type: "polyline", closePath: true, color: spec.color,
        points: [{ x: SW / 2, y: 0 }, { x: SW, y: SW / 2 }, { x: SW / 2, y: SW }, { x: 0, y: SW / 2 }] }];
    case "discrete": {
      // diagonal cascade of small chips (mirrors compact mode)
      const items = spec.items || [];
      return items.map((it, i) =>
        rect(i * CASCADE_OFFSET, i * CASCADE_OFFSET, CASCADE_CHIP, CASCADE_CHIP, it.color, "#ffffff")
      );
    }
    case "ramp":
      // gradient can't render in canvas → sample stops as adjacent chips
      return rampChips(spec.gradient);
    case "image":
      // legacy image fallback: draw a neutral box (image can't go in canvas)
      return [rect(0, 0, SW, SW, "#dddddd", "#bbbbbb")];
    default:
      return [rect(0, 0, SW, SW, "#dddddd")];
  }
}
/** filled (optionally bordered) rectangle helper */
function rect(x, y, w, h, color, border) {
  const r = { type: "rect", x, y, w, h, color };
  if (border) { r.lineWidth = 0.75; r.lineColor = border; }
  return r;
}
/** Turn a CSS linear-gradient string into a few adjacent color chips. */
function rampChips(gradient) {
  const cols = extractColors(gradient);
  const stops = cols.length ? cols : ["#dddddd"];
  const chipW = SW / stops.length;
  return stops.map((c, i) => rect(i * chipW, 0, chipW, SW, c));
}
/** Pull hex colors out of a "linear-gradient(...)" string. */
function extractColors(gradient) {
  const m = (gradient || "").match(/#[0-9a-fA-F]{3,8}/g);
  return m || [];
}
// ============================================================================
//  TABLE / SECTION BUILDERS
// ============================================================================
function buildRollupTable(categories) {
  const rows = categories.map((cat) => [
    { text: cat.name, fontSize: 10, color: "#333" },
    {
      text: `${cat.intersected} / ${cat.count}`,
      fontSize: 10, alignment: "right",
      color: cat.intersected > 0 ? BRAND.bluePill : "#999",
      bold: cat.intersected > 0,
    },
  ]);
  return {
    table: {
      widths: ["*", 70],
      body: [
        [
          { text: "Category", bold: true, fontSize: 9, color: "#999" },
          { text: "Layers with data", bold: true, fontSize: 9, color: "#999", alignment: "right" },
        ],
        ...rows,
      ],
    },
    layout: {
      hLineWidth: (i) => (i <= 1 ? 1 : 0.5),
      vLineWidth: () => 0,
      hLineColor: (i) => (i <= 1 ? "#ccc" : "#eee"),
      paddingTop: () => 5,
      paddingBottom: () => 5,
    },
    margin: [0, 0, 0, 4],
  };
}
/** Normalize titles so trailing spaces / casing don't cause false mismatches. */
function norm(s) {
  return (s || "").trim().toLowerCase();
}
/** Title-case each word: "floating solar" -> "Floating Solar". Null-safe. */
function capitalize(s) {
  if (!s) return "—";
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function buildCategorySections(categories, includeDescriptions, bufferAreaAc) {
  const blocks = [];
  categories.forEach((cat) => {
    // Category banner
    blocks.push({
      table: {
        widths: ["*"],
        body: [[{ text: cat.name, style: "categoryHeader", margin: [8, 5, 8, 5] }]],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        fillColor: () => BRAND.navy,
      },
      margin: [0, 6, 0, 0],
      unbreakable: true,
    });
    const body = [
      [
        { text: "Layer", bold: true, fontSize: 9, color: "#999" },
        { text: "Result", bold: true, fontSize: 9, color: "#999", alignment: "right" },
        { text: "% of Buffer", bold: true, fontSize: 9, color: "#999", alignment: "right" },
      ],
    ];
    let lastSub = null;
    const catNorm = norm(cat.name);
    cat.layers.forEach((l) => {
      // ---- subheader divider row: only when it changes AND differs from category ----
      const subNorm = norm(l.subheaderTitle);
      if (subNorm && subNorm !== catNorm && subNorm !== lastSub) {
        body.push([
          {
            text: l.subheaderTitle,
            colSpan: 3,
            fontSize: 8,
            bold: true,
            color: BRAND.subLabel,
            fillColor: BRAND.subLabelBg,
            margin: [4, 3, 0, 3],
            characterSpacing: 0.4,
          },
          {}, {},
        ]);
        lastSub = subNorm;
      }
      // ---- layer row ----
      const nameCell = includeDescriptions && l.description
        ? {
            stack: [
              { text: l.title, style: "layerName" },
              { text: stripHtml(l.description), style: "layerDesc", margin: [0, 1, 0, 0] },
            ],
          }
        : { text: l.title, style: "layerName" };
      const hit = isHit(l.result);
      // stats layers span the Result + % columns with their range summary
      if (l.result?.summaryType === "stats") {
        body.push([
          nameCell,
          {
            text: formatSummary(l.result),
            colSpan: 2,
            fontSize: 10, alignment: "right",
            color: hit ? "#333" : "#999", bold: hit,
          },
          {},
        ]);
      } else {
        body.push([
          nameCell,
          {
            text: formatSummary(l.result),
            fontSize: 10, alignment: "right",
            color: hit ? "#333" : "#999", bold: hit,
          },
          {
            text: percentCell(l.result, bufferAreaAc),
            fontSize: 10, alignment: "right", color: "#666",
          },
        ]);
      }
    });
    blocks.push({
      table: { widths: ["*", 90, 60], body },
      layout: {
        hLineWidth: (i) => (i <= 1 ? 1 : 0.5),
        vLineWidth: () => 0,
        hLineColor: (i) => (i <= 1 ? "#ccc" : "#eee"),
        paddingTop: () => 5,
        paddingBottom: () => 5,
      },
      margin: [0, 0, 0, 14],
    });
  });
  return blocks;
}
// ============================================================================
//  FORMAT HELPERS
// ============================================================================
function isHit(result) {
  if (!result) return false;
  if (result.intersected === true) return true;
  if ((result.areaAc || 0) > 0) return true;
  return false;
}
function formatSummary(result) {
  if (!result) return "—";
  if (result.ok === false) return "Error";
  if (result.summaryType === "count") return `${result.count || 0} found`;
  if (result.summaryType === "boolean") return result.intersected ? "Present" : "Not present";
  if (result.summaryType === "stats") {
    if (!result.intersected || result.mean == null) return "No data";
    const p = (v) => `${Math.round(v * 100)}%`;   // P200_I_PFS is a 0–1 percentile
    return `${p(result.min)}–${p(result.max)} (avg ${p(result.mean)})`;
  }
  if (result.areaAc != null) return formatArea(result.areaAc);
  return "—";
}
/**
 * % of buffer only applies to raster (area) layers.
 * Computed here from areaAc / bufferAreaAc (bufferAreaAc in acres).
 */
function percentCell(result, bufferAreaAc) {
  if (!result || result.areaAc == null) return "—";
  if (!bufferAreaAc) return "—";
  const pct = (result.areaAc / bufferAreaAc) * 100;
  return `${pct.toFixed(1)}%`;
}
/** Area in acres. */
function formatArea(area) {
  const v = area || 0;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k ac`;
  return `${v.toFixed(0)} ac`;
}
/** Percent formatter for the summary band. */
function formatPercent(pct) {
  const v = pct || 0;
  return `${v.toFixed(1)}%`;
}
/** Strip HTML tags from infoAbout for the plain-text PDF description cell. */
function stripHtml(html) {
  return (html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
