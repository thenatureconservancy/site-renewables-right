<script setup>
import { ref, reactive } from 'vue'
import Portal from "@arcgis/core/portal/Portal.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
const searchResults = ref([])
const searchTerm = ref('')

const recommendedLayers = [
  {
    title: 'Benefits of Completed Renewable Energy Projects',
    author: 'EPA',
    icon: 'solar_power',
  },
  {
    title: 'State Renewable Portfolio Standards',
    author: 'NRDC',
    icon: 'gavel',
  },
  {
    title: 'Renewable Energy Potential in the United States',
    author: 'Esri',
    icon: 'trending_up',
  },
  {
    title: 'Energy Infrastructure of North America',
    author: 'NACEI',
    icon: 'map',
  },
]
const mapLayers = reactive([])

function showLayerInfo(layer) {
  console.log('Layer info:', layer)
  // You can expand this to show a dialog or navigate to a detail page
}
function searchPortal(){
    const portal = new Portal();
    portal.load().then(() => {
        const queryParams = new PortalQueryParams({
        query: searchTerm.value + ' AND type:"Feature Service" AND access:public AND contentstatus:public_authoritative',
        sortField: "title",
        sortOrder: "asc",
        num: 10
        });
        portal.queryItems(queryParams).then((results) => {
           
        searchResults.value = results.results.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
        })
    )});
    });
}
       

</script>
<template>
    <q-card  rounded>
        <q-card-section>
            <div class="text-h6">Search ArcGIS Online</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <q-input filled label="Search" color="blue-grey-9" v-model="searchTerm" @update:model-value="searchPortal()"
            ><template v-slot:prepend>
                <q-icon name="search" /> </template
            ></q-input>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="searchResults.length > 0">
            <div class="row items-center justify-center q-mb-sm">
                <div><p class="text-body1 text-weight-medium q-mb-none"><q-icon name="search" 
                class="" color="blue-grey-9"></q-icon>&nbsp;Search Results</p></div>
                <q-space></q-space>
                <q-btn flat no-caps padding="none" label="clear search results" color="blue" @click="searchResults=[]"/>
            </div>
            <q-list bordered padding class="bg-white rounded">
                <q-item v-for="layer in searchResults" :key="layer.title">
                   
                    <q-item-section>
                    <q-item-label>{{ layer.title }}</q-item-label>
                    <q-item-label caption class="text-grey-7">
                        {{ layer.author }}
                    </q-item-label >
                        
                    </q-item-section>
                    <q-item-section side>
                        <q-btn outline size="sm" color="primary" round icon="add" @click="mapLayers.push(layer)" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <p class="text-body1 text-weight-medium q-mb-sm"><q-icon color="blue-grey-9" 
                name="star" class="q-mb-xs"></q-icon>&nbsp;Suggested Layers 
                <span class="text-caption text-grey-7">Click + to add to map</span></p>
            <q-list bordered padding class="bg-white rounded">
                <q-item v-for="layer in recommendedLayers" :key="layer.title" >
                    <q-item-section avatar>
                    <q-icon :name="layer.icon" color="primary" />
                    </q-item-section>

                    <q-item-section>
                    <q-item-label>{{ layer.title }}</q-item-label>
                    <q-item-label caption class="text-grey-7">
                        {{ layer.author }}
                    </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                    <q-btn outline size="sm" color="primary" round icon="add" @click="mapLayers.push(layer)" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="mapLayers.length > 0">
            <p class="text-body1 q-mb-sm text-weight-medium"><q-icon name="settings" color="blue-grey-9" class="q-mb-xs"></q-icon> Manage Layers</p>
            <q-list bordered padding class="bg-white rounded">
                <q-item v-for="layer in mapLayers" :key="layer.title">
                    <q-item-section avatar>
                    <q-checkbox
                        v-model="layer.visible"
                        @update:model-value="toggleLayerVisibility(layer)"
                        color="primary"
                        size="xs"
                    />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{ layer.title }}</q-item-label>
                        <q-item-label caption class="text-grey-7">
                            {{ layer.author }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section class="q-pt-none" side>
                        <q-btn
                        flat
                        round
                        icon="delete"
                        color="negative"
                        @click="removeLayer(layer.id)"
                        size="sm"
                    />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <p class="text-caption text-grey-7 q-pt-sm text-center">
            Log in to ArcGIS online to access private data and saved content
            </p>
            <q-btn
            :ripple="false"
            icon="img:globe.png"
            no-caps=""
            label="Log in to ArcGIS Online"
            style="width: 100%; background: #0079c1; color: white"
            unelevated=""
            >
            </q-btn>
        </q-card-section>
        <q-card-actions align="right"> </q-card-actions>
    </q-card>
</template>