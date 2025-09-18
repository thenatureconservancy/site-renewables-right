<script setup>
import { ref, reactive } from 'vue'

import { useAgolStore } from '@/stores/arcGisOnline.js'

const agolStore = useAgolStore()
</script>
<template>
  <q-card rounded style="width: 600px">
    <q-card-section>
      <div class="text-h6">Search ArcGIS Online</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        filled
        label="Search"
        color="blue-grey-9"
        debounce="500"
        v-model="agolStore.searchTerm"
        @update:model-value="agolStore.searchPortal()"
        ><template v-slot:prepend> <q-icon name="search" /> </template
      ></q-input>
    </q-card-section>
    <q-card-section class="q-pt-none" v-if="agolStore.searchResults.length > 0">
      <div class="row items-center justify-center q-mb-sm">
        <div>
          <p class="text-body1 text-weight-medium q-mb-none">
            Search Results
          </p>
        </div>
        <q-space></q-space>
        <q-btn
          flat
          no-caps
          padding="none"
          label="clear search results"
          color="blue"
          @click="agolStore.searchResults = []"
        />
      </div>
      <q-list bordered padding class="bg-white rounded">
        <q-item v-for="layer in agolStore.searchResults" :key="layer.title">
          <q-item-section>
            <q-item-label>{{ layer.title }}</q-item-label>
            <q-item-label caption class="text-weight-medium">
              {{ layer.org }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="layer.description"
              outline
              size="sm"
              color="primary"
              round
              icon="description"
              @click="showTooltip = true"
              ><q-tooltip
                v-html="layer.description"
                class="text-body2 bg-white text-blue-grey-9"
                style="width: 300px; border: 1px solid #49aa43"
              >
              </q-tooltip>
              <q-menu
                ><div
                  v-html="layer.longDescription"
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
                   const mapLayer = agolStore.mapLayers.find(newlayer => {
                    return newlayer.id === layer.id; 
                })
                if (!mapLayer) {
                    agolStore.mapLayers.push(layer)
                    agolStore.addLayerToMap(layer)
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
    </q-card-section>
    <q-card-section class="q-pt-none">
      <p class="text-body1 text-weight-medium q-mb-sm">
        Suggested Layers
        <span class="text-caption text-grey-7">Click + to add to map</span>
      </p>
      <q-list bordered padding class="bg-white rounded">
        <q-item v-for="layer in agolStore.recommendedLayers" :key="layer.title">
          <q-item-section avatar>
            <q-icon :name="layer.icon" color="grey-5" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ layer.title }}</q-item-label>
            <q-item-label caption class="text-grey-7">
              {{ layer.author }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              v-if="layer.description"
              outline
              size="sm"
              color="primary"
              round
              icon="description"
              ><q-tooltip
                v-html="layer.description"
                class="text-body2 bg-white text-blue-grey-9"
                style="width: 300px; border: 1px solid #49aa43"
              >
              </q-tooltip>
              <q-menu
                ><div
                  v-html="layer.longDescription"
                  class="text-body2 bg-white text-blue-grey-9 q-ma-md"
                  style="width: 300px"
                ></div></q-menu
            ></q-btn>
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
                   const mapLayer = agolStore.mapLayers.find(newlayer => {
                    return newlayer.id === layer.id; 
                })
                if (!mapLayer) {
                    agolStore.mapLayers.push(layer)
                    agolStore.addLayerToMap(layer)
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
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="agolStore.mapLayers.length > 0">
      <p class="text-body1 q-mb-sm text-weight-medium">
         Manage Layers
      </p>
      <q-list bordered padding class="bg-white rounded">
        <q-item v-for="(layer, index) in agolStore.mapLayers" :key="layer.title">
          <q-item-section avatar>
            <q-checkbox
              v-model="layer.visible"
              @update:model-value="agolStore.toggleVisibility(layer)"
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
            <div class="row">
              <q-btn flat round icon="description" color="primary" @click="" size="sm" />
              <q-btn flat round icon="opacity" color="primary" @click="" size="sm">
                <q-menu>
                  <div class="q-pa-lg q-pt-xl" style="width: 200px">
                    <q-slider
                      v-model="layer.opacity"
                      label-always
                      color="primary"
                      :min="0"
                      :max="1"
                      :step="0.1"
                      @update:model-value="agolStore.changeLayerOpacity(layer)"
                    >
                    </q-slider>
                    <div class="text-blue-grey-9">Opacity: {{ layer.opacity * 100 }}%</div>
                  </div>
                </q-menu>
              </q-btn>

              <q-btn
                bordered
                round
                flat
                icon="delete"
                color="negative"
                @click="agolStore.removeLayer(layer, index)"
                size="sm"
              />
            </div>
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
