// ============================================================================
//  Clean Energy Compass — Guided Tour (Shepherd.js)
//
//  Usage (from the "Start Tour" header button):
//    import { startTour } from '@/utils/appTour'
//    startTour(mapStore)
//
//  Requires:  npm install shepherd.js
//  Styles:    import 'shepherd.js/dist/css/shepherd.css'
//             import '@/assets/tour-theme.css'
//
//  DESIGN NOTES
//  ------------
//  • Steps attach to elements via the SELECTORS map. Add matching
//    data-tour="..." attributes in your templates.
//  • For v-for elements, apply the tag CONDITIONALLY so only ONE matches:
//        :data-tour="item.header === 'Conservation Values' ? 'cat-conservation' : null"
//        :data-tour="sublayer.elid === 'protectedAreas' ? 'layer-row' : null"
//        :data-tour="sublayer.elid === 'protectedAreas' ? 'layer-info-icon' : null"
//  • Button highlights use a soft blue glow (#2096F3, matching the Download
//    Data button). highlightEl()/highlightEls() add/remove it by selector.
//  • Site Report step is descriptive (no interactivity for now).
// ============================================================================
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { watch } from 'vue'

// ---- Element targets ---------------------------------------------------------
const SELECTORS = {
  intro:           '[data-tour="intro-text"]',        // left-panel purpose blurb    (single)
  dataLayers:      '[data-tour="data-layers"]',       // "DATA LAYERS" heading         (single)
  conservation:    '[data-tour="cat-conservation"]',  // Conservation Values header    (v-for → conditional)
  energyFilter:    '[data-tour="energy-filter"]',     // Wind/Solar/Floating chips      (single)
  layerRow:        '[data-tour="layer-row"]',         // one representative layer row   (v-for → conditional)
  layerInfoIcon:   '[data-tour="layer-info-icon"]',   // the (i) icon on a layer row    (v-for → conditional)
  layerInfoPanel:  '[data-tour="layer-info-panel"]',  // Layer Info slide-in panel      (single)
  sitePanel:       '.results-panel',                  // Site Report floating panel     (existing class)

  // --- Tools section (left panel) ---
  toolsHeader:     '[data-tour="tools-header"]',      // the TOOLS bar                  (single)
  toolsLayerInfo:  '[data-tour="tools-layer-info"]',  // Layer Info button in Tools     (single)
  toolsReport:     '[data-tour="tools-report"]',      // top toolbar Site Report button (single)
  // --- Top app toolbar (header) ---
 
  headerLayerInfo: '[data-tour="header-layer-info"]', // top toolbar Layer Info button  (single)
  headerAbout:     '[data-tour="header-about"]',      // top toolbar About button       (single)
  downloadData:    '[data-tour="download-data"]',     // header Download Data button     (single)
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// toggle the full-screen modal overlay (so a step's target/map is clickable)
function setOverlay(visible) {
  const overlay = document.querySelector('.shepherd-modal-overlay-container')
  if (overlay) overlay.style.display = visible ? '' : 'none'
}

// add / remove a highlight outline on the map element  (TODO: revisit — web
// component outline gets clipped; likely needs a wrapping div)
// Highlight the ArcGIS map-tool clusters (widgets sit in UI corner containers).
// Searches the arcgis-map shadow DOM too — that's why the old approach failed.
function highlightMapTools(on) {
  const mapEl = document.querySelector('arcgis-map')
  if (!mapEl) return

  // the roots where esri widgets might live (light DOM + the component's shadow)
  const roots = [document, mapEl.shadowRoot].filter(Boolean)

  const cornerSelectors = [
    '.esri-ui-top-left',
    '.esri-ui-top-right',
    '.esri-ui-bottom-left',
    '.esri-ui-bottom-right',
  ]

  roots.forEach((root) => {
    cornerSelectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((corner) => {
        // glow each individual widget block inside the corner, not the whole strip
        const targets = corner.children.length ? corner.children : [corner]
        Array.from(targets).forEach((el) => {
          if (on) {
            el.style.outline = '2px solid #2096F3'
            el.style.outlineOffset = '2px'
            el.style.borderRadius = '4px'
            el.style.boxShadow = '0 0 0 4px rgba(32, 150, 243, 0.25)'
          } else {
            el.style.outline = ''
            el.style.outlineOffset = ''
            el.style.boxShadow = ''
          }
        })
      })
    })
  })
}

