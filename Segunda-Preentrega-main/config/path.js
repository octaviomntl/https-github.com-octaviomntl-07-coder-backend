import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Obtener la ruta del archivo actual (__filename) y su directorio (__dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname