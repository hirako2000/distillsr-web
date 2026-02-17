<template>
    <div class="worker-message glass" :class="{ active: visible }">
        <i class="fas fa-microchip mr-2 text-purple-400"></i>
        <span>{{ text }}</span>
    </div>
</template>

<script setup>
defineProps({
    visible: Boolean,
    text: String
})
</script>

<style scoped>
.worker-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 0.85rem;
    z-index: 1000;
    display: none;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.worker-message.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

.glass {
    background: rgba(20, 20, 30, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
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