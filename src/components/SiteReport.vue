<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { generateSiteReport } from '@/utils/generateSiteReport'
import LegendSwatch from '@/components/LegendSwatch.vue'

const mapStore = useMapStore()

// Draggable panel position
const panelX = ref(window.innerWidth - 320)
const panelY = ref(140)
const showCustom = ref(false)
const isDragging = ref(false)
const includeDescriptions = ref(false)
const dragOffset = { x: 0, y: 0 }

// Track which category headers are expanded
const expandedCategories = ref({})
// true when this category should show its policy INSTEAD of its layers
const isPolicyOnly = (categoryName) =>
  categoryName === 'Conservation Values' && !!mapStore.statePolicy

const hasSelection = computed(() => !!mapStore.currentPoint)

// Get all visible layers organized by category
const intersectionResults = computed(() => {
  const results = {}

  mapStore.layers.forEach((group) => {
    if (group.header) {
      results[group.header] = []

      group.subheaders?.forEach((subheader) => {
        subheader.sublayers?.forEach((sublayer) => {
          if (
            (sublayer.category === mapStore.category || sublayer.category === 'both') &&
            sublayer.filter
          ) {
            results[group.header].push({
              ...sublayer,
              groupHeader: group.header,
              subheaderTitle: subheader.title,
            })
          }
        })
      })
    }
  })

  return results
})

// --- Unified "did this layer hit?" test (raster area OR vector intersect) ---
const layerHit = (layer) => {
  if (layer.intersected === true) return true // vector/point layers
  if ((layer.totalArea || 0) > 0) return true // raster layers
  return false
}

// Calculate total area from results (rasters only contribute area)
const totalArea = computed(() => {
  let total = 0
  Object.values(intersectionResults.value).forEach((categoryLayers) => {
    categoryLayers.forEach((layer) => {
      total += layer.totalArea || 0
    })
  })
  return total
})

// Compute inactive state
const isInactive = computed(() => !hasSelection.value)

// Watch for state changes and adjust panel position
watch(isInactive, (newIsInactive) => {
  if (newIsInactive) {
    panelX.value = window.innerWidth - 320
    panelY.value = 140
  } else {
    panelX.value = window.innerWidth - 390
    panelY.value = 60
  }
})

