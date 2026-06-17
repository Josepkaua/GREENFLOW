import { PNG } from 'pngjs'
import pngToIco from 'png-to-ico'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RESOURCES_DIR = join(__dirname, '..', 'resources')

const ICO_SIZES = [16, 32, 48, 64, 128, 256]

const BG = [22, 163, 74] // brand-600 #16a34a
const LEAF = [240, 253, 244] // brand-50 #f0fdf4
const VEIN = [21, 128, 61] // brand-700 #15803d

function isInsideRoundedSquare(x, y, size, radius) {
  const nx = x < radius ? radius - x : x > size - radius ? x - (size - radius) : 0
  const ny = y < radius ? radius - y : y > size - radius ? y - (size - radius) : 0
  if (nx === 0 || ny === 0) return true
  return Math.hypot(nx, ny) <= radius
}

/** Folha simples: vesica (interseção de dois círculos) rotacionada 45°, com uma nervura central. */
function renderIcon(size) {
  const png = new PNG({ width: size, height: size })
  const cx = size / 2
  const cy = size / 2
  const cornerRadius = size * 0.18
  const leafRadius = size * 0.42
  const offset = size * 0.22
  const cos = Math.cos(-Math.PI / 4)
  const sin = Math.sin(-Math.PI / 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2
      let r = 0
      let g = 0
      let b = 0
      let a = 0

      if (isInsideRoundedSquare(x, y, size, cornerRadius)) {
        ;[r, g, b, a] = [...BG, 255]

        const dx = x - cx
        const dy = y - cy
        const rx = dx * cos - dy * sin
        const ry = dx * sin + dy * cos
        const d1 = Math.hypot(rx - offset, ry)
        const d2 = Math.hypot(rx + offset, ry)

        if (d1 < leafRadius && d2 < leafRadius) {
          ;[r, g, b, a] = [...LEAF, 255]

          if (Math.abs(ry) < Math.max(1, size * 0.012) && Math.abs(rx) < leafRadius * 0.8) {
            ;[r, g, b, a] = [...VEIN, 255]
          }
        }
      }

      png.data[idx] = r
      png.data[idx + 1] = g
      png.data[idx + 2] = b
      png.data[idx + 3] = a
    }
  }

  return PNG.sync.write(png)
}

async function main() {
  await mkdir(RESOURCES_DIR, { recursive: true })

  const buffers = ICO_SIZES.map(renderIcon)
  await writeFile(join(RESOURCES_DIR, 'icon.png'), renderIcon(512))

  try {
    const icoBuffer = await pngToIco(buffers)
    await writeFile(join(RESOURCES_DIR, 'icon.ico'), icoBuffer)
    console.log('Ícone gerado em resources/icon.ico e resources/icon.png')
  } catch (err) {
    console.warn('Falha ao gerar icon.ico, electron-builder usará o ícone padrão:', err.message)
  }
}

main()
