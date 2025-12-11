import * as SQLite from 'expo-sqlite';

export type NewRound = {
  courseId: string;
  courseName: string;
  courseLocation: string;
  score: number;
  date: string;
  notes: string;
};

export type Round = NewRound & {
  id: number;
};

let db: SQLite.SQLiteDatabase;

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
    return true;
  } catch (e) {
    return false;
  }
}

export async function getRounds(): Promise<Round[]> {
  try {
    const allRows = await db.getAllAsync<Round>('SELECT * FROM rounds ORDER BY date DESC');
    return allRows;
  } catch (e) {
    return [];
  }
}

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
    return result;
  } catch (e) {
    throw e;
  }
}

