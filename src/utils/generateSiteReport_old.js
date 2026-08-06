import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// Version-proof font init (handles 0.1.x, 0.2.x, and bundler quirks)
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs || pdfMake.vfs;
// ============================================================================
//  Site Renewables Right — Site Report PDF
//  Adapted from the CCI Tool report. Driven entirely by mapStore.
//
//  Usage:
//    import { generateSiteReport } from '@/utils/generateSiteReport'
//    generateSiteReport(mapStore, { includeDescriptions: true })
// ============================================================================
const BRAND = {
  navy: "#1a3a5c",       // primary blue (official, matches CCI navy family)
  blue: "#2f6db0",       // accent blue
  bluePill: "#1976d2",   // the panel's count-pill blue
  bluePillBg: "#e3f2fd",
  grayText: "#666",
  lightRule: "#e5e7eb",
  infoBg: "#f4f7fb",
  subLabel: "#9aa5b1",   // subheader divider color (matches panel)
  subLabelBg: "#fafbfc",
};
export async function generateSiteReport(mapStore, options = {}) {
  const { includeDescriptions = false } = options;
  // ---- Map screenshot (buffer + point are already drawn on the view) ----
  const view = document.querySelector("arcgis-map").view;
  const screenshot = await view.takeScreenshot({
    format: "png",
    width: 1400,
    height: 700,
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
  // ---- Buffer area (hectares) — denominator for % of buffer ----
  const bufferAreaHa = mapStore.reportBufferAreaHa || 0;
  // ---- Build category → layers structure from the store (mirrors the panel) ----
  const categories = buildCategories(mapStore);
  // ---- Site-level summary metrics ----
  const summary = buildSummary(mapStore, categories);
  // ---- Assemble document ----
  const content = [
    // ===== HEADER =====
    {
      columns: [
        { text: "Site Renewables Right\nSite Report", style: "title", width: "*" },
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
      fontSize: 8, italics: true, color: "#999", margin: [0, 0, 0, 16],
    },
    // ===== SITE SUMMARY BAND =====
    { text: "Site Summary", style: "sectionHeader" },
    // Energy type subtitle (Option A) — reads like a report subtitle
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
            { text: "BUFFER RADIUS", style: "statLabel" },
            { text: "LAYERS INTERSECTED", style: "statLabel" },
            { text: "TOTAL SENSITIVE AREA", style: "statLabel" },
          ],
          [
            { text: `${latStr}, ${lonStr}`, style: "statValue" },
            { text: `${summary.bufferMiles} mi`, style: "statValue" },
            { text: `${summary.totalIntersected} / ${summary.totalLayers}`, style: "statValue" },
            { text: `${formatArea(summary.totalAreaHa)}`, style: "statValue" },
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
    {
      text: `${summary.communityFlags} community consideration flag${summary.communityFlags === 1 ? "" : "s"} present within the buffer.`,
      fontSize: 10, color: BRAND.grayText, margin: [0, 0, 0, 6],
    },
    // ===== CATEGORY ROLL-UP =====
    { text: "Category Overview", style: "sectionHeader" },
    buildRollupTable(categories),
    {
      text: "This report summarizes environmental and community data present within the selected buffer. Values reflect presence and measured area only and do not constitute a siting recommendation.",
      fontSize: 8, italics: true, color: "#999", margin: [0, 8, 0, 0],
    },
    // ===== PER-CATEGORY DETAIL =====
    { text: "Detailed Results", style: "sectionHeaderLarge", pageBreak: "before" },
    ...buildCategorySections(categories, includeDescriptions, bufferAreaHa),
  ];
  const docDefinition = {
    pageSize: "LETTER",
    pageMargins: [40, 40, 40, 50],
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: "Site Renewables Right — Site Report", fontSize: 8, color: "#999", margin: [40, 0, 0, 0] },
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
            description: sublayer.longDescription || sublayer.helpText || "",
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
  let totalAreaHa = 0;
  let communityFlags = 0;
  categories.forEach((cat) => {
    totalLayers += cat.count;
    totalIntersected += cat.intersected;
    cat.layers.forEach((l) => {
      if (l.result?.areaHa != null) totalAreaHa += l.result.areaHa;
      if (l.elid?.startsWith("cjest_") && isHit(l.result)) communityFlags++;
    });
  });
  return {
    bufferMiles: mapStore.bufferSize ?? "—",
    totalIntersected,
    totalLayers,
    totalAreaHa,
    communityFlags,
  };
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
/** "wind" -> "Wind"; handles null/undefined gracefully. */
/** Title-case each word: "floating solar" -> "Floating Solar". Null-safe. */
function capitalize(s) {
  if (!s) return "—";
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function buildCategorySections(categories, includeDescriptions, bufferAreaHa) {
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
              { text: l.description, style: "layerDesc", margin: [0, 1, 0, 0] },
            ],
          }
        : { text: l.title, style: "layerName" };
      const hit = isHit(l.result);
      body.push([
        nameCell,
        {
          text: formatSummary(l.result),
          fontSize: 10, alignment: "right",
          color: hit ? "#333" : "#999", bold: hit,
        },
        {
          text: percentCell(l.result, bufferAreaHa),
          fontSize: 10, alignment: "right", color: "#666",
        },
      ]);
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
  if ((result.areaHa || 0) > 0) return true;
  return false;
}
function formatSummary(result) {
  if (!result) return "—";
  if (result.ok === false) return "Error";
  if (result.summaryType === "count") return `${result.count || 0} found`;
  if (result.summaryType === "boolean") return result.intersected ? "Present" : "Not present";
  if (result.areaHa != null) return formatArea(result.areaHa);
  return "—";
}
/**
 * % of buffer only applies to raster (area) layers.
 * Computed here from areaHa / bufferAreaHa (bufferAreaHa in hectares).
 */
function percentCell(result, bufferAreaHa) {
  if (!result || result.areaHa == null) return "—";
  if (!bufferAreaHa) return "—";
  const pct = (result.areaHa / bufferAreaHa) * 100;
  return `${pct.toFixed(1)}%`;
}
function formatArea(area) {
  const v = area || 0;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k ha`;
  return `${v.toFixed(0)} ha`;
}
