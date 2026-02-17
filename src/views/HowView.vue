<template>
    <div class="w-full max-w-[1600px] mx-auto">
        <div class="glass rounded-[32px] overflow-hidden shadow-2xl font-thin">
            <div class="px-8 py-6 bg-black/30 border-b border-white/5">
                <div class="flex items-center gap-3">
                    <i class="fas fa-microchip text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"></i>
                    <h1 class="text-xl font-semibold gradient-text">
                        How it works
                    </h1>
                </div>
            </div>
            
            <div class="p-8 text-slate-300 space-y-8">
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-brain text-purple-400"></i>
                        Neural
                    </h2>
                    <p class="leading-relaxed">
                        DistillSR is a lightweight super-resolution model based on an optimized PLKSR architecture. 
                        It uses a combination of spatial and channel attention mechanisms to reconstruct high-frequency 
                        details from low-resolution inputs. The model has been retrained on diverse datasets with 
                        advanced distillation techniques, resulting in faster inference and sharper outputs compared 
                        to the original traditional (very research focused) approach.
                    </p>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-tachometer-alt text-purple-400"></i>
                        Performance
                    </h2>
                    <p class="leading-relaxed mb-3">
                        The model employs tile-based processing to handle images of any size, with pixel perfect overlap 
                        to eliminate seam artifacts. Two optimized versions are available:
                    </p>
                    <ul class="list-none space-y-2">
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span><span class="text-white font-medium">Precise (Best Quality):</span> Full precision model for maximum fidelity, ideal for detailed photography work.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                            <span><span class="text-white font-medium">Quantized:</span> Quantized 8-bit model optimized for speed with minimal quality loss, reasonably fast on CPU.</span>
                        </li>
                    </ul>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-bolt text-purple-400"></i>
                        WebGPU
                    </h2>
                    <p class="leading-relaxed">
                        Leverages WebGPU for hardware accelerated inference when available, 
                        fall back to WebAssembly CPU execution otherwise. The INT8 quantized model is specifically 
                        optimized for CPU paths, either way. All processing 
                        happens locally in your browser—no server uploads, no privacy concerns.
                    </p>
                </section>
                
                <section>
                    <h2 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                        <i class="fas fa-magic text-purple-400"></i>
                        Features
                    </h2>
                    <ul class="list-none space-y-2">
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span>4× upscaling while preserving fine details and textures</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span>Advanced de-ringing and de-blocking for compressed sources</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                            <span>Real-time slider comparison between original and enhanced</span>
                        </li>
                    </ul>
                </section>
            </div>
            
            <Footer />
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
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text {
    background: linear-gradient(135deg, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>