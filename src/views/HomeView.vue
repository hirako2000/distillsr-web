<template>
    <div class="flex-1 flex flex-col">
   <div class="w-full max-w-[1600px] mx-auto fully flex flex-col min-h-full">
        <WorkerMessage :visible="workerVisible" :text="workerText" />

        <div class="glass rounded-[32px] overflow-hidden shadow-2xl flex flex-col flex-1">
            <div
                class="px-4 py-6 bg-black/30 border-b border-white/5 flex items-center justify-between flex-wrap gap-5">
                <div class="flex items-center gap-3">
                    <i
                        class="fas fa-magic text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"></i>
                    <h1 class="text-xl font-semibold gradient-text">
                        DistillSR
                        <span class="text-md font-normal text-slate-400 ml-2">Super Resolution</span>
                    </h1>
                    <span class="" :class="backendClass" :style="{ display: backendVisible ? 'inline-flex' : 'none' }">
                        <i class="fas fa-microchip mr-1"></i>
                        <span class="text-xs">
                            {{ backendText }}
                        </span>
                    </span>
                </div>

                <div class="flex items-center gap-3">
                    <ModelSelector v-model="selectedModel" :models="models" @model-changed="handleModelChange" />
                </div>
            </div>

            <div class="p-2 md:p-8 flex-1 flex flex-col">
                <StatusBar :status="status" :status-text="statusText" :backend-info="backendInfo" />

                <div v-if="errorVisible"
                    class="mb-5 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3 fade-in">
                    <i class="fas fa-exclamation-circle text-xl"></i>
                    <span>{{ errorText }}</span>
                </div>

                <div class="mb-6 space-y-3">
                    <CompactUploadArea 
                        @file-selected="handleFileSelect"
                        :has-image="imageLoaded"
                    />
                    <ControlsPanel 
                        v-model="maxDimension" 
                        v-model:tileValue="tileSize"
                    />
                </div>

                <div v-if="!imageLoaded" 
                     class="fade-in text-center py-12 flex-1 flex items-center justify-center cursor-pointer"
                     @click="triggerFileInput"
                     @dragover.prevent="handleDragOver"
                     @dragleave.prevent="handleDragLeave"
                     @drop.prevent="handleDrop">
                    <div>
                        <i class="fas fa-image text-6xl text-slate-600 mb-4"></i>
                        <h3 class="text-white text-xl font-medium mb-2">No image loaded</h3>
                        <p class="text-slate-400">Drop an image above or click to browse</p>
                    </div>
                </div>

                <div v-else class="fade-in flex-1 flex flex-col">
                    <StatsGrid :input-size="displayInputSize" :output-size="displayOutputSize" :process-time="processTime"
                        :model-name="currentModelInfo?.name" />

                    <ImageComparison 
                        :before-image="beforeImageSrc" 
                        :after-image="afterImageSrc"
                        :processing="isProcessing" 
                        :prompt-visible="!isProcessing && processedImage"
                        :input-width="workingDimensions.width"
                        :input-height="workingDimensions.height"
                        :output-width="workingDimensions.width * scale"
                        :output-height="workingDimensions.height * scale"
                        @slider-ready="handleSliderReady" 
                    />

                    <ActionButtons :process-disabled="!session || !originalImage || isProcessing"
                        :download-disabled="!processedImage" @process="processImage" @download="downloadImage" />
                </div>
            </div>
            
            <Footer />
        </div>

        <ProcessingOverlay :visible="isProcessing" :total-tiles="totalTiles" :processed-tiles="processedTiles" />
    </div>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected">
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ModelSelector from '../components/ModelSelector.vue'
import StatusBar from '../components/StatusBar.vue'
import CompactUploadArea from '../components/CompactUploadArea.vue'
import StatsGrid from '../components/StatsGrid.vue'
import ImageComparison from '../components/ImageComparison.vue'
import ActionButtons from '../components/ActionButtons.vue'
import ProcessingOverlay from '../components/ProcessingOverlay.vue'
import WorkerMessage from '../components/WorkerMessage.vue'
import Footer from '../components/Footer.vue'
import ControlsPanel from '../components/ControlsPanel.vue'
import useImageProcessor from '../composables/useImageProcessor'
import imageCompression from 'browser-image-compression'

const {
    session,
    isProcessing,
    processedTiles,
    totalTiles,
    workerVisible,
    workerText,
    backendInfo,
    backendVisible,
    backendText,
    backendClass,
    status,
    statusText,
    errorVisible,
    errorText,
    maxDimension,
    tileSize,
    loadModel,
    runTiledInference
} = useImageProcessor()

const fileInput = ref(null)
const isDragging = ref(false)

