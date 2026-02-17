<template>
  <div class="image-wrapper" ref="wrapper" :class="{ 'fullscreen': isFullscreen }">
    <img-comparison-slider ref="slider" class="compare-slider">
      <img slot="first" :src="beforeImage" alt="Original (upscaled)" :class="['slider-image', fitClass]">
      <img slot="second" :src="afterImage" alt="AI Upscaled" :class="['slider-image', fitClass]">
    </img-comparison-slider>
    
    <div class="slider-controls">
      <div v-if="promptVisible" class="slider-prompt">
        <i class="fas fa-arrows-left-right"></i>
        <span>Drag slider to compare</span>
      </div>
      
      <div class="button-group">
        <button 
          class="fit-toggle" 
          @click="toggleFit"
          :title="`Object-fit: ${fitMode}`"
        >
          <i class="fas fa-image"></i>
          <span>{{ fitMode }}</span>
        </button>
        
        <button 
          class="fullscreen-toggle" 
          @click="toggleFullscreen"
          :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
          <span>{{ isFullscreen ? 'Exit' : 'Fullscreen' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import 'img-comparison-slider'

const props = defineProps({
  beforeImage: String,
  afterImage: String,
  processing: Boolean,
  promptVisible: Boolean
})

const emit = defineEmits(['slider-ready'])
const slider = ref(null)
const wrapper = ref(null)
const isFullscreen = ref(false)
const fitMode = ref('scale-down') // Default

const fitOptions = ['contain', 'cover', 'native', 'scale-down']

const fitClass = computed(() => `object-${fitMode.value}`)

const toggleFit = () => {
  const currentIndex = fitOptions.indexOf(fitMode.value)
  const nextIndex = (currentIndex + 1) % fitOptions.length
  fitMode.value = fitOptions[nextIndex]
  
  // Force slider to update after fit change
  setTimeout(() => {
    if (slider.value) {
      slider.value.dispatchEvent(new Event('resize'))
    }
  }, 50)
}

const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    if (wrapper.value.requestFullscreen) {
      wrapper.value.requestFullscreen()
    } else if (wrapper.value.webkitRequestFullscreen) {
      wrapper.value.webkitRequestFullscreen()
    } else if (wrapper.value.msRequestFullscreen) {
      wrapper.value.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
  
  setTimeout(() => {
    if (slider.value) {
      slider.value.dispatchEvent(new Event('resize'))
    }
  }, 100)
}

watch([() => props.beforeImage, () => props.afterImage], () => {
  setTimeout(() => {
    if (slider.value) {
      slider.value.dispatchEvent(new Event('resize'))
    }
  }, 100)
})

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  
  setTimeout(() => {
    emit('slider-ready')
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.image-wrapper {
  width: 100%;
  max-height: 80vh;
  border-radius: 24px;
  overflow: hidden;
  background: #0a0a0f;
  position: relative;
  transition: all 0.3s ease;
}

.image-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
}

.compare-slider {
  width: 100%;
  height: 100%;
  --divider-width: 4px;
  --divider-color: #8b5cf6;
  --divider-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  --handle-color: #8b5cf6;
  --handle-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  --handle-size: 48px;
}

/* Ensure both images are treated identically */
.slider-image {
  width: 100%;
  height: 100%;
  background: #0a0a0f;
  display: block;
  transition: object-fit 0.2s ease;
}

.divider:after {
    cursor: pointer;
}

/* Object-fit classes */
.object-contain {
  object-fit: contain;
  object-position: center;
}

.object-cover {
  object-fit: cover;
  object-position: center;
}

.object-native {
  object-fit: none;
  object-position: center;
}

.object-scale-down {
  object-fit: scale-down;
  object-position: center;
}

/* Force the web component to maintain aspect ratio */
:deep(img-comparison-slider) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(img-comparison-slider > div) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-controls {
  position: absolute;
  bottom: 0.425em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 10px;
  pointer-events: none;
}

.slider-prompt {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 100px;
  color: white;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.slider-prompt i {
  color: #8b5cf6;
}

.button-group {
  display: flex;
  gap: 10px;
  pointer-events: auto;
}

.fit-toggler {
    min-width: 10em;
    justify-content: center;
}

.fit-toggle,
.fullscreen-toggle {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 100px;
  color: white;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8em;
}

.fit-toggle:hover,
.fullscreen-toggle:hover {
  background: rgba(139, 92, 246, 0.6);
  border-color: rgba(139, 92, 246, 0.5);
}

.fit-toggle i,
.fullscreen-toggle i {
  color: #8b5cf6;
  transition: color 0.2s ease;
}

.fit-toggle:hover i,
.fullscreen-toggle:hover i {
  color: white;
}

:deep(.compare-slider::part(divider)) {
  background: white;
}

:deep(handle-container::part(handle)) {
    cursor: pointer !important;

}

.handle, .divider, .handle-container {
    cursor: pointer !important;
}

:deep(.compare-slider::part(handle)) {
  background: white;
  border: 3px solid #8b5cf6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(.compare-slider::part(handle):hover) {
  transform: scale(1.1);
  background: #f0f0f0;
}

:deep(.compare-slider::part(handle)::after) {
  content: '↔️';
  font-size: 20px;
  color: #1a1a2e;
}

:deep(.compare-slider::part(labeled)) {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: white;
  pointer-events: none;
}
</style>