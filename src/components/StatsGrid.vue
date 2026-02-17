<template>
  <div class="flex flex-wrap items-center justify-center gap-3 mb-6">
    <div class="stat-pill">
      <span class="stat-label">Input</span>
      <span class="stat-value">{{ inputSize }}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">Output</span>
      <span class="stat-value">{{ outputSize }}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">Time</span>
      <span class="stat-value">{{ processTime }}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">Model</span>
      <span class="stat-value">{{ modelName }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  inputSize: String,
  outputSize: String,
  processTime: String,
  modelName: String
})
</script>

<style scoped>
.stat-pill {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  padding: 0.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>