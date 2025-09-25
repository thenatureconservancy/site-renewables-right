<script setup>
import { useAgolStore } from '@/stores/arcGisOnline.js'
import { useAuthStore } from '@/stores/auth.js'
import { useSearchStore } from '@/stores/searchBar'
import SignInButton from './SignInButton.vue'
import SearchBar from './SearchBar.vue'
import PaginatedList from './PaginatedList.vue'
import { computed } from 'vue'

const agolStore = useAgolStore()
const authStore = useAuthStore()
const searchStore = useSearchStore()

// Computed function to format options
const selectedGroupContent = computed(() => agolStore.allGroupContent[agolStore.selectedGroup])
</script>
<template>
  <q-card rounded style="width: 600px" v-if="!authStore.userLoggedIn">
    <div>
      <q-card-section>
        <div class="text-h6">Search ArcGIS Online</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <search-bar :search-function="searchStore.searchPortal"></search-bar>
      </q-card-section>
      <q-card-section class="q-pt-none" v-if="searchStore.searchResults.results.length > 0">
        <paginated-list :items="searchStore.searchResults.results" :total="searchStore.searchResults.total" title="Search Results"></paginated-list>
      </q-card-section>
      <q-card-section class="q-pt-none">
         <paginated-list :items="agolStore.recommendedLayers" :total="agolStore.recommendedLayers.length" title="Suggested Layers"></paginated-list>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="agolStore.mapLayers.length > 0">
        <p class="text-body1 q-mb-sm text-weight-medium">Manage Layers</p>
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
                <q-btn
                  v-if="layer.description"
                  flat
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
                  ><q-tooltip
                    class="text-body2 bg-white text-blue-grey-9"
                    style="width: 175px; border: 1px solid #49aa43"
                    >remove layer from map</q-tooltip
                  >
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <p class="text-caption text-grey-7 q-pt-sm text-center">
          Log in to ArcGIS online to access private data and saved content
        </p>
        <sign-in-button></sign-in-button>
      </q-card-section>
    </div>
  </q-card>

  <q-card rounded style="width: 600px" v-if="authStore.userLoggedIn">
    <q-tabs
      v-model="agolStore.tab"
      style="background: #007ac2"
      class="text-white"
      active-class="active"
      indicator-color="#007ac2"
      @update:model-value="(()=>{
        searchStore.searchResults.results = [];
        searchStore.searchTerm = ''
      })"
      >
      <q-tab name="mycontent" label="My Content" class="custom-dot-tab" />
      <q-tab name="mygroups" label="My Groups" class="custom-dot-tab" />
      <q-tab name="myorganization" label="My Organization" class="custom-dot-tab" />
      <q-tab name="public" label="Living Atlas" class="custom-dot-tab" />
    </q-tabs>
    <q-tab-panels v-model="agolStore.tab" animated>
      <q-tab-panel name="mycontent">
        <q-card-section>
          <div class="text-h6">My Content</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <search-bar :search-function="authStore.SearchMyContent"></search-bar>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="searchStore.searchResults.results.length > 0">
          <paginated-list  title="Search Results" :items="searchStore.searchResults.results" :total="searchStore.searchResults.total"></paginated-list>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row items-center justify-start q-mb-sm">
            <div>
              <p class="text-body1 text-weight-medium q-mb-none">Feature and Image layers</p>
            </div>
          </div>

          <q-list bordered padding class="bg-white rounded">
            <q-item v-for="(layer, index) in agolStore.myContent" :key="index">
              <q-item-section>
                <q-item-label>{{ layer.title }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  <q-img :src="layer.iconUrl" style="width: 15px; height: 15px"
                    ><q-tooltip class="bg-white text-black">{{
                      layer.displayName
                    }}</q-tooltip></q-img
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
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="mygroups">
        <q-card-section>
          <div class="text-h6">My Groups</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <search-bar :search-function="authStore.SearchMyGroupsContent"></search-bar>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="searchStore.searchResults.results.length > 0">
          <paginated-list title='Search Results' :items="searchStore.searchResults.results" :total="searchStore.searchResults.total"></paginated-list>
        </q-card-section>
        <q-card-section>
          <div class="row items-center justify-start q-mb-sm">
            <div>
              <p class="text-body1 text-weight-medium q-mb-none">Select group to display feature and image layers</p>
            </div>
          </div>
          <q-select
            outlined
            dense
            options-dense
            :options="agolStore.groups"
            v-model="agolStore.selectedGroup"
          ></q-select>
          <q-list bordered padding class="bg-white rounded" v-if="selectedGroupContent.length > 0">
            <q-item v-for="(layer, index) in selectedGroupContent" :key="index">
              <q-item-section>
                <q-item-label>{{ layer.title }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  <q-img :src="layer.iconUrl" style="width: 15px; height: 15px"
                    ><q-tooltip class="bg-white text-black">{{
                      layer.displayName
                    }}</q-tooltip></q-img
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
          <q-list bordered class="bg-white rounded" v-if="selectedGroupContent.length == 0">
            <q-item class="q-pa-lg text-grey-7"> No feature or image layers to display </q-item>
          </q-list>
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="myorganization">
        <q-card-section>
          <div class="text-h6">My Organization</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <search-bar :search-function="authStore.SearchMyOrgsContent"></search-bar>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="searchStore.searchResults.results.length > 0">
          <paginated-list  title="Search Results" :items="searchStore.searchResults.results" :total="searchStore.searchResults.total"></paginated-list>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row items-center justify-start q-mb-sm">
            <div>
              <p class="text-body1 text-weight-medium q-mb-none">Feature and Image layers</p>
            </div>
          </div>

          <q-list bordered padding class="bg-white rounded">
            <q-item v-for="(layer, index) in agolStore.orgContent" :key="index">
              <q-item-section>
                <q-item-label>{{ layer.title }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  <q-img :src="layer.iconUrl" style="width: 15px; height: 15px"
                    ><q-tooltip class="bg-white text-black">{{
                      layer.displayName
                    }}</q-tooltip></q-img
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
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="public">
        <q-card-section>
          <div class="text-h6">Search ArcGIS Online</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <search-bar :search-function="searchStore.searchPortal"></search-bar>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="searchStore.searchResults.results.length > 0">
          <paginated-list :items="searchStore.searchResults.results" :total="searchStore.searchResults.total"></paginated-list>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="text-body1 text-weight-medium q-mb-sm">
            Suggested Layers
            <span class="text-caption text-grey-7">Click + to add to map</span>
          </p>
          <q-list bordered padding class="bg-white rounded">
            <q-item v-for="layer in agolStore.recommendedLayers" :key="layer.title" class="q-mb-sm">
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
                  v-if="layer.snippet"
                  outline
                  size="sm"
                  color="primary"
                  round
                  icon="description"
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
        </q-card-section>
      </q-tab-panel>
    </q-tab-panels>
    <div class="q-ma-sm">
      <q-card-section class="q-pt-none" v-if="agolStore.mapLayers.length > 0">
        <p class="text-body1 text-weight-medium">
          <span><q-icon name="settings" class="q-mr-sm"></q-icon></span>Manage Layers
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
                <q-btn
                  v-if="layer.snippet"
                  flat
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
                <q-btn flat round icon="opacity" color="primary" @click="" size="sm" class="">
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
                  ><q-tooltip
                    class="text-body2 bg-white text-blue-grey-9"
                    style="width: 175px; border: 1px solid #49aa43"
                    >remove layer from map</q-tooltip
                  ></q-btn
                >
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <sign-in-button></sign-in-button>
      </q-card-section>
    </div>
  </q-card>
</template>
<style>
.active {
  background-color: #005f8c !important;
}
.custom-dot-tab .q-tab__indicator {
  position: absolute !important;
  bottom: 4px !important; /* Adjust as needed */
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 6px !important;
  height: 6px !important;
  background-color: white !important;
  border-radius: 50% !important;
}
</style>
