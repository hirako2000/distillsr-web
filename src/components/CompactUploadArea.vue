<template>
    <div 
        ref="dropZone"
        class="compact-upload-area glass-light cursor-pointer"
        :class="{ 'border-purple-500 bg-purple-500/10': isDragging }"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
    >
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <i class="fas fa-cloud-upload-alt text-purple-500"></i>
                <span class="text-white text-sm font-medium">
                    {{ hasImage ? 'Change image' : 'Drop image or click' }}
                </span>
            </div>
            
            <div v-if="hasImage" class="flex items-center gap-2 text-xs text-slate-400">
                <i class="fas fa-check-circle text-green-500"></i>
                <span>Image loaded</span>
            </div>
            
            <div class="flex items-center gap-2 text-xs text-slate-400 ml-auto">
                <i class="fas fa-info-circle"></i>
                <span>JPG, PNG, WebP</span>
            </div>
        </div>
    </div>
    <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        class="hidden"
        @change="handleFileChange"
    >
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    hasImage: Boolean
})

const emit = defineEmits(['file-selected'])

const isDragging = ref(false)
const fileInput = ref(null)
const dropZone = ref(null)

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleDragOver = () => {
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}

const handleDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        emit('file-selected', file)
    }
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) emit('file-selected', file)
}
</script>

<style scoped>
.compact-upload-area {
    padding: 1rem 1.5rem;
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    transition: all 0.2s ease;
}

.compact-upload-area:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.05);
}

.glass-light {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
</style>