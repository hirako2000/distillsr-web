import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

import postcssImport from 'postcss-import';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    source: {
        entry: {
            index: './src/main.js',
        },
        alias: {
            '@': './src',
        },
    },

    html: {
        template: './index.html',
    },

    output: {
        distPath: {
            root: 'dist'
        },
        cleanDistPath: true, // Cleans the output directory before each build
    },
    plugins: [
        pluginVue({
            vueLoaderOptions: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === 'img-comparison-slider'
                }
            }
        })
    ],
    server: {
        port: 9999,
    },

    tools: {
        postcss: (config, { addPlugins }) => {
            // Add PostCSS Plugins. In chaos, order matters!
            // postcss-import should generally come first to resolve @import rules.
            // not sure though
            addPlugins([
                postcssImport(),
                tailwindcss({ config: './tailwind.config.js' }),
                autoprefixer(),
            ]);
        }
    },
});
