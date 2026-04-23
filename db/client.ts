import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('applications.db');

sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    application_date TEXT NOT NULL,
    priority_score INTEGER NOT NULL DEFAULT 0,
    notes TEXT
  );
`);

export const db = drizzle(sqlite);
