import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const shouldReset = process.argv.includes("--reset");

const dropStatements = [
  "DROP TABLE IF EXISTS Booking",
  "DROP TABLE IF EXISTS Review",
  "DROP TABLE IF EXISTS Tour",
  "DROP TABLE IF EXISTS Guide",
  "DROP TABLE IF EXISTS City",
  "DROP TABLE IF EXISTS User"
];

const createStatements = [
  `CREATE TABLE IF NOT EXISTS User (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS Guide (
    id TEXT NOT NULL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    photo TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    experienceYears INTEGER NOT NULL,
    specialization TEXT NOT NULL,
    languages TEXT NOT NULL,
    rating REAL NOT NULL,
    completedTours INTEGER NOT NULL,
    certificateNumber TEXT NOT NULL,
    certificateIssuedAt DATETIME NOT NULL,
    certificateIssuer TEXT NOT NULL,
    bio TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS Tour (
    id TEXT NOT NULL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    longDescription TEXT NOT NULL,
    price INTEGER NOT NULL,
    currency TEXT NOT NULL,
    durationHours REAL NOT NULL,
    rating REAL NOT NULL,
    reviewCount INTEGER NOT NULL,
    language TEXT NOT NULL,
    maxGroupSize INTEGER NOT NULL,
    image TEXT NOT NULL,
    meetingPoint TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    routeJson TEXT NOT NULL,
    programJson TEXT NOT NULL,
    galleryJson TEXT NOT NULL,
    guideId TEXT NOT NULL,
    CONSTRAINT Tour_guideId_fkey FOREIGN KEY (guideId) REFERENCES Guide (id) ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Review (
    id TEXT NOT NULL PRIMARY KEY,
    userName TEXT NOT NULL,
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tourId TEXT,
    guideId TEXT,
    CONSTRAINT Review_tourId_fkey FOREIGN KEY (tourId) REFERENCES Tour (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT Review_guideId_fkey FOREIGN KEY (guideId) REFERENCES Guide (id) ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Booking (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    tourId TEXT NOT NULL,
    customerName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATETIME NOT NULL,
    people INTEGER NOT NULL,
    comment TEXT,
    totalPrice INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Booking_userId_fkey FOREIGN KEY (userId) REFERENCES User (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT Booking_tourId_fkey FOREIGN KEY (tourId) REFERENCES Tour (id) ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS City (
    id TEXT NOT NULL PRIMARY KEY,
    country TEXT NOT NULL,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS Tour_city_country_idx ON Tour(city, country)",
  "CREATE INDEX IF NOT EXISTS Tour_category_idx ON Tour(category)",
  "CREATE INDEX IF NOT EXISTS Booking_userId_idx ON Booking(userId)",
  "CREATE INDEX IF NOT EXISTS Review_tourId_idx ON Review(tourId)",
  "CREATE INDEX IF NOT EXISTS Review_guideId_idx ON Review(guideId)"
];

async function run() {
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = OFF");

  if (shouldReset) {
    for (const statement of dropStatements) {
      await prisma.$executeRawUnsafe(statement);
    }
  }

  for (const statement of createStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON");
  console.log(`SQLite schema ${shouldReset ? "reset" : "created"} successfully.`);
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
