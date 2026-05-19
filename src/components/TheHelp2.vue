<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const splitterModel = ref(30)

// Flatten subheaders into a single TOC list
const tocItems = computed(() => {
  const items = []
  mapStore.layers.forEach((item) => {
    item.subheaders.forEach((layer) => {
      items.push(layer)
    })
  })
  return items
})

// Track selected section — default to first
const selectedTitle = ref(null)

const selectedSection = computed(() => {
  if (!selectedTitle.value && tocItems.value.length) {
    return tocItems.value[0]
  }
  return tocItems.value.find((t) => t.title === selectedTitle.value) || tocItems.value[0]
})

function selectSection(layer) {
  selectedTitle.value = layer.title
}
</script>

<template>
  <div class="help-panel">
    <q-splitter v-model="splitterModel" class="full-height">
      <!-- LEFT: Table of Contents -->
      <template #before>
        <div class="bg-blue-grey-9 text-white text-center q-pa-sm">
          <p class="text-body1 q-mb-none">Help Topics</p>
        </div>
        <q-list separator class="toc-list">
          <q-item
            v-for="(layer, i) in tocItems"
            :key="i"
            clickable
            v-ripple
            :active="selectedSection?.title === layer.title"
            active-class="bg-blue-grey-1 text-blue-grey-9"
            @click="selectSection(layer)"
          >
            <q-item-section>
              <q-item-label class="text-body2 text-bold">
                {{ layer.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <!-- RIGHT: Detail Content -->
      <template #after>
        <div v-if="selectedSection" class="q-pa-md detail-content">
          <div
            class="bg-blue-grey-9 text-white text-center q-pa-sm q-mb-md"
            style="border-radius: 4px"
          >
            <p class="text-body1 q-mb-none">{{ selectedSection.title }}</p>
          </div>
          <q-list v-for="(sublayer, i) in selectedSection.sublayers" :key="i">
            <q-item v-if="sublayer.elid !== 'whoopingCraneSolar'">
              <q-item-section>
                <q-item-label
                  class="text-bold"
                  :style="
                    mapStore.activeHelpElement === sublayer.elid
                      ? 'border: 2px solid green; padding: 5px'
                      : ''
                  "
                >
                  {{ sublayer.title }}
                </q-item-label>
                <q-item-label v-html="sublayer.longDescription" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<style scoped>
.help-panel {
  height: 100%;
}

.toc-list {
  overflow-y: auto;
}

.detail-content {
  overflow-y: auto;
  height: 100%;
}
</style>