// glow the individual buttons inside a zero-size wrapper (absolute children)
function highlightChildren(selector, on) {
  const wrapper = document.querySelector(selector)
  if (!wrapper) return
  wrapper.querySelectorAll('button').forEach((el) => {
    if (on) {
      el.style.outline = '2px solid #2096F3'
      el.style.outlineOffset = '2px'
      el.style.boxShadow = '0 0 0 4px rgba(32, 150, 243, 0.25)'
    } else {
      el.style.outline = ''
      el.style.outlineOffset = ''
      el.style.boxShadow = ''
    }
  })
}
// add / remove a soft blue glow on any element by selector
function highlightEl(selector, on) {
  const el = document.querySelector(selector)
  if (!el) return
  if (on) {
    el.style.outline = '2px solid #2096F3'
    el.style.outlineOffset = '2px'
    el.style.borderRadius = '4px'
    el.style.boxShadow = '0 0 0 4px rgba(32, 150, 243, 0.25)'
    el.style.transition = 'box-shadow 0.2s ease'
  } else {
    el.style.outline = ''
    el.style.outlineOffset = ''
    el.style.boxShadow = ''
  }
}

// highlight several elements at once (e.g. all Layer Info entry points)
function highlightEls(selectors, on) {
  selectors.forEach((s) => highlightEl(s, on))
}

// every selector we ever glow — used by cleanup() to clear stragglers
const ALL_HIGHLIGHTS = [
  SELECTORS.layerInfoIcon,
 SELECTORS.toolsLayerInfo, SELECTORS.toolsReport,
  SELECTORS.headerReport, SELECTORS.headerLayerInfo, SELECTORS.headerAbout,
  '[data-tour="map-tool-custom"]',
]

