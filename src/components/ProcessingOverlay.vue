<template>
    <div class="processing-overlay" :class="{ active: visible }">
        <div class="text-center">
            <div
                class="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin-custom mx-auto mb-6">
            </div>
            <p class="text-white text-xl font-medium mb-2">Neural Net processing...</p>

            <Transition name="slide-fade" mode="out-in">
                <div :key="currentMessageIndex" class="message-container">
                    <p class="text-slate-400 text-sm">{{ currentMessage.main }}</p>
                    <p v-if="currentMessage.sub" class="text-slate-500 text-xs mt-1">{{ currentMessage.sub }}</p>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
    visible: Boolean,
    totalTiles: Number,
    processedTiles: Number
})

const messages = [
    { main: 'De-blurring optics', sub: 'Sharpening Gaussian and motion blurs...' },
    { main: 'Neutralizing noise', sub: 'Stripping sensor hiss and shadow grain...' },
    { main: 'Removing ringing', sub: 'Clearing halos and sinc-filter oscillations...' },
    { main: 'De-compression', sub: 'Smoothing blocks and mosquito noise...' },
    { main: 'Color restore', sub: 'Correcting chroma smears & subsampling...' },
    { main: 'Upscaling details', sub: 'Reconstructing pixels from low-res resizing...' },
    { main: 'Refining texture', sub: 'Polishing edges and spectral frequencies...' }
]

const currentMessageIndex = ref(0)
const intervalId = ref(null)

const getRandomMessageIndex = (currentIndex) => {
    let newIndex
    do {
        newIndex = Math.floor(Math.random() * messages.length)
    } while (messages.length > 1 && newIndex === currentIndex)
    return newIndex
}

const updateMessage = () => {
    currentMessageIndex.value = getRandomMessageIndex(currentMessageIndex.value)
}

const currentMessage = computed(() => messages[currentMessageIndex.value])

const messageSwirl = 3000;
watch(() => props.visible, (newVal) => {
    if (newVal) {
        currentMessageIndex.value = Math.floor(Math.random() * messages.length)
        
        intervalId.value = setInterval(updateMessage, messageSwirl)
    } else {
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }
})

onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
})
</script>

<style scoped>
.processing-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(10px);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 100;
    border-radius: 24px;
}

.processing-overlay.active {
    display: flex;
    animation: fadeIn 0.3s ease;
}

.message-container {
    min-height: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-spin-custom {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>