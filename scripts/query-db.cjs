const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(process.env.APPDATA, 'green-flow', 'greenflow.db')
const db = new Database(dbPath, { readonly: true })
const salas = db.prepare('SELECT id, nome, btu_necessario FROM salas').all()
const ares = db.prepare('SELECT id, sala_id, marca, modelo, btu_instalado FROM arcondicionados').all()
console.log('SALAS:', JSON.stringify(salas, null, 2))
console.log('ARES:', JSON.stringify(ares, null, 2))
