<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const splitterModel = ref(30)

// which whooping crane elid to hide for the current category
const hiddenElid = computed(() => {
  if (mapStore.category === 'solar') return 'whoopingCraneWind'
  if (mapStore.category === 'wind' || mapStore.category === 'floating solar')
    return 'whoopingCraneSolar'
  return null
})

// Flatten subheaders into a single TOC list
const tocItems = computed(() => {
  const items = []
  mapStore.layers.forEach((item) => {
    item.subheaders.forEach((layer) => {
      items.push({
        ...layer,
        // drop the crane layer that doesn't apply to the current category
        sublayers: layer.sublayers?.filter((s) => s.elid !== hiddenElid.value),
        tocId: layer.title,
        title:
          layer.title === 'Highly Sensitive'
            ? 'Conservation Values <br/> (Highly Sensitive)'
            : layer.title === 'Moderately Sensitive'
              ? 'Conservation Values <br/>(Moderately Sensitive)'
              : layer.title === 'Highest Quality Farmland'
                ? 'Agricultural Considerations <br/>(Highest Quality Farmland)'
                : layer.title === 'Limitations to Farmland'
                  ? 'Agricultural Considerations <br/>(Limitations to Farmland)'
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
    <q-toolbar class="section-header">
      <p class="text-overline q-ml-sm q-mb-none text-bold">Layer Info</p>
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
            active-class="bg-blue-grey-1 text-weight-bold text-blue-grey-9"
            @click="mapStore.selectedHelpSection = layer.tocId"
          >
            <q-item-section>
              <q-item-label
                class="text-body2 text-weight-medium"
                v-html="layer.title"
              ></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <!-- RIGHT: Detail Content -->
      <template #after>
        <div v-if="selectedSection" class="q-pa-md detail-content">
          <div class="text-center q-pa-sm q-mb-md" style="border-radius: 4px">
            <p class="text-h6 q-mb-none" v-html="selectedSection.title"></p>
            <p
              caption
              class="text-caption text-left q-mt-md"
              v-html="selectedSection.subheaderBlurb"
            ></p>
          </div>
          <q-list v-for="(sublayer, i) in selectedSection.sublayers" :key="i">
            <q-item>
              <q-item-section>
                <q-item-label>
                  <div class="layer-info">
                    <h3
                      class="layer-title"
                      :id="sublayer.elid"
                      :style="
                        mapStore.activeHelpElement === sublayer.elid
                          ? 'border: 2px solid rgb(52, 64, 107, .2); padding: 5px'
                          : ''
                      "
                    >
                      {{ sublayer.title }}
                    </h3>

                    <div class="info-section">
                      <h4 class="info-label">About the data</h4>
                      <p v-html="sublayer.infoAbout"></p>
                    </div>

                    <div class="info-section">
                      <h4 class="info-label">Why these data are included</h4>
                      <p v-html="sublayer.infoWhy"></p>
                    </div>

                    <div class="info-section">
                      <h4 class="info-label">How should the data be used?</h4>
                      <p v-html="sublayer.infoHow"></p>
                    </div>
                  </div>
                </q-item-label>
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

.layer-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 14px;
  line-height: 1.2;
}
.info-section {
  margin-bottom: 16px;
}
.info-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #34406b; /* your solar-blue — ties to the panel header */
  margin: 0 0 4px;
}
.info-section p {
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  margin: 0;
}
</style>
