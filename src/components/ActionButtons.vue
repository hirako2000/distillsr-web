<template>
  <div class="flex gap-4 mt-6">
    <button 
      :disabled="processDisabled"
      class="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg cursor-pointer"
      @click="$emit('process')"
    >
      <i class="fas fa-magic mr-2"></i>
      Enhance Image
    </button>
    <button 
      :disabled="downloadDisabled"
      class="flex-1 px-6 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/10 hover:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      @click="$emit('download')"
    >
      <i class="fas fa-download mr-2"></i>
      Download Result
    </button>
  </div>
</template>

<script setup>
defineProps({
  processDisabled: Boolean,
  downloadDisabled: Boolean
})

defineEmits(['process', 'download'])
</script>