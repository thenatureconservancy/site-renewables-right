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
//  • Site Report step is INTERACTIVE: user double-clicks the map. The overlay
//    is hidden so the map is clickable; a cancel-guard prevents that map click
//    from accidentally ending the tour. The primary button switches from
//    "Skip this step" → "Next" once a point is placed.
// ============================================================================

import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { watch } from 'vue'

// ---- Element targets ---------------------------------------------------------
const SELECTORS = {
  intro:          '[data-tour="intro-text"]',       // left-panel purpose blurb   (single)
  dataLayers:     '[data-tour="data-layers"]',      // "DATA LAYERS" heading        (single)
  conservation:   '[data-tour="cat-conservation"]', // Conservation Values header   (v-for → conditional)
  energyFilter:   '[data-tour="energy-filter"]',    // Wind/Solar/Floating chips     (single)
  layerRow:       '[data-tour="layer-row"]',        // one representative layer row  (v-for → conditional)
  layerInfoPanel: '[data-tour="layer-info-panel"]', // Layer Info slide-in panel    (single)
  sitePanel:      '.results-panel',                 // Site Report floating panel   (existing class)
  downloadData:   '[data-tour="download-data"]',    // header Download Data button   (single)
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// toggle the full-screen modal overlay (so a step's target/map is clickable)
function setOverlay(visible) {
  const overlay = document.querySelector('.shepherd-modal-overlay-container')
  if (overlay) overlay.style.display = visible ? '' : 'none'
}

// add / remove a highlight outline on the map element
function highlightMap(on) {
  const map = document.querySelector('arcgis-map')
  if (!map) return
  map.style.outline = on ? '3px solid #64b45b' : ''
  map.style.outlineOffset = on ? '-3px' : ''
}

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
  // Track the active step + whether the user explicitly ended the tour, so an
  // ACCIDENTAL cancel (from clicking the map during the interactive step) does
  // not tear down the whole tour.
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
    highlightMap(false)
  }

  tour.on('complete', cleanup)
  tour.on('cancel', () => {
    // If a cancel sneaks in during the interactive step and the user didn't
    // explicitly end the tour, reopen that step instead of quitting.
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
    title: 'Welcome to Clean Energy Compass',
    text: `This quick tour shows how to explore where renewable energy development
           may face conservation constraints, tradeoffs, or opportunities.
           <br/><br/>It takes about a minute — you can exit anytime.`,
    buttons: startButtons,
  })

  // -------------------------------------------------------------------------
  // 2. Purpose / intro blurb
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'intro',
    title: 'What this tool does',
    text: `Use the map and data layers to understand environmental and community
           context around a potential project site across the United States.`,
    attachTo: { element: SELECTORS.intro, on: 'bottom' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 3. Data Layers overview
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'data-layers',
    title: 'Data Layers',
    text: `Data are organized into themed categories — Conservation Values,
           Disturbed Lands, Agricultural Values, Community Considerations, and more.
           Toggle a category on to see it on the map.`,
    attachTo: { element: SELECTORS.dataLayers, on: 'right' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 4. Expand Conservation Values
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'conservation',
    title: 'Explore a category',
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
    title: 'Filter by energy type',
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
  // 6. Per-layer controls
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'layer-controls',
    title: 'Layer controls',
    text: `Each layer has a legend, an <b>(i)</b> button to read about the data,
           and an opacity control. Drag layers to reorder how they stack on the map.`,
    attachTo: { element: SELECTORS.layerRow, on: 'right' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 7. Layer Info panel
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'layer-info',
    title: 'Learn about the data',
    text: `The <b>Layer Info</b> panel explains each layer — its source, meaning,
           and methodology. Open it from the header, the Tools section, or the
           <b>(i)</b> button next to any layer.`,
    attachTo: { element: SELECTORS.layerInfoPanel, on: 'left' },
    beforeShowPromise: async () => {
      mapStore.showSiteReport = false
      mapStore.showHelpPanel = true
      await wait(400)
    },
    buttons: backNext,
  })

    // -------------------------------------------------------------------------
  // 8. Site Report (descriptive — no interactivity for now)
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'site-report',
    title: 'Generate a Site Report',
    text: `The <b>Site Report</b> analyzes everything within a buffer around a
           point you choose. <br/><br/><b>Double-click anywhere on the map</b> to
           drop a project location, then pick a buffer radius — the report tallies
           every layer that intersects and can export to PDF.`,
    attachTo: { element: SELECTORS.sitePanel, on: 'left' },
    beforeShowPromise: async () => {
      mapStore.showHelpPanel = false   // close Layer Info
      mapStore.showSiteReport = true   // open Site Report panel
      await wait(400)
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 9. Map tools overview — highlight the whole map, centered dialog, list tools
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'map-tools',
    title: 'Map tools',
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
        highlightMap(true)
      },
      hide: () => {
        highlightMap(false)
        setOverlay(true)
      },
    },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 10. Download data
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'download',
    title: 'Download the data',
    text: `Need the underlying datasets? <b>Download Data</b> links you to the
           source layers for your own analysis.`,
    attachTo: { element: SELECTORS.downloadData, on: 'bottom' },
    buttons: backNext,
  })

  // -------------------------------------------------------------------------
  // 11. Finish
  // -------------------------------------------------------------------------
  tour.addStep({
    id: 'finish',
    title: "You're ready to explore!",
    text: `That's the tour. Try toggling layers, filtering by energy type, and
           double-clicking the map to generate your first Site Report.
           <br/><br/>You can restart this tour anytime from <b>Start Tour</b>.`,
    buttons: finishButtons,
  })

  tour.start()
  return tour
}
