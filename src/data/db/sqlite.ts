import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'monetra.db';
const DB_LOCATION = 'default';
const SCHEMA_VERSION = 1;

let dbPromise: Promise<any> | null = null;

const getDatabase = () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION });
  }
  return dbPromise;
};

const getUserVersion = async (db: any) => {
  const [result] = await db.executeSql('PRAGMA user_version;');
  if (result?.rows?.length > 0) {
    return Number(result.rows.item(0).user_version ?? 0);
  }
  return 0;
};

const setUserVersion = async (db: any, version: number) => {
  await db.executeSql(`PRAGMA user_version = ${version};`);
};

const migrate = async (db: any) => {
  const currentVersion = await getUserVersion(db);

  if (currentVersion < 1) {
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        amount TEXT NOT NULL,
        description TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        date TEXT NOT NULL
      );`,
    );
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL,
        isDefault INTEGER NOT NULL,
        labelKey TEXT,
        createdAt TEXT NOT NULL
      );`,
    );

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );`,
    );

    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(categoryId);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON transactions(type, date);',
    );
    await db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_transactions_description ON transactions(description);',
    );
  }

  if (currentVersion < SCHEMA_VERSION) {
    await setUserVersion(db, SCHEMA_VERSION);
  }
};

export const initDatabase = async () => {
  const db = await getDatabase();
  await migrate(db);
};

export const getDb = async () => {
  await initDatabase();
  return getDatabase();
};

export const resetDatabase = async () => {
  const db = await getDatabase();
  await db.executeSql('DROP TABLE IF EXISTS transactions;');
  await db.executeSql('DROP TABLE IF EXISTS categories;');
  await setUserVersion(db, 0);
  await migrate(db);
};
