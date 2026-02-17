<template>
    <div ref="dropZone"
        class="text-center px-12 py-16 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all mb-8"
        :class="{ 'border-purple-500 bg-purple-500/5': isDragging }" @click="triggerFileInput"
        @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
        <i class="fas fa-cloud-upload-alt text-5xl text-purple-500 mb-4"></i>
        <h3 class="text-white text-xl font-medium mb-2">Drop your image here</h3>
        <p class="text-slate-400 text-sm">or click to browse · JPG, PNG, WebP</p>
    </div>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange">
</template>

<script setup>
import { ref } from 'vue'

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