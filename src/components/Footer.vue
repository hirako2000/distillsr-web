<template>
    <div class="border-t border-white/5 px-8 py-4 bg-black/20">
        <div class="flex items-center justify-between font-thin">
            <div class="flex items-center gap-6">
                <router-link to="/" class="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <span>Home</span>
                </router-link>
                <router-link to="/how" class="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <span>How</span>
                </router-link>
                <router-link to="/about" class="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <span>About</span>
                </router-link>
            </div>
            
            <a 
                href="https://github.com/hirako2000/distillsr-web" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
            >
                <i class="fab fa-github"></i>
                <span>Source code</span>
            </a>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>