const models = ref({
  'https://pub-b8f791a4eda2462d9bb397bbb62123cd.r2.dev/distillsr_web_fp32.onnx': {
    name: 'Precise',
    speed: 'Quality',
    badge: 'bg-purple-500',
    recommended: true
  },
  'https://pub-b8f791a4eda2462d9bb397bbb62123cd.r2.dev/distillsr_web_int8.onnx': {
    name: 'Quantized',
    speed: 'Fast CPU',
    badge: 'bg-green-500',
    recommended: false
  }
})

const selectedModel = ref('https://pub-b8f791a4eda2462d9bb397bbb62123cd.r2.dev/distillsr_web_fp32.onnx')
const currentModelInfo = computed(() => models.value[selectedModel.value])

const originalImage = ref(null)
const originalImageData = ref(null)
const originalDimensions = ref({ width: 0, height: 0 })
const processedImage = ref(null)
const beforeImageSrc = ref(null)
const afterImageSrc = ref(null)
const imageLoaded = ref(false)
const processTime = ref('—')
const scale = 4

const workingDimensions = computed(() => {
    if (!originalDimensions.value.width || !originalDimensions.value.height) {
        return { width: 0, height: 0 }
    }
    
    const maxOriginal = Math.max(originalDimensions.value.width, originalDimensions.value.height)
    const maxOutput = maxOriginal * scale
    
    if (maxOutput <= maxDimension.value) {
        return { ...originalDimensions.value }
    }
    
    const scaleFactor = maxDimension.value / maxOutput
    return {
        width: Math.round(originalDimensions.value.width * scaleFactor / 4) * 4,
        height: Math.round(originalDimensions.value.height * scaleFactor / 4) * 4
    }
})

const displayInputSize = computed(() => {
    if (!workingDimensions.value.width || !workingDimensions.value.height) return '—'
    return `${workingDimensions.value.width} × ${workingDimensions.value.height}`
})

const displayOutputSize = computed(() => {
    if (!workingDimensions.value.width || !workingDimensions.value.height) return '—'
    return `${workingDimensions.value.width * scale} × ${workingDimensions.value.height * scale} (4x)`
})

const handleModelChange = async (model) => {
    selectedModel.value = model
    await loadModel(model, currentModelInfo.value.name)
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleDragOver = (e) => {
    e.preventDefault()
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}

const handleDrop = (e) => {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        handleFileSelect(file)
    }
}

const onFileSelected = (e) => {
    const file = e.target.files[0]
    if (file) {
        handleFileSelect(file)
    }
}

const resizeImageIfNeeded = async (file) => {
    const options = {
        maxWidthOrHeight: maxDimension.value,
        useWebWorker: true,
        preserveExif: false
    }
    
    try {
        const compressedFile = await imageCompression(file, options)
        return compressedFile
    } catch (error) {
        console.error('Resize failed:', error)
        return file
    }
}

const handleFileSelect = async (file) => {
    const processedFile = await resizeImageIfNeeded(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
            originalDimensions.value = {
                width: img.width,
                height: img.height
            }

            originalImageData.value = e.target.result
            originalImage.value = img

            const outputWidth = workingDimensions.value.width * scale
            const outputHeight = workingDimensions.value.height * scale

            const beforeCanvas = document.createElement('canvas')
            beforeCanvas.width = outputWidth
            beforeCanvas.height = outputHeight
            const beforeCtx = beforeCanvas.getContext('2d')
            beforeCtx.drawImage(img, 0, 0, outputWidth, outputHeight)
            beforeImageSrc.value = beforeCanvas.toDataURL('image/png')
            
            const afterCanvas = document.createElement('canvas')
            afterCanvas.width = outputWidth
            afterCanvas.height = outputHeight
            const afterCtx = afterCanvas.getContext('2d')
            afterCtx.drawImage(img, 0, 0, outputWidth, outputHeight)
            afterImageSrc.value = afterCanvas.toDataURL('image/png')

            processTime.value = '—'

            imageLoaded.value = true
            processedImage.value = null
        }
        img.src = e.target.result
    }
    reader.readAsDataURL(processedFile)
}

const processImage = async () => {
    if (!session.value || !originalImage.value || isProcessing.value) return

    const startTime = performance.now()

    const result = await runTiledInference(
        originalImage.value,
        originalDimensions.value,
        currentModelInfo.value.name
    )

    if (result) {
        processedImage.value = result.imageData
        afterImageSrc.value = result.imageData

        const endTime = performance.now()
        processTime.value = `${((endTime - startTime) / 1000).toFixed(1)}s`
    }
}

const downloadImage = () => {
    if (!processedImage.value) return

    const link = document.createElement('a')
    link.download = `upscaled_${currentModelInfo.value.name}_${Date.now()}.png`
    link.href = processedImage.value
    link.click()
}

const handleSliderReady = () => { }

onMounted(() => {
    loadModel(selectedModel.value, currentModelInfo.value.name)
})
</script>

<style scoped>
.fully {
    min-height: 95vh;
}

.glass {
    background: rgba(20, 20, 30, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text {
    background: linear-gradient(135deg, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.fade-in {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>