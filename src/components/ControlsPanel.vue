<template>
  <div class="controls-panel border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm overflow-hidden">
    <button 
      @click="toggleExpanded" 
      class="w-full px-5 py-4 flex items-center justify-between text-gray-300 hover:text-white transition-colors group"
      :class="{ 'border-b border-white/10': expanded }"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="font-medium text-sm uppercase tracking-wider text-gray-400">Processing Options</span>
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
      enter-to-class="opacity-100 max-h-48"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-48"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="expanded" class="px-5 py-4 space-y-4">
        <div>
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium text-gray-300">
              Max Dimension
            </label>
            <span class="text-sm bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white font-medium">
              {{ maxDimension }}px
            </span>
          </div>
          
          <div class="relative pt-2 pb-6">
            <input 
              type="range" 
              v-model.number="maxDimension"
              min="128"
              max="2048"
              step="64"
              class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-transparent"
              :style="rangeStyle"
            />
            
            <div class="flex justify-between text-xs text-gray-500 mt-3 px-1">
              <span class="flex flex-col items-center">
                <span class="w-1 h-1 bg-gray-600 rounded-full mb-1"></span>
                <span>128</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="w-1 h-1 bg-gray-600 rounded-full mb-1"></span>
                <span>512</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="w-1 h-1 bg-gray-600 rounded-full mb-1"></span>
                <span>1024</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="w-1 h-1 bg-gray-600 rounded-full mb-1"></span>
                <span>1536</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="w-1 h-1 bg-gray-600 rounded-full mb-1"></span>
                <span>2048</span>
              </span>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Images larger than this will be resized before processing (step size 64px for optimal tiling)</span>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1024
  }
})

const emit = defineEmits(['update:modelValue'])

const expanded = ref(false)
const maxDimension = ref(props.modelValue)

const rangeStyle = computed(() => {
  const min = 128
  const max = 2048
  const percent = ((maxDimension.value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`
  }
})

watch(maxDimension, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  maxDimension.value = newValue
})

const toggleExpanded = () => {
  expanded.value = !expanded.value
}
</script>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
}

input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.6);
}

input[type=range]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
  transition: all 0.2s;
}

input[type=range]::-moz-range-thumb:hover {
  transform: scale(1.15);
  border-color: white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.6);
}
</style>