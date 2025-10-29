import * as SQLite from 'expo-sqlite/next'; // Use new async-first API

// Define the Round type *without* the ID, as it's auto-incremented
export type NewRound = {
  courseId: string;
  courseName: string;
  courseLocation: string;
  score: number;
  date: string;
  notes: string;
};

// Define the full Round type *with* the ID for retrieval
export type Round = NewRound & {
  id: number;
};

let db: SQLite.SQLiteDatabase;

/**
 * Initializes the database, opens a connection, and creates the 'rounds' table
 * if it doesn't already exist.
 */
export async function initDB(): Promise<boolean> {
  try {
    db = await SQLite.openDatabaseAsync('golfdiary.db');
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS rounds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId TEXT NOT NULL,
        courseName TEXT NOT NULL,
        courseLocation TEXT NOT NULL,
        score INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT
      );
    `);
    console.log('Database initialized successfully');
    return true;
  } catch (e) {
    console.error("Database initialization error: ", e);
    return false;
  }
}

/**
 * Fetches all rounds from the local database, ordered by date.
 * @returns A promise that resolves to an array of Round objects.
 */
export async function getRounds(): Promise<Round[]> {
  try {
    const allRows = await db.getAllAsync<Round>('SELECT * FROM rounds ORDER BY date DESC');
    return allRows;
  } catch (e) {
    console.error("Failed to get rounds: ", e);
    return []; // Return empty array on error
  }
}

/**
 * Saves a new round to the local database.
 * @param round The NewRound object to save.
 * @returns A promise that resolves to the SQLite run result.
 */
export async function saveRound(round: NewRound): Promise<SQLite.SQLiteRunResult> {
  try {
    const result = await db.runAsync(
      'INSERT INTO rounds (courseId, courseName, courseLocation, score, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      round.courseId,
      round.courseName,
      round.courseLocation,
      round.score,
      round.date,
      round.notes
    );
    console.log('Round saved with ID: ', result.lastInsertRowId);
    return result;
  } catch (e) {
    console.error("Failed to save round: ", e);
    throw e; // Re-throw to be caught by the component
  }
}

