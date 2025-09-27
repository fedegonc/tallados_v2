import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fonts-mock-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/fonts', (req, res) => {
          try {
            const filePath = path.resolve(__dirname, 'public', 'fonts.json')
            const data = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch (error) {
            res.statusCode = 500
            res.end(
              JSON.stringify({
                message: 'No se pudo cargar fonts.json',
                error: error instanceof Error ? error.message : String(error),
              }),
            )
          }
        })
      },
    },
  ],
})