export function startTour(mapStore) {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: { enabled: true },
      classes: 'srr-tour',
      arrow: true,
    },
  })

  // --- Cancel guard --------------------------------------------------------
  let activeStepId = null
  let endedByUser = false
  tour.on('show', (e) => { activeStepId = e?.step?.id || null })

  // Buttons
  const backNext = [
    { text: 'Back', action: () => tour.back(), classes: 'shepherd-button-secondary' },
    { text: 'Next', action: () => tour.next() },
  ]
  const startButtons = [
    { text: 'Skip', action: () => { endedByUser = true; tour.cancel() }, classes: 'shepherd-button-secondary' },
    { text: 'Start', action: () => tour.next() },
  ]
  const finishButtons = [
    { text: 'Back', action: () => tour.back(), classes: 'shepherd-button-secondary' },
    { text: 'Done', action: () => { endedByUser = true; tour.complete() } },
  ]

  const cleanup = () => {
    mapStore.showSiteReport = false
    mapStore.showHelpPanel = false
    setOverlay(true)
    highlightMapTools(false)
    highlightChildren('[data-tour="map-tool-custom"]', false)
    highlightEls(ALL_HIGHLIGHTS, false)   // clear any lingering button glows

  }
  tour.on('complete', cleanup)
  tour.on('cancel', () => {
    if (!endedByUser && activeStepId === 'site-report') {
      setTimeout(() => tour.show('site-report'), 50)
      return
    }
    cleanup()
  })

  // -------------------------------------------------------------------------
  // 1. Welcome
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'welcome',
    title: 'Welcome to The Clean Energy Compass',
    text: `Welcome to The Clean Energy Compass. This quick tour shows how to use
          the map to identify potential climate, conservation and community (3C) considerations that may warrant further evaluation.
           <br/><br/>It takes about a minute — you can exit anytime.`,
    buttons: startButtons,
  })

  // -------------------------------------------------------------------------
  // 2. Purpose / intro blurb
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'intro',
    title: 'What This Tool Does',
    text: `Use the map and data layers to understand environmental and community
           context around a location across the United States.`,
    attachTo: { element: SELECTORS.intro, on: 'right' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 3. Data Layers overview
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'data-layers',
    title: 'Data Layers',
    text: `Data are organized into themed categories — Conservation Values,
           Disturbed Lands, Agricultural Considerations, Community Considerations, and more.
           Toggle a category on to see it on the map.`,
    attachTo: { element: SELECTORS.dataLayers, on: 'right' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 4. Expand Conservation Values
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'conservation',
    title: 'Explore a Category',
    text: `Let's open <b>Conservation Values</b>. Each category expands to reveal
           its individual layers, legends, and options.`,
    attachTo: { element: SELECTORS.conservation, on: 'right' },
    beforeShowPromise: async () => {
      const group = mapStore.layers?.find((g) => g.header === 'Conservation Values')
      if (group) {
        group.expanded = true
        if (typeof mapStore.setGroupVisibility === 'function') {
          mapStore.setGroupVisibility(group)
        }
      }
      await wait()
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 5. Energy type filter
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'energy-filter',
    title: 'Filter by Energy Type',
    text: `Conservation layers differ by technology. Choose <b>Wind</b>,
           <b>Solar</b>, or <b>Floating Solar</b> and the relevant layers update
           automatically — some sensitivities only apply to certain energy types.`,
    attachTo: { element: SELECTORS.energyFilter, on: 'right' },
    beforeShowPromise: async () => {
      if (typeof mapStore.filterLayers === 'function') {
        mapStore.filterLayers('solar')
      }
      await wait()
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 6. Per-layer controls — glow the (i) icon on a layer row (don't open panel)
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'layer-controls',
    title: 'Layer Controls',
    text: `Each layer has a legend, an opacity control, and can be dragged to
           reorder how it stacks on the map. The highlighted <b>(i)</b> button
           opens the Layer Info panel for that layer — we'll look at that next.`,
    attachTo: { element: SELECTORS.layerRow, on: 'right' },
    when: {
      show: () => highlightEl(SELECTORS.layerInfoIcon, true),
      hide: () => highlightEl(SELECTORS.layerInfoIcon, false),
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 7. Tools section — glow the TOOLS bar + its Layer Info button
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'tools',
    title: 'Tools',
    text: `The <b>Tools</b> section gives you quick access to key actions,
           including the <b>Layer Info</b> panel and the <b>Site Report</b>.`,
    attachTo: { element: SELECTORS.toolsHeader, on: 'right' },
  
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 8. Layer Info panel — open it, glow the header + tools + icon entry points
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'layer-info',
    title: 'Learn About the Data',
    text: `The <b>Layer Info</b> panel explains each layer — its source, meaning,
           and recommended use. You can open it from the highlighted buttons: the
           top toolbar, the Tools section, or the <b>(i)</b> next to any layer.`,
    attachTo: { element: SELECTORS.layerInfoPanel, on: 'left' },
    beforeShowPromise: async () => {
      mapStore.showSiteReport = false
      mapStore.showHelpPanel = true
      await wait(400)
    },
    when: {
      show: () => highlightEls(
        [SELECTORS.headerLayerInfo, SELECTORS.toolsLayerInfo, SELECTORS.layerInfoIcon], true),
      hide: () => highlightEls(
        [SELECTORS.headerLayerInfo, SELECTORS.toolsLayerInfo, SELECTORS.layerInfoIcon], false),
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 9. Site Report — open it, glow the header Site Report button
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'site-report',
    title: 'Generate a Site Report',
    text: `The <b>Site Report</b> analyzes everything within a buffer around a
           point you choose. <br/><br/><b>Double-click anywhere on the map</b> to
           drop a project location, then pick a buffer radius — the report tallies
           every layer that intersects and can export to PDF. Open it anytime from
           the highlighted button.`,
    attachTo: { element: SELECTORS.sitePanel, on: 'left' },
    beforeShowPromise: async () => {
      mapStore.showHelpPanel = false   // close Layer Info
      mapStore.showSiteReport = true   // open Site Report panel
      await wait(400)
    },
    when: {
      show: () => highlightEl(SELECTORS.headerReport, true),
      hide: () => highlightEl(SELECTORS.headerReport, false),
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 10. Map tools overview — highlight the whole map, centered dialog
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'map-tools',
    title: 'Map Tools',
    text: `The map has a few handy tools:
           <br/><br/>
           <b>Set Opacity</b> <span style="color:#888">(top-left)</span> — Set the opacity of ALL layers on the map (useful for seeing underlying basemap features)<br/>
           <b>ArcGIS Online</b> <span style="color:#888">(top-left)</span> — sign in to add additional or private data to the map.<br/>
           <b>Home</b> <span style="color:#888">(top-left)</span> — return to the full U.S. view.<br/>
           <b>Measure</b> <span style="color:#888">(top-left)</span> — measure distances and areas.<br/>
           <b>Basemap Switcher</b> <span style="color:#888">(bottom-left)</span> — change the underlying basemap.<br/>
           <b>Search</b> <span style="color:#888">(top-right)</span> — find a location by address, place name, or coordinates.`,
    // No attachTo → centered dialog; we highlight the whole map manually.
    beforeShowPromise: async () => {
      mapStore.showSiteReport = false
      await wait()
    },
    when: {
      show: () => {
        setOverlay(false)   // don't dim; we outline the map instead
        highlightMapTools(true)
        highlightEl('[data-tour="map-tool-custom"]', true)
        highlightChildren('[data-tour="map-tool-custom"]', true)
      },
      hide: () => {
        highlightMapTools(false)
        highlightEl('[data-tour="map-tool-custom"]', false)
       highlightChildren('[data-tour="map-tool-custom"]', false)
        setOverlay(true)
      },
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 11. Download data
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'download',
    title: 'Download the Data',
    text: `Need the underlying datasets? <b>Download Data</b> links you to the
           source layers for your own analysis.`,
    attachTo: { element: SELECTORS.downloadData, on: 'bottom' },
    when: {
      show: () => highlightEl(SELECTORS.downloadData, true),
      hide: () => highlightEl(SELECTORS.downloadData, false),
    },
    buttons: backNext,
  })

  

  // -------------------------------------------------------------------------
  // 13. Finish
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'finish',
    title: "You're Ready to Explore!",
    text: `That's the tour. Try toggling layers, filtering by energy type, and
           double-clicking the map to generate your first Site Report.
           <br/><br/>You can restart this tour anytime from <b>Start Tour</b>.`,
    buttons: finishButtons,
  })

  tour.start()
  return tour
}
