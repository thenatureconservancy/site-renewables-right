<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed, onMounted, watch } from 'vue'

let mapStore = useMapStore()

// Draggable panel position
const panelX = ref(window.innerWidth - 320)
const panelY = ref(140)
const isDragging = ref(false)
const dragOffset = { x: 0, y: 0 }

// For testing - set to false when you have real data

// Track which category headers are expanded
const expandedCategories = ref({})

// Get all visible layers organized by category
const intersectionResults = computed(() => {
  const results = {}

  mapStore.layers.forEach((group) => {
    if (group.header) {
      results[group.header] = []

      group.subheaders?.forEach((subheader) => {
        subheader.sublayers?.forEach((sublayer) => {
          // Only include sublayers that match current category or are 'both'
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

// Calculate total area from results
const totalArea = computed(() => {
  let total = 0
  Object.values(intersectionResults.value).forEach((categoryLayers) => {
    categoryLayers.forEach((layer) => {
      // Add demo data if showing demo
      const area = mapStore.showDemo
        ? layer.totalArea || Math.random() * 5000
        : layer.totalArea || 0
      total += area
    })
  })
  return total
})

// Compute inactive state
const isInactive = computed(() => totalArea.value === 0 && !mapStore.showDemo)

// Watch for state changes and adjust panel position
watch(isInactive, (newIsInactive) => {
  if (newIsInactive) {
    // Inactive state - smaller panel positioned further left
    panelX.value = window.innerWidth - 320
    panelY.value = 140
  } else {
    // Active state - larger panel positioned closer to address bar
    panelX.value = window.innerWidth - 430
    panelY.value = 110
  }
})

// Format area for display
const formatArea = (area) => {
  if (area >= 1000) {
    return `${(area / 1000).toFixed(1)}k ha`
  }
  return `${area.toFixed(0)} ha`
}

// Calculate percentage
const getPercentage = (area) => {
  if (totalArea.value === 0) return 0
  return ((area / totalArea.value) * 100).toFixed(1)
}

// Calculate metadata for each category
const getCategoryMetadata = (categoryName) => {
  const categoryLayers = intersectionResults.value[categoryName] || []
  const count = categoryLayers.length
  let categoryTotal = 0

  categoryLayers.forEach((layer) => {
    const area = mapStore.showDemo
      ? layer.totalArea || Math.floor(Math.random() * 5000)
      : layer.totalArea
    categoryTotal += area || 0
  })

  const percentage =
    totalArea.value === 0 ? 0 : ((categoryTotal / totalArea.value) * 100).toFixed(1)

  return {
    count,
    total: categoryTotal,
    percentage,
  }
}

// Buffer controls
const onBufferChange = (bufferValue) => {
  mapStore.bufferSize = bufferValue
  // Trigger recalculation - add your API call here
  console.log('Buffer changed to:', bufferValue, 'miles')
}

const setCustomBuffer = (value) => {
  if (value) {
    mapStore.bufferSize = value
    console.log('Custom buffer set to:', value, 'miles')
  }
}

// Toggle category accordion
const toggleCategory = (categoryName) => {
  expandedCategories.value[categoryName] = !expandedCategories.value[categoryName]
}

// Clear results
const clearResults = () => {
  mapStore.showDemo = false
  // Clear all sublayer totalArea values
  mapStore.layers.forEach((group) => {
    group.subheaders?.forEach((subheader) => {
      subheader.sublayers?.forEach((sublayer) => {
        sublayer.totalArea = 0
      })
    })
  })
  // Reset expanded categories
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

  return () => {
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragEnd)
  }
})
</script>

<template>
  <div
    class="results-panel"
    :style="{ left: panelX + 'px', top: panelY + 'px' }"
    @mousedown="onDragStart"
    :class="{ inactive: totalArea === 0 && !mapStore.showDemo }"
  >
    <!-- INACTIVE STATE -->
    <div v-if="totalArea === 0 && !mapStore.showDemo">
      <div class="results-header">
        <h6 class="">Site Intersection Analysis</h6>
      </div>
      <div class="inactive-message">
        <p>Double click the map or use the find address to begin</p>
      </div>
    </div>

    <!-- ACTIVE STATE -->
    <div v-else>
      <!-- Header -->
      <div class="results-header q-pr-sm">
        <div
          style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px"
        >
          <h6>Site Intersection Results</h6>
        </div>
        <div
          style="
            font-size: 10px;
            opacity: 0.85;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>
            Lat: {{ mapStore.currentPoint ? mapStore.currentPoint.lat?.toFixed(2) : '--' }} | Lon:
            {{ mapStore.currentPoint ? mapStore.currentPoint.lon?.toFixed(2) : '--' }}
          </span>
          <span class="total-area-compact">{{ formatArea(totalArea) }}</span>
        </div>

        <!-- Buffer Size Control -->
        <div class="buffer-section">
            <div class="row">
          <div class="buffer-label">
            Buffer Size:
            <div class="info-icon" title="Expand the search area around your selected point">?</div>
          </div>
          <q-space></q-space>
          <div class="text-caption text-bold">**Sample Data - Demo Only**</div>
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
              @click="
                mapStore.bufferSize = size;
                onBufferChange(size)
              "
            >
              {{ size }} mi
            </q-btn>
            <q-btn
              flat
              dense
              no-caps
              :class="{ active: mapStore.bufferSize >= 10 }"
              class="buffer-btn"
              @click="$refs.customBufferMenu?.toggle()"
            >
              Custom
            </q-btn>
          </div>
          <div class="custom-input-wrapper" v-if="mapStore.bufferSize >= 10">
            <q-input
              v-model.number="mapStore.bufferSize"
              dense
              outlined
              type="number"
              min="0.1"
              step="0.1"
              @update:model-value="setCustomBuffer"
              style="flex: 1"
            />
            <span class="custom-input-label">mi</span>
          </div>
        </div>
      </div>

      <!-- Results Body -->
      <div class="results-body">
        <template v-for="(categoryLayers, categoryName) in intersectionResults" :key="categoryName">
          <div v-if="categoryLayers.length > 0" class="result-category">
            <div class="category-title" @click="toggleCategory(categoryName)">
              <span class="accordion-icon">
                {{ expandedCategories[categoryName] ? '▼' : '▶' }}
              </span>
              <span>{{ categoryName }}</span>
              <div class="category-pills">
                <span class="pill pill-count"
                  >{{ getCategoryMetadata(categoryName).count }} items</span
                >
                <span class="pill pill-area">{{
                  formatArea(getCategoryMetadata(categoryName).total)
                }}</span>
              </div>
            </div>

            <div v-if="expandedCategories[categoryName]">
              <div v-for="layer in categoryLayers" :key="layer.elid" class="result-item">
                <div
                  class="color-swatch"
                  v-if="layer.legendImg"
                  :style="{ backgroundImage: `url('data:image/png;base64,${layer.legendImg}')` }"
                ></div>
                <div v-else class="color-swatch" style="background: #ddd"></div>

                <div class="result-info">
                  <div class="result-name">{{ layer.title }}</div>
                  <div class="result-stats">
                    <span class="stat">
                      <span class="stat-label">Area:</span>
                      {{
                        formatArea(
                          mapStore.showDemo
                            ? layer.totalArea || Math.floor(Math.random() * 5000)
                            : layer.totalArea,
                        )
                      }}
                    </span>
                    <span class="stat">
                      <span class="stat-label">%:</span>
                      {{
                        getPercentage(
                          mapStore.showDemo
                            ? layer.totalArea || Math.floor(Math.random() * 5000)
                            : layer.totalArea,
                        )
                      }}%
                    </span>
                  </div>
                </div>
              </div>
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
          label="Clear"
          @click="clearResults"
        />
        <q-btn
          flat
          dense
          no-caps
          class="btn btn-secondary"
          label="📊 Export CSV"
          @click="console.log('Export CSV')"
        />
        <q-btn
          flat
          dense
          no-caps
          class="btn btn-primary"
          label="Get Site Report"
          @click="console.log('Get Report')"
        />
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
  z-index: 1000;
  user-select: none;
}

.results-header {
  background: linear-gradient(135deg, #64b45b 0%, #5aa54d 100%);
  color: white;
  padding-left: 10px;
  border-bottom: 4px solid #4a8c3a;
  cursor: move;
}

.results-header h6 {
  font-size: 14px;
  margin: 0;
  font-weight: 500;
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
  font-weight: 600;
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
  padding: 8px 6px;
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
  gap: 6px;
  align-items: center;
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

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  margin-right: 12px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
  background: #64b45b;
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
</style>
