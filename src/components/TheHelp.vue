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
      items.push({
        ...layer,
        tocId: layer.title,
        title:
          layer.title === 'Highly Sensitive'
            ? 'Conservation Values (Highly Sensitive)'
            : layer.title === 'Moderately Sensitive'
              ? 'Conservation Values (Moderately Sensitive)'
              : layer.title,
      })
    })
  })
  return items
})

const selectedSection = computed(() => {
  return tocItems.value.find((t) => t.tocId === mapStore.selectedHelpSection) || tocItems.value[0]
})
</script>

<template>
  <div class="help-panel">
    <q-toolbar class="bg-blue-grey-9 text-white">
      <span class="text-h6 text-weight-bold">Layer Info Topics</span>
      <q-space></q-space>
      <q-btn flat icon="close" @click="mapStore.showHelpPanel = false"></q-btn>
    </q-toolbar>
    <q-splitter v-model="splitterModel" class="full-height">
      <!-- LEFT: Table of Contents -->
      <template #before>
        <q-list separator class="toc-list">
          <q-item
            v-for="(layer, i) in tocItems"
            :key="i"
            clickable
            v-ripple
            :active="mapStore.selectedHelpSection === layer.tocId"
            active-class="bg-blue-grey-1 text-blue-grey-9"
            @click="mapStore.selectedHelpSection = layer.tocId"
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
          <div v-html="selectedSection.description"></div>
          <div class="text-center q-pa-sm q-mb-md" style="border-radius: 4px">
            <p class="text-body1 q-mb-none">{{ selectedSection.title }}</p>
          </div>
          <q-list v-for="(sublayer, i) in selectedSection.sublayers" :key="i">
            <q-item v-if="sublayer.elid !== 'whoopingCraneSolar'">
              <q-item-section>
                <q-item-label
                  :id="sublayer.elid"
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
          <div style="height: 50px"></div>
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
