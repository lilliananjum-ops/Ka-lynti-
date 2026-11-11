import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Keep the React starter plugin available while building the static multi-page site.
const pages = [
  'index.html',
  'understand.html',
  'navigate.html',
  'rights.html',
  'support.html',
  'opportunities.html',
  'todo.html',
  'about.html',
]

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.replace('.html', ''), resolve(process.cwd(), page)])),
    },
  },
})
