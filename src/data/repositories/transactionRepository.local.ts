import type { Transaction } from '../../types/transactions';
import type { TransactionRepository } from './transactionRepository';
import { getDb } from '../db/sqlite';
import { syncTransactionToRemote } from '../../services/syncService';

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
    await syncTransactionToRemote(transaction);
  }

  async list(params: { limit: number; offset: number }) {
    const { limit, offset } = params;
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
      ORDER BY t.date DESC
      LIMIT ? OFFSET ?;`,
      [limit, offset],
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

  async listByDateRange(params: {
    startDate: string;
    endDate: string;
    limit?: number;
  }) {
    const db = await getDb();
    const hasLimit = typeof params.limit === 'number';
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
      WHERE t.date >= ? AND t.date < ?
      ORDER BY t.date DESC
      ${hasLimit ? 'LIMIT ?' : ''};`,
      hasLimit
        ? [params.startDate, params.endDate, params.limit]
        : [params.startDate, params.endDate],
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

  async getMonthlyStats(params: { startDate: string; endDate: string }) {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT
        SUM(CASE WHEN type = 'expense' THEN CAST(amount as REAL) ELSE 0 END) as expenseTotal,
        SUM(CASE WHEN type = 'income' THEN CAST(amount as REAL) ELSE 0 END) as incomeTotal,
        COUNT(*) as totalCount
      FROM transactions
      WHERE date >= ? AND date < ?;`,
      [params.startDate, params.endDate],
    );

    const row = result.rows.item(0) ?? {};
    return {
      expenseTotal: Number(row.expenseTotal ?? 0),
      incomeTotal: Number(row.incomeTotal ?? 0),
      count: Number(row.totalCount ?? 0),
    };
  }
}
