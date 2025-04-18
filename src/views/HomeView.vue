<script setup>
import TheMap from '../components/TheMap.vue'
import TheLeftPanel from '@/components/TheLeftPanel.vue';
import TheHelp from '@/components/TheHelp.vue';
import TheLegend from '@/components/TheLegend.vue';
import { useMapStore } from '../stores/map';


const mapStore = useMapStore();


function openPanel(active){
  mapStore.panelState = 'open';
  mapStore.activeTool = active;
  
}

</script>

<template>
  <div class="row">
    <div class="col-4"><TheLeftPanel></TheLeftPanel></div>
    
    <div class="col"><the-map></the-map></div>
    <div class="col-1" style="width: 40px">
      <div  class="bg-blue-grey-1 text-dark" style="height: 100%">
      <div id="" class="text-center">
      <q-btn square padding="xs" flat size="md" :icon="mapStore.panelState== 'open' ? 'chevron_right':'chevron_left'" class="q-mt-md" @click="mapStore.panelState == 'open'? mapStore.panelState = 'closed': mapStore.panelState = 'open'">
        <q-tooltip>Collapse | Expand</q-tooltip>
        
      </q-btn><br/>
      <q-btn square padding="xs" size="md" flat  :class="mapStore.activeTool == 'legend'? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'" @click.stop="openPanel('legend')">
        <q-tooltip>Legend</q-tooltip>
        <calcite-icon icon="legend" scale="m"></calcite-icon>
      </q-btn><br/>
      <q-btn square padding="xs" flat size="md" :class="mapStore.activeTool == 'opacity'? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'" @click.stop="openPanel('opacity')">
        <q-tooltip>Opacity</q-tooltip>
        <calcite-icon icon="transparency" scale="m"></calcite-icon>
      </q-btn><br/>
      <q-btn square padding="xs" size="md" flat :class="mapStore.activeTool == 'basemaps'? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'" @click.stop="openPanel('basemaps')">
        <q-tooltip>Basemaps</q-tooltip>
        <calcite-icon icon="basemap" scale="m"></calcite-icon>
      </q-btn><br/>
      <q-btn square padding="xs" size="md" flat :class="mapStore.activeTool == 'supporting layers'? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'" @click.stop="openPanel('supporting layers')">
        <q-tooltip>Supporting Layers</q-tooltip>
        <calcite-icon icon="layers" scale="m"></calcite-icon>
      </q-btn><br/>

      <q-btn square padding="xs" flat size="md" :class="mapStore.activeTool == 'help'? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'" @click.stop="openPanel('help')">
        <q-tooltip>Help</q-tooltip>
        <calcite-icon icon="question" scale="m"></calcite-icon>
      </q-btn>
      </div>
     
    </div>
    </div>
    <div class="col-1" :style="mapStore.panelState=='open'?'width: 15%':'width: 0'">
      <q-scroll-area style="height: calc(100vh - 70px);">
        
        <div class="sub q-pa-sm q-ml-sm"><p class="text-caption q-mb-none text-weight-medium">{{mapStore.activeTool.toUpperCase()}}</p></div>
      
        <div v-show="mapStore.activeTool == 'legend'" id="legend">
          <q-scroll-area style="height: calc(100vh - 90px);">
          <!--arcgis-legend reference-element="my-map"></arcgis-legend-->
          <TheLegend></TheLegend>
          </q-scroll-area>
        </div>
        <div v-show="mapStore.activeTool == 'basemaps'" id="basemaps" class="basemaps">
          <q-scroll-area style="height: calc(100vh - 90px);">
          <arcgis-basemap-gallery reference-element="my-map"></arcgis-basemap-gallery>
        </q-scroll-area>
        </div>
        <div v-if="mapStore.activeTool == 'opacity'" class="text-center">
         <q-knob
          show-value
          font-size="20px"
          class="text-secondary q-mt-md"
          v-model="mapStore.opacity"
          size=   "80px"
          :thickness="0.3"
          color="secondary"
          track-color="grey-3"
          @update:model-value="mapStore.changeOpacity()"
      >
        <q-icon name="opacity" class="">
          <q-tooltip>opacity: {{ mapStore.opacity }}%</q-tooltip>
        </q-icon>
      
          
         </q-knob><p class="text-h6 q-mt-md">
         {{ mapStore.opacity }}%</p>
          
        </div>

         <div v-if="mapStore.activeTool == 'help'">
          <TheHelp></TheHelp>
         </div>

      </q-scroll-area>
    </div>
  </div>
</template>
