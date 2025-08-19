import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

declare global {
  var __gigfrenzyDb: Database.Database | undefined
}

function initializeDatabase(filePath: string): Database.Database {
  const directory = path.dirname(filePath)
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }

  const db = new Database(filePath)
  db.pragma('foreign_keys = ON')
  try {
    db.pragma('journal_mode = WAL')
  } catch {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      businessName TEXT NOT NULL,
      contactName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      businessType TEXT NOT NULL,
      website TEXT DEFAULT '',
      description TEXT DEFAULT '',
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS vendor_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'vendor',
      createdAt TEXT NOT NULL
    );
  `)

  return db
}

export function getDatabase(): Database.Database {
  if (!global.__gigfrenzyDb) {
    const databaseFilePath = path.join(process.cwd(), 'data', 'app.db')
    global.__gigfrenzyDb = initializeDatabase(databaseFilePath)
  }
  return global.__gigfrenzyDb
}

