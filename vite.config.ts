import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//tailwindcss
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import PostcssPresetEnv from 'postcss-preset-env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer, PostcssPresetEnv]
    }
  }
})
