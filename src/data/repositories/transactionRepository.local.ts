import type { Transaction } from '../../types/transactions';
import type { TransactionRepository } from './transactionRepository';
import { getDb } from '../db/sqlite';

export class LocalTransactionRepository implements TransactionRepository {
  async create(transaction: Transaction) {
    const db = await getDb();
    await db.executeSql(
      'INSERT OR REPLACE INTO transactions (id, type, amount, description, categoryId, date) VALUES (?, ?, ?, ?, ?, ?);',
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.date,
      ],
    );
  }

  async list() {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT
        t.id,
        t.type,
        t.amount,
        t.description,
        t.categoryId,
        t.date,
        c.id as categoryIdRef,
        c.type as categoryType,
        c.name as categoryName,
        c.emoji as categoryEmoji,
        c.isDefault as categoryIsDefault,
        c.labelKey as categoryLabelKey,
        c.createdAt as categoryCreatedAt
      FROM transactions t
      LEFT JOIN categories c ON c.id = t.categoryId
      ORDER BY t.date DESC;`,
    );

    const rows = result.rows;
    const items: Transaction[] = [];

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows.item(i);
      const category =
        row.categoryIdRef
          ? {
              id: row.categoryIdRef,
              type: row.categoryType,
              name: row.categoryName,
              emoji: row.categoryEmoji,
              isDefault: Boolean(row.categoryIsDefault),
              labelKey: row.categoryLabelKey,
              createdAt: row.categoryCreatedAt,
            }
          : undefined;

      items.push({
        id: row.id,
        type: row.type,
        amount: row.amount,
        description: row.description,
        categoryId: row.categoryId,
        date: row.date,
        category,
      });
    }

    return items;
  }
}
