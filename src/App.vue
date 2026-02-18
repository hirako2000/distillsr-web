<template>
  <div class="min-h-screen flex items-center justify-center p-2 md:p-5">
    <div class="w-full max-w-[1600px] mx-auto flex flex-col min-h-[calc(100vh-2.5rem)]">
      <router-view v-slot="{ Component }">
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" class="flex-1 flex" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
* {
  font-family: 'Inter', sans-serif;
}

body {
  background: #0a0a0f;
  background-image: radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  margin: 0;
  min-height: 100vh;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>