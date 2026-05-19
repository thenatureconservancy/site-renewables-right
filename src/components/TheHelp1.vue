<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

const selectedSection = ref(null)

const tocItems = computed(() => {
  const items = []
  mapStore.layers.forEach((item) => {
    item.subheaders.forEach((layer) => {
      items.push(layer)
    })
  })
  return items
})

function selectSection(layer) {
  selectedSection.value = layer
}

function goBack() {
  selectedSection.value = null
}
</script>

<template>
  <div class="help-panel">
    <!-- TABLE OF CONTENTS -->
    <template v-if="!selectedSection">
      <div class="help-header bg-blue-grey-9 text-white text-center q-pa-sm">
        <p class="text-body1 q-mb-none">Help Topics</p>
      </div>
      <div class="help-content">
        <q-list separator>
          <q-item
            v-for="(layer, i) in tocItems"
            :key="i"
            clickable
            v-ripple
            @click="selectSection(layer)"
          >
            <q-item-section>
              <q-item-label class="text-body2 text-bold">
                {{ layer.title }}
              </q-item-label>
              <q-item-label caption>
                {{ layer.sublayers.length }} item{{ layer.sublayers.length !== 1 ? 's' : '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-6" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>

    <!-- DETAIL VIEW -->
    <template v-else>
      <div class="help-header bg-blue-grey-9 text-white q-pa-sm row items-center no-wrap">
        <q-btn flat dense round icon="arrow_back" color="white" @click="goBack" />
        <p class="text-body1 q-mb-none col text-center q-pr-md">
          {{ selectedSection.title }}
        </p>
      </div>
      <div class="help-content">
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
  </div>
</template>

<style scoped>
.help-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.help-header {
  flex-shrink: 0;
}

.help-content {
  flex: 1;
  overflow-y: auto;
}
</style>
