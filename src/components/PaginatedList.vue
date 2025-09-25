<script setup>
import { useSearchStore } from '@/stores/searchbar'
import { ref, computed } from 'vue'

const searchStore = useSearchStore()
const totalPages = computed(() => (props.total >= 10 ? Math.ceil(props.total / 10) : 1))
const page = ref('1')
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  total: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="row bg-white">
    <p class="text-body1 text-weight-medium q-mb-sm q-mt-md">{{ props.title }}</p>
    <q-space></q-space>
    <p class="text-caption q-mb-sm q-mt-md" v-if="totalPages > 1">
      Page {{ page }} of {{ totalPages }}
    </p>
  </div>
  <q-list bordered padding class="bg-white rounded">
    <q-item v-for="(layer, index) in props.items" :key="index">
      <q-item-section>
        <q-item-label>{{ layer.title }}</q-item-label>
        <q-item-label caption class="text-weight-medium">
          <q-img :src="layer.iconUrl" style="width: 15px; height: 15px"
            ><q-tooltip class="bg-white text-black">{{ layer.displayName }}</q-tooltip></q-img
          >
          {{ layer.owner }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          v-if="layer.snippet"
          outline
          size="sm"
          color="primary"
          round
          icon="description"
          @click="showTooltip = true"
          ><q-tooltip
            v-html="layer.snippet"
            class="text-body2 bg-white text-blue-grey-9"
            style="width: 300px; border: 1px solid #49aa43"
          >
          </q-tooltip>
          <q-menu v-if="layer.description"
            ><div
              v-html="layer.description"
              class="text-body2 bg-white text-blue-grey-9 q-ma-md"
              style="width: 300px"
            ></div
          ></q-menu>
        </q-btn>
      </q-item-section>
      <q-item-section side>
        <q-btn
          outline
          size="sm"
          color="primary"
          round
          icon="add"
          @click="
            () => {
              const mapLayer = agolStore.mapLayers.find((newlayer) => {
                return newlayer.id === layer.id
              })
              if (!mapLayer) {
                agolStore.mapLayers.push(layer)
                agolStore.addLayerToMap(layer.id)
              }
            }
          "
        >
          <q-tooltip
            class="text-body2 bg-white text-blue-grey-9"
            style="width: 140px; border: 1px solid #49aa43"
            >Add layer to map
          </q-tooltip></q-btn
        >
      </q-item-section>
    </q-item>
  </q-list>
  <div class="bg-white q-ma-md" v-if="totalPages > 1">
    <q-tabs
      v-model="page"
      active-class="bg-grey-3"
      indicator-color="transparent"
      dense
      outside-arrows=""
      style="width: 100%"
      class="smaller-tabs"
    >
      <q-tab class="q-pa-none q-ma-none" name="1" label="1" />
      <q-tab class="q-pa-none q-ma-none" name="2" label="2" />
      <q-tab class="q-pa-none q-ma-none" name="3" label="3" />
      <q-tab class="q-pa-none q-ma-none" name="4" label="4" />
      <q-tab class="q-pa-none q-ma-none" name="5" label="5" />
      <q-tab class="q-pa-none q-ma-none" name="6" label="6" />
      <q-tab class="q-pa-none q-ma-none" name="7" label="7" />
      <q-tab class="q-pa-none q-ma-none" name="8" label="8" />
      <q-tab class="q-pa-none q-ma-none" name="9" label="9" />
      <q-tab class="q-pa-none q-ma-none" name="10" label="10" />
      <q-tab class="q-pa-none q-ma-none" name="11" label="11" />
      <q-tab class="q-pa-none q-ma-none" name="12" label="12" />
      <q-tab class="q-pa-none q-ma-none" name="13" label="13" />
      <q-tab class="q-pa-none q-ma-none" name="14" label="14" />
      <q-tab class="q-pa-none q-ma-none" name="15" label="15" />
      <q-tab class="q-pa-none q-ma-none" name="16" label="16" />
      <q-tab class="q-pa-none q-ma-none" name="17" label="17" />
      <q-tab class="q-pa-none q-ma-none" name="18" label="18" />
      <q-tab class="q-pa-none q-ma-none" name="19" label="19" />
      <q-tab class="q-pa-none q-ma-none" name="20" label="20" />
    </q-tabs>
  </div>
</template>
<style scoped>
.smaller-tabs :deep(.q-tab__label) {
  font-size: 10px; /* Adjust the pixel value to your desired size */
}
</style>
