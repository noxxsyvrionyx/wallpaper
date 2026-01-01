import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wallpaper/' // replace 'wallpaper' with your repo name
})
