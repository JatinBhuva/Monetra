import { getDb } from '../db/sqlite';
import type { PreferencesRepository } from './preferencesRepository';

export class LocalPreferencesRepository implements PreferencesRepository {
  async get(key: string) {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT value FROM preferences WHERE key = ? LIMIT 1;',
      [key],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows.item(0).value as string;
  }

  async set(key: string, value: string) {
    const db = await getDb();
    await db.executeSql(
      'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);',
      [key, value],
    );
  }
}