// Format area for display
const formatArea = (area) => {
  const value = area || 0
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ac`
  }
  return `${value.toFixed(0)} ac`
}

// Format the right summary per layer type
const formatSummary = (layer) => {
  if (layer.summaryType === 'count') {
    return `${layer.count || 0} found`
  }
  if (layer.summaryType === 'boolean') {
    return layer.intersected ? 'Present' : 'Not present'
  }
  if (layer.summaryType === 'stats') {
  if (!layer.intersected) return 'No data'
    return `min ${layer.min?.toFixed(2)} · mean ${layer.mean?.toFixed(2)} · max ${layer.max?.toFixed(2)}`
}
  // default = raster area layer
  return formatArea(layer.totalArea)
}

// True only for raster layers (so we know when to show the % stat)
const isRasterLayer = (layer) => layer.summaryType == null

// Calculate percentage (raster layers only)
const getPercentage = (area) => {
  const denom = mapStore.reportBufferAreaAc
  if (!denom) return 0
  return (((area || 0) / denom) * 100).toFixed(1)
}
const showSubheader = (layers, i, categoryName) => {
  const sub = layers[i].subheaderTitle
  if (!sub || sub === categoryName) return false // no sub, or same as header → skip
  if (i === 0) return true // first in category → show
  return sub !== layers[i - 1].subheaderTitle // show only when it changes
}
// Calculate metadata for each category
const getCategoryMetadata = (categoryName) => {
  const categoryLayers = intersectionResults.value[categoryName] || []
  const count = categoryLayers.length
  let categoryTotal = 0
  let intersectedCount = 0

  categoryLayers.forEach((layer) => {
    categoryTotal += layer.totalArea || 0 // only rasters add area
    if (layerHit(layer)) intersectedCount++ // counts raster + vector hits
  })

  const percentage =
    totalArea.value === 0 ? 0 : ((categoryTotal / totalArea.value) * 100).toFixed(1)

  return {
    count,
    intersected: intersectedCount,
    total: categoryTotal,
    percentage,
  }
}

// Compute all category metadata once (cached + reactive)
const categoryMeta = computed(() => {
  const out = {}
  for (const name of Object.keys(intersectionResults.value)) {
    out[name] = getCategoryMetadata(name)
  }
  return out
})

// Buffer controls
const onBufferChange = (bufferValue) => {
  mapStore.bufferSize = bufferValue
  mapStore.createBuffer('current')
}

// Toggle category accordion
const toggleCategory = (categoryName) => {
  expandedCategories.value[categoryName] = !expandedCategories.value[categoryName]
}

// Clear results
const clearResults = () => {
  mapStore.layers.forEach((group) => {
    group.subheaders?.forEach((subheader) => {
      subheader.sublayers?.forEach((sublayer) => {
        sublayer.totalArea = 0
        sublayer.intersected = false
        sublayer.count = 0
        sublayer.summaryType = undefined
      })
    })
  })
  mapStore.reportResults = {}
  mapStore.currentPoint = null
  mapStore.statePolicy = null
  expandedCategories.value = {}
}

// Drag handlers
const onDragStart = (e) => {
  if (e.target.closest('.results-header')) {
    isDragging.value = true
    dragOffset.x = e.clientX - panelX.value
    dragOffset.y = e.clientY - panelY.value
  }
}

const onDragMove = (e) => {
  if (!isDragging.value) return
  panelX.value = e.clientX - dragOffset.x
  panelY.value = e.clientY - dragOffset.y
}

const onDragEnd = () => {
  isDragging.value = false
}



onMounted(() => {
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
})
</script>

<template>
  <div
    v-if="mapStore.showSiteReport"
    class="results-panel"
    :style="{ left: panelX + 'px', top: panelY + 'px' }"
    @mousedown="onDragStart"
    :class="{ inactive: !hasSelection }"
  >
    <!-- INACTIVE STATE -->
    <div v-if="!hasSelection">
      <div class="results-header q-pr-sm">
        <div
          style="display: flex; width: 300px;justify-content: space-between; align-items: flex-start; gap: 8px"
        >
           <p class="text-overline q-ml-sm q-mb-none text-bold" >SITE REPORT INSTRUCTIONS</p>
          <q-space></q-space>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            padding="sm"
            class=""
            icon="close"
            @click="hideSiteReport()"
          />
        </div>
      </div>

      <div class="text-h6 q-pa-md">
        <p>
          Double click the map to select a project location. Buffer radius options are available on
          the next screen.
        </p>
      </div>
    </div>

    <!-- ACTIVE STATE -->
    <div v-else>
      <!-- Header -->
      <div class="results-header q-pr-sm">
        <div
          style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px"
        >
          <p class="text-overline q-ml-sm q-mb-none text-bold">SITE REPORT RESULTS</p>
          <q-space></q-space>
          <q-btn
            flat
            dense
            no-caps
            size="sm"
            padding="sm"
            class=""
            icon="close"
            @click="mapStore.hideSiteReport()"
          />
        </div>
<div
  style="
    font-size: 10px;
    opacity: 0.85;
    display: flex;
    align-items: center;
  "
>
  <span style="flex: 1; text-align: center;">
    Lat:
    {{
      mapStore.currentPoint.detail.mapPoint.latitude
        ? mapStore.currentPoint.detail.mapPoint.latitude?.toFixed(2)
        : '--'
    }}
    , Lon:
    {{
      mapStore.currentPoint.detail.mapPoint.longitude
        ? mapStore.currentPoint.detail.mapPoint.longitude?.toFixed(2)
        : '--'
    }}
  </span>
  <span style="flex: 1; text-align: center;">Energy Type: {{ mapStore.category }}</span>
  <span style="flex: 1; text-align: center;">Area: {{ formatArea(mapStore.reportBufferAreaAc) }}</span>
</div>

        <!-- Buffer Size Control -->
        <div class="buffer-section q-pa-sm">
          <div class="row">
            <div class="buffer-label">Buffer Size:</div>
            <q-btn color="white" icon="help_outline" size="sm" padding="xs" flat class="q-mb-xs">
              <q-menu>
                <div class="q-pa-md" style="width: 300px">
                  <p class="">
                    <b>Buffer Size:</b> The buffer radius determines how far outward from your
                    selected point the analysis area extends. Intersecting layers are evaluated
                    within this area. Choose a preset distance or enter a custom radius up to 35
                    miles.
                  </p>
                </div>
              </q-menu>
            </q-btn>
          </div>
          <div class="buffer-buttons">
            <q-btn
              v-for="size in [0.5, 1, 5]"
              :key="`buffer-${size}`"
              flat
              dense
              no-caps
              :class="{ active: mapStore.bufferSize === size }"
              class="buffer-btn"
              @click="onBufferChange(size)"
            >
              {{ size }} mi
            </q-btn>
            <q-btn
              flat
              dense
              no-caps
              :class="{ active: showCustom == true }"
              class="buffer-btn"
              @click="showCustom = !showCustom"
            >
              Custom
            </q-btn>
          </div>
          <div class="custom-input-wrapper bg-white" v-if="showCustom == true">
            <q-input
              v-model.number="mapStore.bufferSize"
              dense
              outlined
              color="white"
              type="number"
              min="0.1"
              step="0.1"
              @update:model-value="onBufferChange(mapStore.bufferSize)"
              style="flex: 1"
              placeholder="input radius: max allowed 35 mi"
              suffix="mi"
            />
          </div>
        </div>
      </div>

      <!-- Results Body -->
      <div class="results-body">
        <template v-for="(categoryLayers, categoryName) in intersectionResults" :key="categoryName">
          <div v-if="categoryLayers.length > 0" class="result-category">
            <!-- Category title (ALWAYS shows) -->
            <div class="category-title" @click="toggleCategory(categoryName)">
              <span class="accordion-icon">
                {{ expandedCategories[categoryName] ? '▼' : '▶' }}
              </span>
              <span>{{ categoryName }}</span>
              <div class="category-pills">
                <span
                  class="pill"
                  :class="categoryMeta[categoryName].intersected > 0 ? 'pill-present' : 'pill-none'"
                >
                  <span v-if="mapStore.reportLoading" class="pill-loader"></span>
                  <template v-else>
                    {{ categoryMeta[categoryName].intersected }} /
                    {{ categoryMeta[categoryName].count }}
                    Items
                  </template>
                </span>
              </div>
            </div>

            <!-- State policy note: only under Conservation Values, only when present -->
            <div
              v-if="isPolicyOnly(categoryName) && expandedCategories[categoryName]"
              class="state-policy"
            >
              <div v-html="mapStore.statePolicy.html"></div>
            </div>

            <!-- Expanded layers -->
            <div v-if="expandedCategories[categoryName] && !isPolicyOnly(categoryName)">
              <template v-for="(layer, i) in categoryLayers" :key="layer.elid">
                <!-- subheader divider: only when it changes AND differs from the category name -->
                <div
                  v-if="showSubheader(categoryLayers, i, categoryName)"
                  class="subheader-divider"
                >
                  {{ layer.subheaderTitle }}
                </div>

                <div class="result-item">
                  <!-- Unified legend (compact: cascade / gradient chip / single square) -->
                  <div class="report-swatch">
                    <LegendSwatch :layer="layer" :show-labels="false" :size="14" compact />
                  </div>

                  <div class="result-info">
                    <div class="result-name">{{ layer.title }}</div>
                    <div class="result-stats">
                      <span class="stat">
                        <span class="stat-label">Result:</span>
                        {{ formatSummary(layer) }}
                      </span>
                      <span class="stat" v-if="isRasterLayer(layer)">
                        <span class="stat-label">%:</span>
                        {{ getPercentage(layer.totalArea) }}%
                      </span>
                    </div>
                  </div>
                  <!-- intersect indicator dot -->
                  <div class="hit-dot" :class="{ active: layerHit(layer) }"></div>
                </div>
              </template>
            </div>
          </div>
        </template>

        <div
          v-if="!Object.values(intersectionResults).some((arr) => arr.length > 0)"
          class="no-results"
        >
          No results for current selection
        </div>
      </div>

      <!-- Footer -->
      <div class="results-footer">
        <q-btn
          flat
          dense
          no-caps
          size="sm"
          class="btn btn-secondary"
          label="Select New Location"
          @click="clearResults"
        />

        <div class="pdf-controls">
          <q-checkbox
            v-model="includeDescriptions"
            dense
            size="xs"
            label="Include layer descriptions"
            class="desc-toggle"
          />
          <q-btn
            flat
            dense
            no-caps
            class="btn btn-primary"
            label="Save as PDF"
            @click="generateSiteReport(mapStore, { includeDescriptions: includeDescriptions })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-panel {
  position: fixed;
  width: 380px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 3000;
  user-select: none;
}

.results-header {
  background: linear-gradient(135deg, #34406b 0%, #2a3557 100%); /* deep solar blue */
  color: #ffffff; /* white text — was dark, now reads on blue */
  padding-left: 10px;
  /* green accent stripe (was darker green) */
  cursor: move;
}

.results-header h6 {
  font-size: 14px;
  margin: 0;
  font-weight: 600; /* was 500 — slightly bolder reads better in white */
  color: #ffffff;
}

.total-area {
  font-size: 16px;
  font-weight: bold;
}

.total-area-compact {
  font-size: 12px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
}

.total-area-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.results-panel.inactive {
  width: 240px;
}

.inactive-message {
  background: white;
  padding: 24px 16px;
  text-align: center;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inactive-message p {
  margin: 0;
  color: #888;
}

.buffer-section {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.buffer-label {
  font-size: 11px;
  font-weight: 550;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: help;
  font-weight: bold;
}

.buffer-buttons {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.buffer-btn {
  flex: 1;
  padding: 4px 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1) !important;
  color: white;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.buffer-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
}

.buffer-btn.active {
  background: white !important;
  color: #64b45b;
  border-color: white !important;
}

.custom-input-wrapper {
  display: flex;
  align-items: end;
  margin-top: 8px;
}

.custom-input-label {
  font-size: 11px;
  white-space: nowrap;
  color: white;
  opacity: 0.9;
}

.results-body {
  max-height: 500px;
  overflow-y: auto;
  padding: 12px;
}

.result-category {
  margin-bottom: 16px;
}

.category-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 8px 12px;
  background: #f9f9f9;
  border-left: 4px solid #64b45b;
  margin-bottom: 8px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  transition: all 0.2s ease;
}

.category-title:hover {
  background: #f0f0f0;
  transform: translateX(2px);
}

.accordion-icon {
  display: inline-block;
  font-size: 10px;
  transition: transform 0.2s ease;
}

.category-pills {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.pill-count {
  background: #e3f2fd;
  color: #1976d2;
}

.pill-area {
  display: none;
}
/* Layers present — soft amber flag (attention, not alarm) */
.pill-present {
  background: #e3f2fd;
  color: #1976d2;
}

/* No layers present — neutral, no judgment */
.pill-none {
  background: #f4f5f6; /* very light gray — reads cleaner than pure white on a white panel */
  color: #61656e;
  border: 1px solid #e5e7eb; /* subtle outline so it doesn't vanish */
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 6px;
  background: #fafafa;
  transition: all 0.2s ease;
  cursor: pointer;
}

.result-item:hover {
  background: #f0f7ec;
  transform: translateX(4px);
}

/* wrapper for the unified legend on the left of each result row */
.report-swatch {
  width: 24px;
  margin-right: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.result-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.stat-label {
  font-weight: 600;
  color: #999;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 12px;
}

.results-footer {
  border-top: 1px solid #e0e0e0;
  padding: 10px;
  display: flex;
  gap: 6px;
}

.btn {
  flex: 1;
  padding: 8px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.btn-primary {
  background: #3f8c4a;
  color: white;
}

.btn-primary:hover {
  background: #5aa54d;
  box-shadow: 0 2px 8px rgba(100, 180, 91, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

/* Scrollbar styling */
.results-body::-webkit-scrollbar {
  width: 6px;
}

.results-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.results-body::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border-radius: 3px;
}

.results-body::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.pdf-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.desc-toggle {
  font-size: 10px;
  color: #666;
}
.desc-toggle :deep(.q-checkbox__label) {
  font-size: 10px;
}
.hit-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 10px;
  background: transparent; /* invisible when no hit */
  transition: background 0.2s ease;
}

.hit-dot.active {
  background: rgba(25, 118, 210, 0.5) !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.15); /* soft halo, subtle pop */
}
.subheader-divider {
  font-size: 10px;
  font-weight: 600;
  color: #9aa5b1;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 6px 12px 2px;
  margin-top: 4px;
}
.state-policy {
  background: #f0f7ec;
  border-left: 3px solid #64b45b;
  border-radius: 3px;
  padding: 10px 12px;
  margin: 0 0 10px;
  font-size: 11px;
  line-height: 1.45;
  color: #35502f;
}
.state-policy :deep(a) {
  color: #2e7d32;
  text-decoration: underline;
}
.pill-loader {
  display: block;
  height: 3px;
  width: 40px; /* ← was 100% — fixed width so it can't collapse */
  background: linear-gradient(90deg, #34406b 30%, #cdd4e6 30%);
  background-size: 200% 100%;
  animation: pill-load 1s linear infinite;
  border-radius: 2px;
}
@keyframes pill-load {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
