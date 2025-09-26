<script setup>
import { useAgolStore } from '@/stores/arcGisOnline'
import { ref, computed } from 'vue'

const agolStore = useAgolStore()
const page = ref('1')
const totalPages = computed(()=>(Math.ceil(props.total / 10 )))
const resultsPages = ref([])

function getStart(){
    let pg = this.page
    let start = (parseInt(pg)-1) * 10 + 1
    return start
}

function createPages(start) {
  for (let i = start; i <= start + 4; i++) {
    this.resultsPages.push(i)
  }
}

function handleTabChange() {
    console.log(this.page)
  if (this.page == 'more') {
    this.createPages(this.resultsPages.length + 6)
    // Optionally reset page to something else
  } else {
    let start = this.getStart()
    console.log(start)
    props.fetchFunction(start)
    this.tab
  }
}

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
  fetchFunction: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="row bg-white" v-if="props.title !== ''">
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
      style="max-width: 100%"
      class="smaller-tabs"
      @update:model-value="handleTabChange(v-modelValue)"
    >
      <q-tab class="q-pa-none q-ma-none" name="1" label="1" />
      <q-tab class="q-pa-none q-ma-none" name="2" label="2" />
      <q-tab class="q-pa-none q-ma-none" name="3" label="3" />
      <q-tab class="q-pa-none q-ma-none" name="4" label="4" />
      <q-tab class="q-pa-none q-ma-none" name="5" label="5" />
      <q-tab class="q-pa-none q-ma-none" v-for="(pg, index) in resultsPages" :key="index" :name="pg"
       :label="pg"></q-tab>
      <q-tab class="q-pa-none q-ma-none" name="more" label="..." @click="createPages(resultsPages.length + 6)"/>
    </q-tabs>
  </div>
</template>
<style scoped>
.smaller-tabs :deep(.q-tab__label) {
  font-size: 10px; /* Adjust the pixel value to your desired size */
}
</style>
