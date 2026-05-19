<template>
  <div
    ref="switcher"
    class="basemap-switcher"
    :class="{ expanded: isExpanded }"
    @click.stop
    @pointerdown.stop
    @pointerup.stop
  >
    <!-- Collapsed: show current basemap thumbnail -->
    <div v-if="!isExpanded" class="basemap-card" @click="isExpanded = true">
      <img :src="currentBasemap.thumbnail" :alt="currentBasemap.label" />
      <span class="basemap-label">{{ currentBasemap.label }}</span>
    </div>

    <!-- Expanded: show all options horizontally -->
    <transition name="expand">
      <div v-if="isExpanded" class="basemap-options">
        <div
          v-for="bm in basemaps"
          :key="bm.id"
          class="basemap-card"
          :class="{ active: bm.id === currentBasemap.id }"
          @click="selectBasemap(bm)"
        >
          <img :src="bm.thumbnail" :alt="bm.label" />
          <span class="basemap-label">{{ bm.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Basemap from '@arcgis/core/Basemap.js'

// --- Basemap config ---
const PORTAL_URL = 'https://www.arcgis.com/sharing/rest/content/items'


const basemaps = [
  {
    id: 'd22aed9a4acb4bc8ae8f2141732af496',
    label: 'TNC Hillshade',
    thumbnail: `${PORTAL_URL}/d22aed9a4acb4bc8ae8f2141732af496/info/thumbnail/ago_downloaded.png`,
  },
  {
    id: '86265e5a4bbb4187a59719cf134e0018',
    label: 'Hybrid Imagery',
    thumbnail: "https://tnc.maps.arcgis.com/sharing/rest/content/items/86265e5a4bbb4187a59719cf134e0018/info/thumbnail/thumbnail1578325603377.jpeg?f=json",
  },
  {
    id: '3582b744bba84668b52a16b0b6942544',
    label: 'Human Geography',
    thumbnail: "https://tnc.maps.arcgis.com/sharing/rest/content/items/3582b744bba84668b52a16b0b6942544/info/thumbnail/thumbnail1579117155225.jpeg?f=json",
  },
  {
    id: '1dde97af802846f597a03d04050bad5b',
    label: 'TNC Topographic',
    thumbnail: `${PORTAL_URL}/1dde97af802846f597a03d04050bad5b/info/thumbnail/ago_downloaded.png`,
  },
]


// --- State ---
const isExpanded = ref(false)
const currentBasemap = ref(basemaps[0]) // default = TNC Light
const switcher = ref(null)

// --- Methods ---
function selectBasemap(bm) {
  currentBasemap.value = bm
  isExpanded.value = false

  const arcgisMap = document.querySelector('arcgis-map')
  if (arcgisMap?.map) {
    arcgisMap.map.basemap = new Basemap({
      portalItem: { id: bm.id },
    })
  }
}

// Close on click outside
function onClickOutside(e) {
  if (switcher.value && !switcher.value.contains(e.target)) {
    isExpanded.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.basemap-switcher {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 10;
  display: flex;
  align-items: flex-end;
}

.basemap-options {
  display: flex;
  gap: 8px;
}

.basemap-card {
  width: 80px;
  height: 80px;
  border-radius: 0px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition:
    border-color 0.2s,
    transform 0.15s;
  flex-shrink: 0;
}

.basemap-card:hover {
  transform: scale(1.05);
}

.basemap-card.active {
  border-color: #fff;
  box-shadow:
    0 0 0 2px #1976d2,
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.basemap-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.basemap-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 6px 4px;
  text-align: center;
  line-height: 1.2;
  pointer-events: none;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
