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
    CREATE TABLE IF NOT EXISTS vendor_user_vendors (
      userId INTEGER NOT NULL UNIQUE,
      vendorId INTEGER NOT NULL UNIQUE,
      PRIMARY KEY (userId, vendorId),
      FOREIGN KEY(userId) REFERENCES vendor_users(id) ON DELETE CASCADE,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vendor_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      displayName TEXT NOT NULL,
      headline TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      website TEXT DEFAULT '',
      avatarUrl TEXT DEFAULT '',
      coverImageUrl TEXT DEFAULT '',
      visibility TEXT NOT NULL DEFAULT 'public',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vendor_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priceCents INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      type TEXT NOT NULL DEFAULT 'service',
      duration TEXT DEFAULT 'per event',
      features TEXT DEFAULT '[]',
      isPopular INTEGER NOT NULL DEFAULT 0,
      pricingModel TEXT DEFAULT 'fixed',
      hourlyRate INTEGER DEFAULT 0,
      depositRequired INTEGER NOT NULL DEFAULT 0,
      depositPercentage INTEGER DEFAULT 25,
      cancellationPolicy TEXT DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vendor_service_areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      radius INTEGER DEFAULT 25,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vendor_availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL UNIQUE,
      monday INTEGER NOT NULL DEFAULT 0,
      tuesday INTEGER NOT NULL DEFAULT 0,
      wednesday INTEGER NOT NULL DEFAULT 0,
      thursday INTEGER NOT NULL DEFAULT 0,
      friday INTEGER NOT NULL DEFAULT 0,
      saturday INTEGER NOT NULL DEFAULT 0,
      sunday INTEGER NOT NULL DEFAULT 0,
      startTime TEXT DEFAULT '09:00',
      endTime TEXT DEFAULT '17:00',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vendor_onboarding (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL UNIQUE,
      step TEXT NOT NULL,
      data TEXT NOT NULL,
      isComplete INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    -- Legacy tables for backward compatibility
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priceCents INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priceCents INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS package_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      packageId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      quantity INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(packageId) REFERENCES packages(id) ON DELETE CASCADE
    );
    -- Enhanced customer booking system
    CREATE TABLE IF NOT EXISTS customer_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT,
      eventDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      eventDuration REAL NOT NULL,
      eventType TEXT NOT NULL,
      guestCount INTEGER,
      venueAddress TEXT,
      specialRequirements TEXT,
      serviceId INTEGER,
      packageId INTEGER,
      totalPriceCents INTEGER NOT NULL,
      depositAmountCents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      paymentStatus TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE,
      FOREIGN KEY(serviceId) REFERENCES vendor_services(id) ON DELETE SET NULL,
      FOREIGN KEY(packageId) REFERENCES vendor_services(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS booking_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookingId INTEGER NOT NULL,
      senderType TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(bookingId) REFERENCES customer_bookings(id) ON DELETE CASCADE
    );

    -- Legacy bookings table (keeping for backward compatibility)
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      packageId INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY(vendorId) REFERENCES vendors(id) ON DELETE CASCADE,
      FOREIGN KEY(packageId) REFERENCES packages(id) ON DELETE SET NULL
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

