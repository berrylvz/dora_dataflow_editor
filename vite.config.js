import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/dora_dataflow_editor/',   // ← 关键：跟仓库名一致
})