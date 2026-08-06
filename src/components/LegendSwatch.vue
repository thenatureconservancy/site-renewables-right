<script setup>
// Reusable legend renderer — one component for ALL legend types.
// Usage:
//   <LegendSwatch :layer="layer" />                             ← full, resolves automatically
//   <LegendSwatch :layer="layer" :show-labels="false" />        ← swatch only
//   <LegendSwatch :layer="layer" compact />                     ← compact: diagonal cascade
//                                                                  (discrete) / gradient chip (ramp)
//   <LegendSwatch :legend="{ type:'swatch', color:'#f00' }" />  ← pass a spec directly
//
// Consumed by: layers list, site report panel, (and mirrored in the PDF builder).

import { computed } from 'vue'
import { resolveLegend } from '@/utils/legends'

const props = defineProps({
  layer:  { type: Object, default: null },   // pass a layer → auto-resolve
  legend: { type: Object, default: null },   // OR pass a normalized spec directly
  size:   { type: Number, default: 14 },     // swatch square size (px)
  showLabels: { type: Boolean, default: true },
  compact: { type: Boolean, default: false }, // diagonal cascade / gradient chip
})

const spec = computed(() => props.legend || resolveLegend(props.layer))

// --- compact cascade sizing (diagonal overlapping squares) ---
const CHIP = 11     // each little square in a cascade
const OFFSET = 4    // diagonal step between squares

const cascadeSize = computed(() => {
  const n = spec.value?.items?.length || 1
  const dim = CHIP + (n - 1) * OFFSET
  return { width: dim + 'px', height: dim + 'px' }
})

function symbolStyle(s) {
  if (s.shape === 'triangle') {
    return {
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: `11px solid ${s.color}`,
    }
  }
  // diamond = rotated square
  return { background: s.color }
}
</script>

<template>
  <div class="legend" v-if="spec">
    <!-- ===================== COMPACT MODE ===================== -->

    <!-- COMPACT DISCRETE: diagonal overlapping cascade -->
    <div
      v-if="compact && spec.type === 'discrete'"
      class="legend-cascade"
      :style="cascadeSize"
    >
      <span
        v-for="(item, i) in spec.items"
        :key="i"
        class="cascade-swatch"
        :style="{
          background: item.color,
          width: CHIP + 'px',
          height: CHIP + 'px',
          left: i * OFFSET + 'px',
          top: i * OFFSET + 'px',
          zIndex: spec.items.length - i,
        }"
      ></span>
    </div>

    <!-- COMPACT RAMP: tiny gradient chip -->
    <div
      v-else-if="compact && spec.type === 'ramp'"
      class="ramp-chip"
      :style="{ width: size + 'px', height: size + 'px', background: spec.gradient }"
    ></div>

    <!-- ===================== FULL MODE ===================== -->

    <!-- SINGLE SWATCH -->
    <div v-else-if="spec.type === 'swatch'" class="legend-row">
      <span
        class="swatch"
        :style="{ width: size + 'px', height: size + 'px', background: spec.color }"
      ></span>
    </div>

    <!-- DISCRETE (multiple squares, labeled) -->
    <div v-else-if="spec.type === 'discrete'" class="legend-discrete">
      <div v-for="(item, i) in spec.items" :key="i" class="legend-row">
        <span
          class="swatch"
          :style="{ width: size + 'px', height: size + 'px', background: item.color }"
        ></span>
        <span v-if="showLabels" class="legend-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- RAMP (gradient bar with low/high labels) -->
    <div v-else-if="spec.type === 'ramp'" class="legend-ramp">
      <div class="ramp-bar" :style="{ background: spec.gradient }"></div>
      <div v-if="showLabels" class="ramp-labels">
        <span>{{ spec.lowLabel }}</span>
        <span>{{ spec.highLabel }}</span>
      </div>
    </div>

    <!-- SYMBOL (point marker) -->
    <div v-else-if="spec.type === 'symbol'" class="legend-row">
      <span class="symbol" :class="`symbol-${spec.shape}`" :style="symbolStyle(spec)"></span>
      <span v-if="showLabels && spec.label" class="legend-label">{{ spec.label }}</span>
    </div>

    <!-- HATCH (diagonal pattern square) -->
    <div v-else-if="spec.type === 'hatch'" class="legend-row">
      <span
        class="swatch hatch"
        :style="{ width: size + 'px', height: size + 'px', '--hatch-color': spec.color }"
      ></span>
    </div>

    <!-- IMAGE fallback (legacy base64 / png) -->
    <div v-else-if="spec.type === 'image'" class="legend-row">
      <img :src="spec.src" :style="{ width: spec.width ? spec.width + 'px' : 'auto' }" alt="legend" />
    </div>
  </div>
</template>

<style scoped>
.legend {
  display: inline-block;
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0;
}
.swatch {
  display: inline-block;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}
.legend-label {
  font-size: 11px;
  color: #444;
  line-height: 1.2;
}
.legend-discrete {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* Compact diagonal cascade */
.legend-cascade {
  position: relative;
  flex-shrink: 0;
}
.cascade-swatch {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.9); /* white edge separates overlaps */
  border-radius: 2px;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15); /* faint outer contrast line */
}

/* Compact gradient chip */
.ramp-chip {
  display: inline-block;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

/* Full ramp */
.legend-ramp {
  min-width: 120px;
}
.ramp-bar {
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.ramp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

/* Symbol markers */
.symbol {
  display: inline-block;
  flex-shrink: 0;
}
.symbol-triangle {
  width: 0;
  height: 0;
}
.symbol-diamond {
  width: 11px;
  height: 11px;
  transform: rotate(45deg);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

/* Diagonal hatch */
.hatch {
  background-image: repeating-linear-gradient(
    45deg,
    var(--hatch-color) 0,
    var(--hatch-color) 2px,
    transparent 2px,
    transparent 4px
  );
  border: 1px solid var(--hatch-color);
}
</style>
