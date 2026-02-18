<template>
  <div class="image-wrapper" ref="wrapper" :class="{ 'fullscreen': isFullscreen }">
    <img-comparison-slider ref="slider" class="compare-slider">
      <img slot="first" :src="displayBeforeImage" alt="Original (upscaled)" :class="['slider-image', fitClass]">
      <img slot="second" :src="displayAfterImage" alt="AI Upscaled" :class="['slider-image', fitClass]">
    </img-comparison-slider>
    
    <div class="slider-controls">
      <div class="button-group">
        <button 
          class="view-toggle" 
          @click="toggleView"
          :title="`Scale: ${viewMode === 'input' ? 'Input image upscaled (4x)' : 'Output image downscaled (1x)'}`"
        >
          <i class="fas fa-arrows-alt"></i>
          <span class="view-text">{{ viewMode === 'input' ? '4x' : '1x' }}</span>
        </button>
        
        <button 
          class="fit-toggle" 
          @click="toggleFit"
          :title="`Object-fit: ${fitMode}`"
        >
          <i class="fas fa-image"></i>
          <span class="fit-text">{{ fitMode }}</span>
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
  promptVisible: Boolean,
  inputWidth: { type: Number, default: 0 },
  inputHeight: { type: Number, default: 0 },
  outputWidth: { type: Number, default: 0 },
  outputHeight: { type: Number, default: 0 }
})

const emit = defineEmits(['slider-ready'])
const slider = ref(null)
const wrapper = ref(null)
const isFullscreen = ref(false)
const fitMode = ref('scale-down')
const viewMode = ref('input')
const displayBeforeImage = ref(props.beforeImage)
const displayAfterImage = ref(props.afterImage)

const fitOptions = ['contain', 'cover', 'native', 'scale-down']

const fitClass = computed(() => `object-${fitMode.value}`)

const resizeImage = (imageSrc, targetWidth, targetHeight) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = imageSrc
  })
}

const updateDisplayImages = async () => {
  if (!props.beforeImage || !props.afterImage) return
  
  if (viewMode.value === 'input') {
    // Both images at output size (4x)
    displayBeforeImage.value = await resizeImage(props.beforeImage, props.outputWidth, props.outputHeight)
    displayAfterImage.value = await resizeImage(props.afterImage, props.outputWidth, props.outputHeight)
  } else {
    // Both images at input size (1x)
    displayBeforeImage.value = await resizeImage(props.beforeImage, props.inputWidth, props.inputHeight)
    displayAfterImage.value = await resizeImage(props.afterImage, props.inputWidth, props.inputHeight)
  }
  
  setTimeout(() => {
    if (slider.value) {
      slider.value.dispatchEvent(new Event('resize'))
    }
  }, 50)
}

const toggleView = async () => {
  viewMode.value = viewMode.value === 'output' ? 'input' : 'output'
  await updateDisplayImages()
}

const toggleFit = () => {
  const currentIndex = fitOptions.indexOf(fitMode.value)
  const nextIndex = (currentIndex + 1) % fitOptions.length
  fitMode.value = fitOptions[nextIndex]
  
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

watch([() => props.beforeImage, () => props.afterImage], async () => {
  if (props.beforeImage && props.afterImage) {
    displayBeforeImage.value = props.beforeImage
    displayAfterImage.value = props.afterImage
    await updateDisplayImages()
  }
}, { immediate: true })

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
  border-radius: .325em;
  overflow: hidden;
  background: #0a0a0f;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
  max-height: none;
}

.compare-slider {
  width: 100%;
  height: 100%;
  --divider-width: 0.25em;
  --divider-color: #8b5cf6;
  --divider-shadow: 0 0.25em 1.25em rgba(0, 0, 0, 0.5);
  --handle-color: #8b5cf6;
  --handle-shadow: 0 0.25em 1.25em rgba(0, 0, 0, 0.5);
  --handle-size: 3em;
}

.slider-image {
  width: 100%;
  height: 100%;
  display: block;
  background: #0a0a0f;
  transition: object-fit 0.2s ease;
}

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

:deep(img-comparison-slider) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

:deep(img-comparison-slider > div) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.slider-controls {
  position: absolute;
  bottom: 0.75em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 0.5em;
  pointer-events: none;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90%;
}

.slider-prompt {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(0.625em);
  padding: 0.5em 1em;
  border-radius: 6.25em;
  color: white;
  font-size: 0.85rem;
  border: 0.0625em solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5em;
  pointer-events: none;
}

.slider-prompt i {
  color: #8b5cf6;
}

.button-group {
  display: flex;
  gap: 0.5em;
  pointer-events: auto;
  flex-wrap: wrap;
  justify-content: center;
}

.view-toggle,
.fit-toggle,
.fullscreen-toggle {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(0.625em);
  padding: 0.5em 1em;
  border-radius: 6.25em;
  color: white;
  font-size: 0.85rem;
  border: 0.0625em solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 5em;
  justify-content: center;
}

.view-toggle:hover,
.fit-toggle:hover,
.fullscreen-toggle:hover {
  background: rgba(139, 92, 246, 0.6);
  border-color: rgba(139, 92, 246, 0.5);
}

.view-toggle i,
.fit-toggle i,
.fullscreen-toggle i {
  color: #8b5cf6;
  transition: color 0.2s ease;
}

.view-toggle:hover i,
.fit-toggle:hover i,
.fullscreen-toggle:hover i {
  color: white;
}

.view-text {
  font-weight: bold;
  min-width: 2em;
  text-align: center;
}

.fit-text {
  text-transform: capitalize;
}

:deep(.compare-slider::part(divider)) {
  background: white;
}

:deep(.compare-slider::part(handle)) {
  background: white;
  border: 0.1875em solid #8b5cf6;
  box-shadow: 0 0.25em 1.25em rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
  cursor: pointer;
  width: 3em !important;
  height: 3em !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.compare-slider::part(handle):hover) {
  transform: scale(1.1);
  background: #f0f0f0;
}

:deep(.compare-slider::part(handle)::after) {
  content: '↔️';
  font-size: 1.5em;
  color: #1a1a2e;
  line-height: 1;
}

:deep(.compare-slider::part(labeled)) {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.375em 1em;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(0.625em);
  border: 0.0625em solid rgba(255, 255, 255, 0.1);
  border-radius: 6.25em;
  color: white;
  pointer-events: none;
}

:deep(.compare-slider::part(handle-container)) {
  cursor: pointer !important;
}
</style>