import { _electron as electron } from 'playwright-core'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APP_DIR = path.resolve(__dirname, '..')
const SHOT_DIR = path.join(APP_DIR, '.smoke-screenshots')
fs.mkdirSync(SHOT_DIR, { recursive: true })

// perfil isolado e descartável — nunca toca no banco de dados real do usuário
const TEST_USER_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'green-flow-smoke-'))

const electronBin = path.join(APP_DIR, 'node_modules', 'electron', 'dist', 'electron.exe')

let shotIndex = 0
async function shot(page, name) {
  shotIndex += 1
  const file = path.join(SHOT_DIR, `${String(shotIndex).padStart(2, '0')}-${name}.png`)
  await page.screenshot({ path: file })
  console.log('screenshot:', file)
}

async function clickByText(page, selector, text) {
  const result = await page.evaluate(
    ({ selector, text }) => {
      const els = [...document.querySelectorAll(selector)]
      const el = els.find((e) => e.textContent?.trim() === text) ?? els.find((e) => e.textContent?.includes(text))
      if (!el) return 'NOT_FOUND'
      el.click()
      return 'OK'
    },
    { selector, text }
  )
  console.log(`click "${text}" ->`, result)
  if (result === 'NOT_FOUND') throw new Error(`Elemento com texto "${text}" não encontrado (${selector})`)
}

async function main() {
  console.log('Lançando app de:', APP_DIR)
  // ELECTRON_RUN_AS_NODE no ambiente do host faria o electron.exe rodar como Node puro (sem janela),
  // quebrando o handshake que o Playwright espera — remover para este processo filho.
  const { ELECTRON_RUN_AS_NODE, ...cleanEnv } = process.env
  const app = await electron.launch({
    executablePath: electronBin,
    args: [APP_DIR, `--user-data-dir=${TEST_USER_DATA_DIR}`],
    env: cleanEnv,
    timeout: 30000
  })

  app.process().stdout?.on('data', (d) => process.stdout.write('[main stdout] ' + d))
  app.process().stderr?.on('data', (d) => process.stdout.write('[main stderr] ' + d))

  const page = await app.firstWindow()
  page.on('dialog', async (dialog) => {
    console.log('[dialog]', dialog.type(), dialog.message())
    await dialog.accept()
  })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
    console.log('[renderer console]', msg.type(), msg.text())
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
    console.log('[renderer pageerror]', err.message)
  })

  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(1500)

  await shot(page, 'dashboard')

  // Salas
  await page.click('a[href="#/salas"]')
  await page.waitForTimeout(300)
  await shot(page, 'salas-vazio')

  await clickByText(page, 'button', '+ Nova sala')
  await page.waitForTimeout(300)
  await page.fill('[data-testid="sala-nome"]', 'Sala 101')
  await page.fill('[data-testid="sala-comprimento"]', '6')
  await page.fill('[data-testid="sala-largura"]', '5')
  await page.fill('[data-testid="sala-altura"]', '2.8')
  await page.fill('[data-testid="sala-pessoas"]', '30')
  await page.fill('[data-testid="sala-eletronicos"]', '2')
  await shot(page, 'sala-form-preenchido')

  await clickByText(page, 'button[type="submit"]', 'Salvar')
  await page.waitForTimeout(600)
  await shot(page, 'salas-lista')

  // Ares-Condicionados
  await page.click('a[href="#/ares-condicionados"]')
  await page.waitForTimeout(300)
  await clickByText(page, 'button', '+ Novo ar-condicionado')
  await page.waitForTimeout(300)
  await page.selectOption('[data-testid="ac-sala"]', { label: 'Sala 101' })
  await page.fill('[data-testid="ac-marca"]', 'LG')
  await page.fill('[data-testid="ac-modelo"]', 'Dual Inverter')
  await page.selectOption('[data-testid="ac-btu"]', '12000')
  await page.fill('[data-testid="ac-potencia"]', '1200')
  await page.fill('[data-testid="ac-horas"]', '8')
  await page.fill('[data-testid="ac-dias"]', '22')
  await shot(page, 'ac-form-preenchido')

  await clickByText(page, 'button[type="submit"]', 'Salvar')
  await page.waitForTimeout(600)
  await shot(page, 'ac-lista')

  // Dashboard novamente (com dados)
  await page.click('a[href="#/"]')
  await page.waitForTimeout(400)
  await shot(page, 'dashboard-com-dados')

  // Gráficos
  await page.click('a[href="#/graficos"]')
  await page.waitForTimeout(600)
  await shot(page, 'graficos')

  // Gastos
  await page.click('a[href="#/gastos"]')
  await page.waitForTimeout(300)
  await shot(page, 'gastos')

  // Água
  await page.click('a[href="#/agua"]')
  await page.waitForTimeout(300)
  await shot(page, 'agua')

  // Calculadora
  await page.click('a[href="#/calculadora"]')
  await page.waitForTimeout(300)
  await shot(page, 'calculadora')

  // Configurações + tema
  await page.click('a[href="#/configuracoes"]')
  await page.waitForTimeout(300)
  await shot(page, 'config-claro')

  await clickByText(page, 'button', '🌙 Escuro')
  await page.waitForTimeout(300)
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  console.log('tema escuro aplicado?', isDark)
  await shot(page, 'config-escuro')

  // Relatório PDF (apenas verifica que a página carrega; não clica em gerar para não abrir diálogo nativo bloqueante)
  await page.click('a[href="#/relatorio"]')
  await page.waitForTimeout(300)
  await shot(page, 'relatorio-pdf')

  // Exclusão em cascata: excluir a única sala deve remover o AC vinculado a ela também
  await page.click('a[href="#/salas"]')
  await page.waitForTimeout(300)
  await clickByText(page, 'button', 'Excluir')
  await page.waitForTimeout(500)
  const linhasSalasDepois = await page.evaluate(() => document.querySelectorAll('tbody tr').length)
  console.log('Linhas na tabela de salas após excluir (esperado 1, com a mensagem "nenhuma sala"):', linhasSalasDepois)
  await shot(page, 'salas-apos-exclusao')

  await page.click('a[href="#/ares-condicionados"]')
  await page.waitForTimeout(300)
  const linhasAcsDepois = await page.evaluate(() => document.querySelectorAll('tbody tr').length)
  console.log('Linhas na tabela de ACs após excluir a sala (esperado 1, com a mensagem "nenhum AC" - cascade delete):', linhasAcsDepois)
  await shot(page, 'ac-apos-exclusao-cascata')

  console.log('CONSOLE_ERRORS_COUNT:', consoleErrors.length)
  if (consoleErrors.length > 0) console.log('CONSOLE_ERRORS:', JSON.stringify(consoleErrors, null, 2))

  await app.close()
  fs.rmSync(TEST_USER_DATA_DIR, { recursive: true, force: true })
  console.log('OK: smoke test concluído')
}

main().catch((err) => {
  console.error('FALHA NO SMOKE TEST:', err)
  process.exit(1)
})
