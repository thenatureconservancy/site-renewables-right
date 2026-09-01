// ============================================================================
//  Unified Legend System — Clean Energy Compass
//  ONE normalized model, consumed by: layers list, site report panel, and PDF.
//
//  Normalized legend shape (what every consumer receives):
//    { type: 'swatch',   color }                          → single colored square
//    { type: 'discrete', items: [{label, color}] }        → multiple squares
//    { type: 'ramp',     lowLabel, highLabel, gradient }  → gradient bar
//    { type: 'symbol',   shape, color, label }            → point marker
//    { type: 'hatch',    color }                          → diagonal-hatch square
//    { type: 'image',    src }                            → fallback (base64 / png path)
//
//  Resolution order (first match wins):
//    1. CUSTOM_LEGENDS[elid]          — explicit override
//    2. layer.legendType === 'ramp'   — inline ramp on the layer
//    3. LAYER_COLORS[elid]            — migrated square color (from old base64)
//    4. layer.legendImg / pngLegend   — legacy image fallback
// ============================================================================

// --- 1. Explicit custom legends (discrete / ramp / symbol) --------------------
export const CUSTOM_LEGENDS = {
  bats: {
    type: 'discrete',
    items: [
      { label: 'Threatened and endangered species', color: '#3f8edc' },
      { label: 'Non-listed species', color: '#8f8f8f' },
    ],
  },
  resilientConnected: {
    type: 'discrete',
    items: [
      { label: 'Resilient, biodiverse areas', color: '#4f8f5b' },
      { label: 'Connectivity pinchpoints', color: '#e58a35' },
      { label: 'Coastal migration space', color: '#d9c47a' },
    ],
  },
  cjest_lowincome: {
    type: 'ramp',
    lowLabel: 'High Income',
    highLabel: 'Low Income',
    gradient: 'linear-gradient(to right, #f4edf7, #b56bc7)',
  },
  lassoSolar: {
    type: 'ramp',
    lowLabel: 'Low',
    highLabel: 'High',
    gradient: 'linear-gradient(to right, #00346F, #717174, #FFEB46)',
  },
  lassoWind: {
    type: 'ramp',
    lowLabel: 'Low',
    highLabel: 'High',
   gradient: 'linear-gradient(to right, #00346F, #717174, #FFEB46)',
  },
  abandonedmines: { type: 'symbol', shape: 'triangle', color: '#c78b2c', label: 'Former Mine Lands' },
  brownfields:    { type: 'symbol', shape: 'diamond',  color: '#56b7b1', label: 'Brownfields' },
}

// --- 2. Migrated square colors (decoded from the old base64 legendImg) --------
//   These become { type: 'swatch', color } automatically via the resolver.
export const LAYER_COLORS = {
  protectedAreas:              '#13684a', // NOTE: old comment said #c8c8c8 — decoded green; verify
  floodPlainsWetlands:         '#96c7fc',
  threatenedEndangeredSpecies: '#d398fb',
  prairieGrouse:               '#878170',
  whoopingCraneSolar:          '#ff7b39',
  whoopingCraneWind:           '#ff7b39',
  bigGameSolar:                '#feccee',
  landscapeIntactness:         '#b2b2b2',
  birdsWind:                   '#a17f6d',
  migratoryBirdStopoverWind:   '#f6b69a',
  qualitywater:                '#69b7e4',
  ag2:                         '#d6bf9e',
  ag3:                         '#fdfc2f',
  ag4:                         '#fdb52f',
  abandonedag:                 '#e4947c',
  nativeLands:                 '#d6d6d6',
  // all 8 CJEST "burden" layers share one purple:
  cjest_climate:        '#773f87',
  cjest_energy:         '#773f87',
  cjest_health:         '#773f87',
  cjest_housing:        '#773f87',
  cjest_pollution:      '#773f87',
  cjest_transportation: '#773f87',
  cjest_water:          '#773f87',
  cjest_workforce:      '#773f87',
}

// --- 3. Special hatch/pattern layers ------------------------------------------
export const HATCH_LAYERS = {
  waterLimited: '#c7c7c7', // rendered as a diagonal hatch, not a solid fill
}

// --- The resolver: given a layer, return ONE normalized legend spec -----------
export function resolveLegend(layer) {
  if (!layer) return null
  const elid = layer.elid

  // 1. explicit custom legend wins
  if (elid && CUSTOM_LEGENDS[elid]) return CUSTOM_LEGENDS[elid]

  // 2. inline ramp defined on the layer object
  if (layer.legendType === 'ramp' && layer.gradient) {
    return {
      type: 'ramp',
      lowLabel: layer.lowLabel ?? 'Low',
      highLabel: layer.highLabel ?? 'High',
      gradient: layer.gradient,
    }
  }

  // 3. hatch pattern layers
  if (elid && HATCH_LAYERS[elid]) {
    return { type: 'hatch', color: HATCH_LAYERS[elid] }
  }

  // 4. migrated square color
  if (elid && LAYER_COLORS[elid]) {
    return { type: 'swatch', color: LAYER_COLORS[elid] }
  }

  // 5. legacy fallbacks (only if nothing above matched)
  if (layer.legendImg) {
    return { type: 'image', src: `data:image/png;base64,${layer.legendImg}` }
  }
  if (layer.pngLegend) {
    return { type: 'image', src: layer.pngLegend, width: layer.pngWidth }
  }

  return null // no legend available
}
