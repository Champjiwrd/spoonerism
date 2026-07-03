import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// base ต้องตรงกับชื่อ repo เพื่อให้ deploy บน GitHub Pages ได้ถูก path
// https://champjiwrd.github.io/spoonerism/
export default defineConfig({
  base: '/spoonerism/',
  plugins: [vue(), tailwindcss()],
})
