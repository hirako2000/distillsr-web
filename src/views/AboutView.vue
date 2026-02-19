<template>
    <div class="flex-1 flex flex-col">
    <div class="w-full max-w-[1600px] mx-auto">
        <div class="glass rounded-[32px] overflow-hidden shadow-2xl font-thin">
            <div class="px-8 py-6 bg-black/30 border-b border-white/5">
                <div class="flex items-center gap-3">
                    <i class="fas fa-info-circle text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"></i>
                    <h1 class="text-xl font-semibold gradient-text">
                        About
                    </h1>
                </div>
            </div>

            <div class="p-8 text-slate-300 space-y-8">
                <section>
                    <p class="leading-relaxed">
                        An attempt to brings state-of-the-art Machine Learning to make super-resolution neural processing work directly in the browser, eliminating 
                        the need for setup, GPU servers, or uploads to external services. 
                        The goal is to make upscaling and covery of damaged images, to produce high-quality image enhancement accessible to everyone while maintaining complete 
                        privacy—all, everything stays on your device.
                    </p>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-cogs text-purple-400"></i>
                        Stack
                    </h2>
                    <ul class="list-none space-y-2">
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span><span class="text-white font-medium">Frontend:</span> VueJS</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span><span class="text-white font-medium">ML Runtime:</span> ONNX Runtime Web</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span><span class="text-white font-medium">Acceleration:</span> WebGPU / WebAssembly</span>
                        </li>
                    </ul>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-code-branch text-purple-400"></i>
                        Open Source
                    </h2>
                    <p class="leading-relaxed mb-3">
                        DistillSR is open source and freely available. 
                        The model architecture builds upon super-resolution (SR), optimized for the web with fallback to quantized CPU computation.
                    </p>
                    <a 
                        href="https://github.com/hirako2000/distillsr-web" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white text-sm transition-colors border border-white/10"
                    >
                        <i class="fab fa-github"></i>
                        View Source
                    </a>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-shield-alt text-purple-400"></i>
                        Privacy First
                    </h2>
                    <p class="leading-relaxed">
                        All image processing happens entirely in your browser. Your images are never uploaded to any 
                        server. They stay on your device from the moment you load them until you save the result. 
                        It ensures complete privacy and allows offline usage after the initial model download.
                    </p>
                </section>
            </div>
            
            <Footer />
        </div>
    </div>
    </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>

<style scoped>
.glass {
    background: rgba(20, 20, 30, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(129, 129, 129, 0.1);
}

.gradient-text {
    background: linear-gradient(135deg, #fff, #cbd5e1);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>