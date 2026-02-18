<template>
  <div class="controls-panel border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm overflow-hidden">
    <button 
      @click="toggleExpanded" 
      class="w-full px-5 py-4 flex cursor-pointer items-center justify-between text-gray-300 hover:text-white transition-colors group"
      :class="{ 'border-b border-white/10': expanded }"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="font-medium text-xs md:text-sm uppercase tracking-wider text-gray-400">Processing Options</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs bg-white/5 px-2 py-1 rounded-full text-purple-300 border border-white/5">
          {{ maxDimension }}px max
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 transition-transform duration-300 text-gray-500 group-hover:text-gray-300" 
          :class="{ 'rotate-180': expanded }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="expanded" class="px-5 py-4 space-y-6">
        <div>
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium text-gray-300">
              Max Dimension
            </label>
            <span class="text-sm bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white font-medium">
              {{ maxDimension}}px
            </span>
          </div>
          
          <div class="relative pt-2 pb-6">
            <div class="slider-container">
              <input 
                type="range" 
                :value="maxDimension"
                min="512"
                max="4096"
                step="128"
                class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-transparent slider"
                :style="maxDimensionRangeStyle"
                @input="onMaxDimensionInput"
                @change="onMaxDimensionChange"
              />
              <div class="slider-marks">
                <div class="slider-mark" :style="{ left: '0%' }"><span>512</span></div>
                <div class="slider-mark" :style="{ left: '14.3%' }"><span>1024</span></div>
                <div class="slider-mark" :style="{ left: '42.9%' }"><span>2048</span></div>
                <div class="slider-mark" :style="{ left: '71.5%' }"><span>3072</span></div>
                <div class="slider-mark" :style="{ left: '100%' }"><span>4096</span></div>
              </div>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Images will be scaled up 4x at most.</span>
          </p>
        </div>

        <div class="border-t border-white/10 pt-4">
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium text-gray-300">
              Tile Size
            </label>
            <span class="text-sm bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white font-medium">
              {{ tileSize }}px
            </span>
          </div>
          
          <div class="relative pt-2 pb-6">
            <div class="slider-container">
              <input 
                type="range" 
                :value="tileSize"
                min="64"
                max="384"
                step="1"
                class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-transparent slider"
                :style="tileSizeRangeStyle"
                @input="onTileSizeInput"
                @change="onTileSizeChange"
              />
              <div class="slider-marks">
                <div class="slider-mark" :style="{ left: '0%' }"><span>64</span></div>
                <div class="slider-mark" :style="{ left: '20%' }"><span>128</span></div>
                <div class="slider-mark" :style="{ left: '40%' }"><span>192</span></div>
                <div class="slider-mark" :style="{ left: '60%' }"><span>256</span></div>
                <div class="slider-mark" :style="{ left: '80%' }"><span>320</span></div>
                <div class="slider-mark" :style="{ left: '100%' }"><span>384</span></div>
              </div>
            </div>
          </div>

          <div class="mt-2 min-h-[2.5em]">
            <transition mode="out-in" enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <div v-if="tileSize > 192" key="warning" class="flex items-start gap-2 text-xs text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-yellow-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span>Larger tiles may cause GPU out-of-memory errors on less powerful hardware. Reduce if processing fails.</span>
              </div>
              <div v-else key="info" class="flex items-start gap-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Larger tiles = Finer processing but more memory.</span>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1024
  },
  tileValue: {
    type: Number,
    default: 192
  }
})

const emit = defineEmits(['update:modelValue', 'update:tileValue'])

const expanded = ref(false)
const maxDimension = ref(512)
const tileSize = ref(192)

const roundToNearest = (value, multiple) => {
  return Math.round(value / multiple) * multiple
}

const loadFromStorage = () => {
  const savedMax = localStorage.getItem('distillsr_max_dimension')
  const savedTile = localStorage.getItem('distillsr_tile_size')
  
  maxDimension.value = savedMax ? parseInt(savedMax, 10) : props.modelValue
  tileSize.value = savedTile ? parseInt(savedTile, 10) : props.tileValue
  
  emit('update:modelValue', maxDimension.value)
  emit('update:tileValue', tileSize.value)
}

const maxDimensionRangeStyle = computed(() => {
  const min = 512
  const max = 4096
  const percent = ((maxDimension.value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`
  }
})

const tileSizeRangeStyle = computed(() => {
  const min = 64
  const max = 384
  const percent = ((tileSize.value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`
  }
})

const onMaxDimensionInput = (e) => {
  const raw = parseInt(e.target.value, 10)
  maxDimension.value = raw
}

const onMaxDimensionChange = (e) => {
  const raw = parseInt(e.target.value, 10)
  const rounded = roundToNearest(raw, 128)
  const clamped = Math.min(4096, Math.max(512, rounded))
  maxDimension.value = clamped
  localStorage.setItem('distillsr_max_dimension', clamped)
  emit('update:modelValue', clamped)
}

const onTileSizeInput = (e) => {
  const raw = parseInt(e.target.value, 10)
  tileSize.value = raw
}

const onTileSizeChange = (e) => {
  const raw = parseInt(e.target.value, 10)
  const rounded = roundToNearest(raw, 16)
  const clamped = Math.min(384, Math.max(64, rounded))
  tileSize.value = clamped
  localStorage.setItem('distillsr_tile_size', clamped)
  emit('update:tileValue', clamped)
}

watch(maxDimension, (newValue) => {
  if (newValue !== roundToNearest(newValue, 128)) {
    const rounded = roundToNearest(newValue, 128)
    maxDimension.value = rounded
  }
})

watch(tileSize, (newValue) => {
  if (newValue !== roundToNearest(newValue, 16)) {
    const rounded = roundToNearest(newValue, 16)
    tileSize.value = rounded
  }
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== maxDimension.value) {
    maxDimension.value = newValue
  }
})

watch(() => props.tileValue, (newValue) => {
  if (newValue !== tileSize.value) {
    tileSize.value = newValue
  }
})

onMounted(() => {
  loadFromStorage()
})

const toggleExpanded = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 2em;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.5em;
  z-index: 2;
}

.slider-marks {

    z-index: 1;
    width: calc(100% - 1.125em);
    padding-right: 1em;
    /* justify-self: anchor-center; */
    height: 1.5em;
    position: absolute;
    top: 1em;
    left: 0.525em;
}

.slider-mark {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
}

.slider-mark::before {
  content: '';
  width: 0.125em;
  height: 0.5em;
  background: #4b5563;
  border-radius: 0.0625em;
}

.slider-mark span {
  font-size: 0.7rem;
  color: #9ca3af;
  white-space: nowrap;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.125em;
  height: 1.125em;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  cursor: pointer;
  border: 0.125em solid rgba(255,255,255,0.5);
  box-shadow: 0 0.125em 0.5em rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
  z-index: 3;
  position: relative;
  margin-top: -0.225em;;
}

input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 0.25em 0.75em rgba(168, 85, 247, 0.6);
}

input[type=range]::-moz-range-thumb {
  width: 1.125em;
  height: 1.125em;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  cursor: pointer;
  border: 0.125em solid rgba(255,255,255,0.5);
  box-shadow: 0 0.125em 0.5em rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
  z-index: 3;
  position: relative;
}

input[type=range]::-moz-range-thumb:hover {
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 0.25em 0.75em rgba(168, 85, 247, 0.6);
}

input[type=range] {
  -webkit-appearance: none;
  background: transparent;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.5em;
  background: transparent;
  border-radius: 0.25em;
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 0.5em;
  background: transparent;
  border-radius: 0.25em;
}
</style>