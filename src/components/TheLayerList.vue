<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
let mapStore = useMapStore()

// takes an element object
async function scrollToElement(elid) {
  // open the left panel and switch to the help tab
  mapStore.panelState = 'open'
  mapStore.activeTool = 'help'
  mapStore.activeHelpElement = elid
  // AI did this part! fixed the bug where it wasn't waiting for the DOM
  // to update.  wondering if there is a shorter bit of code for this.
  // leaving it for now.  works beautifully!

  // wait for Vue to apply DOM updates for the panel/tab change
  await nextTick()

  // helper: poll for the element until it exists (short timeout)
  const waitForElement = (id, timeout = 1500) => {
    const start = performance.now()
    return new Promise((resolve) => {
      const check = () => {
        const found = document.getElementById(id)
        if (found) return resolve(found)
        if (performance.now() - start > timeout) return resolve(null)
        requestAnimationFrame(check)
      }
      check()
    })
  }

  const el = await waitForElement(elid, 1500)
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
    // try to focus for accessibility (if focusable)
    try {
      el.focus && el.focus()
    } catch {
      /* ignore focus errors */
    }
  } else {
    // fallback: element not found after waiting
    console.warn('scrollToElement: could not find element', elid)
  }
}
</script>

<template>
  <div class="bg-grey-1" v-for="(item, index) in mapStore.layers" :key="index">
    <q-expansion-item
      @update:model-value="mapStore.setGroupVisibility(item)"
      :label="item.header"
      v-model="item.expanded"
      :header-class="
        item.expanded
          ? 'expandedHeaderClass text-h6 text-weight-light'
          : 'headerClass text-h6 text-weight-light'
      "
      expanded-icon="visibility"
      :expand-icon-class="item.expanded ? 'text-primary' : 'text-grey-9'"
      expand-icon="visibility_off"
    >
      <div class="q-mx-sm q-mb-md">
        <q-expansion-item
          label=""
          caption=""
          v-for="(layer, index) in item.subheaders"
          :key="index"
          header-class=""
          expand="true"
          v-model = layer.expanded
          dense
        >
          <template v-slot:header>
            <div class="self-center">
              <q-checkbox
                size="xs"
                v-model="layer.visible"
                @update:model-value="mapStore.setLayerVisibility(layer)"
              >
              </q-checkbox>
            </div>
            <q-item-section>
              <q-item-label class="text-subtitle1">{{ layer.title }} </q-item-label>
            </q-item-section>
          </template>
          <q-list dense class="q-mx-md q-pb-md" v-if="layer.title !== 'Community Considerations'">
            <draggable
              v-model="layer.sublayers"
              ghostClass="ghost"
              @end="mapStore.updateLayerOrder(layer)"
              item-key="index"
            >
              <template #item="{ element: sublayer }">
                <q-item dense class="" style="" v-if="sublayer.filter">
                  <q-item-section side>
                    <q-icon size="xs" name="drag_indicator"> </q-icon
                  ></q-item-section>
                  <q-item-section>
                    <q-checkbox
                      size="xs"
                      v-model="sublayer.visibleModel"
                      @click.stop="
                        mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                      "
                      >{{ sublayer.title }}<br />
                      <q-slider
                        style="width: 100px"
                        v-if="sublayer.elid == 'nativeLands'"
                        v-model="sublayer.opacity"
                        :min="0.1"
                        :max="1"
                        :step="0.1"
                        @update:model-value="mapStore.changeNativeOpacity(sublayer.opacity)"
                      />
                    </q-checkbox>
                  </q-item-section>
                  <q-item-section side>
                    <div style="width: 20px; height: 20px">
                      <img :src="'data:image/gif;base64,' + sublayer.legendImg" />
                    </div>
                  </q-item-section>
                  <q-item-section side class="">
                    <q-btn
                      size="sm"
                      flat
                      padding="none"
                      icon="o_info"
                      @click="scrollToElement(sublayer.elid)"
                      ><q-tooltip> more info </q-tooltip></q-btn
                    >
                  </q-item-section>
                </q-item>
              </template>
            </draggable>
          </q-list>
          <!-- Community Considerations (no draggable, single-select via radio) -->
          <q-list dense class="q-mx-md q-pb-md" v-if="layer.title === 'Community Considerations'">
            <q-item
              v-for="sublayer in layer.sublayers"
              :key="sublayer.index"
              dense
              clickable
              v-ripple
              @click="
                mapStore.communitySelection = sublayer.title;
                mapStore.changeCommunityStyle(sublayer.style)
              "
            >
              <!-- Radio column (no drag icon) -->
              <q-item-section side>
                <q-radio
                  v-if="sublayer.type == 'radio'"
                  size="sm"
                  v-model="mapStore.communitySelection"
                  :val="sublayer.title"
                  @update:model-value="mapStore.changeCommunityStyle(sublayer.style)"
                />
              
              </q-item-section>

              <!-- Title + optional per-item controls -->
              <q-item-section>
                <div class="text-body2">{{ sublayer.title }}</div>

                <!-- Example: optional slider just for a specific id (kept from your pattern) -->
                <q-slider
                  v-if="sublayer.elid === 'nativeLands'"
                  style="max-width: 140px"
                  v-model="sublayer.opacity"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                  @update:model-value="mapStore.changeNativeOpacity(sublayer.opacity)"
                />
              </q-item-section>

              <!-- Legend image -->
              <q-item-section side>
                <div style="width: 20px; height: 20px">
                  <img :src="'data:image/gif;base64,' + sublayer.legendImg" />
                </div>
              </q-item-section>

              <!-- Info button -->
              <q-item-section side>
                <q-btn
                  size="sm"
                  flat
                  padding="none"
                  icon="o_info"
                  @click.stop="scrollToElement(sublayer.elid)"
                >
                  <q-tooltip> more info </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </q-expansion-item>
  </div>
</template>
