<template>
    <div class="flex items-center gap-4">
        <div class="relative min-w-[100px]">
            <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
                class="w-fuell px-5 w-32 py-2 bg-white/5 border border-white/10 rounded-2xl text-white text-xs appearance-none cursor-pointer hover:bg-white/10 focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/20 transition-all">
                <option v-for="(info, value) in models" :key="value" :value="value" :data-precision="info.name"
                    :data-speed="info.speed" :data-badge="info.badge" class="bg-gray-900">
                    {{ info.name }} {{ info.recommended ?
                    '' : '' }}
                </option>
            </select>
            <i
                class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
        </div>

        <div class="flex items-center gap-1 md:gap-3 w-14 justify-center px-2 py-1 bg-white/5 rounded-full border border-white/10">
            <span :class="`px-3 py-1 ${currentBadge} w-14 rounded-full text-xs font-thin text-white`">
                {{ currentSpeed }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: String,
    models: Object
})

const emit = defineEmits(['update:modelValue', 'model-changed'])

const currentModel = computed(() => props.models[props.modelValue])

const currentName = computed(() => currentModel.value?.name || 'Precise')
const currentSpeed = computed(() => currentModel.value?.speed || 'Quality')
const currentBadge = computed(() => currentModel.value?.badge || 'bg-purple-500')
</script>