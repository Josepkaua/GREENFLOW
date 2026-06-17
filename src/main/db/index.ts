import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'
import schemaSql from './schema.sql?raw'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const dbPath = join(app.getPath('userData'), 'greenflow.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(schemaSql)

  return db
}
