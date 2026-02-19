<template>
    <div class="flex items-center gap-3 mb-6 px-5 pb-2 pt-0">
        <div :class="statusDotClass"></div>
        <span class="font-thin text-slate-400">{{ statusText }}</span>
        <span class="ml-auto px-3 py-1 font-thin text-xs text-slate-400">
            <i class="fas fa-microchip mr-1"></i> <span>{{ backendInfo }}</span>
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: String,
    statusText: String,
    backendInfo: String
})

const statusDotClass = computed(() => {
    const base = 'w-2.5 h-2.5 rounded-full'
    if (props.status === 'loaded') return `${base} bg-green-500`
    if (props.status === 'error') return `${base} bg-red-500`
    if (props.status === 'loading') return `${base} bg-yellow-500 animate-pulse`
    return `${base} bg-green-500`
})
</script>