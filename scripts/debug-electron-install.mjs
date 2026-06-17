import { downloadArtifact } from '@electron/get'
import extract from 'extract-zip'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const electronDir = path.join(__dirname, '..', 'node_modules', 'electron')
const pkg = JSON.parse(fs.readFileSync(path.join(electronDir, 'package.json'), 'utf-8'))

console.log('STEP 1: version =', pkg.version)
console.log('STEP 2: ELECTRON_SKIP_BINARY_DOWNLOAD =', process.env.ELECTRON_SKIP_BINARY_DOWNLOAD)

console.log('STEP 3: calling downloadArtifact...')
const zipPath = await downloadArtifact({
  version: pkg.version,
  artifactName: 'electron',
  platform: 'win32',
  arch: 'x64'
})
console.log('STEP 4: zipPath =', zipPath, 'exists=', fs.existsSync(zipPath))

const distPath = path.join(electronDir, 'dist')
console.log('STEP 5: extracting to', distPath)
await extract(zipPath, { dir: distPath })
console.log('STEP 6: extraction done')

const exePath = path.join(distPath, 'electron.exe')
console.log('STEP 7: electron.exe exists =', fs.existsSync(exePath))

fs.writeFileSync(path.join(electronDir, 'path.txt'), 'electron.exe')
console.log('STEP 8: wrote path.txt')
