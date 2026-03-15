import type { Transaction } from '../../types/transactions';
import type { TransactionRepository } from './transactionRepository';
import { getDb } from '../db/sqlite';

export class LocalTransactionRepository implements TransactionRepository {
  async create(transaction: Transaction) {
    const db = await getDb();
    await db.executeSql(
      'INSERT OR REPLACE INTO transactions (id, type, amount, description, categoryId, date, categoryJson) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.categoryId,
        transaction.date,
        transaction.category ? JSON.stringify(transaction.category) : null,
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
        t.categoryJson,
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
      let category: Transaction['category'];
      if (row.categoryJson) {
        try {
          category = JSON.parse(row.categoryJson);
        } catch {
          category = undefined;
        }
      } else if (row.categoryIdRef) {
        category = {
          id: row.categoryIdRef,
          type: row.categoryType,
          name: row.categoryName,
          emoji: row.categoryEmoji,
          isDefault: Boolean(row.categoryIsDefault),
          labelKey: row.categoryLabelKey,
          createdAt: row.categoryCreatedAt,
        };
      }

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
