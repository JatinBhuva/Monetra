import { getDb } from '../db/sqlite';
import type { Investment, InvestmentType } from '../../types/investments';
import type { InvestmentRepository } from './investmentRepository';
import { syncInvestmentUpsertToRemote } from '../../services/syncService';

export class LocalInvestmentRepository implements InvestmentRepository {
  async create(investment: Investment) {
    const db = await getDb();
    await db.executeSql(
      `INSERT OR REPLACE INTO investments
      (id, type, amount, date, policyNumber, policyStartDate, note, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        investment.id,
        investment.type,
        investment.amount,
        investment.date,
        investment.policyNumber ?? null,
        investment.policyStartDate ?? null,
        investment.note?.trim() || null,
        investment.createdAt,
      ],
    );
    await syncInvestmentUpsertToRemote(investment);
  }

  async listAll() {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT id, type, amount, date, policyNumber, policyStartDate, note, createdAt
      FROM investments
      ORDER BY date DESC, createdAt DESC;`,
    );

    const items: Investment[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows.item(i);
      items.push({
        id: row.id,
        type: row.type,
        amount: row.amount,
        date: row.date,
        policyNumber: row.policyNumber,
        policyStartDate: row.policyStartDate,
        note: row.note,
        createdAt: row.createdAt,
      });
    }

    return items;
  }

  async listByDateRange(params: { startDate: string; endDate: string }) {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT id, type, amount, date, policyNumber, policyStartDate, note, createdAt
      FROM investments
      WHERE date >= ? AND date < ?
      ORDER BY date DESC, createdAt DESC;`,
      [params.startDate, params.endDate],
    );

    const items: Investment[] = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows.item(i);
      items.push({
        id: row.id,
        type: row.type,
        amount: row.amount,
        date: row.date,
        policyNumber: row.policyNumber,
        policyStartDate: row.policyStartDate,
        note: row.note,
        createdAt: row.createdAt,
      });
    }

    return items;
  }

  async getLastPolicyByType(type: InvestmentType) {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT policyNumber, policyStartDate
      FROM investments
      WHERE type = ?
        AND policyNumber IS NOT NULL
        AND TRIM(policyNumber) <> ''
      ORDER BY date DESC, createdAt DESC
      LIMIT 1;`,
      [type],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows.item(0);
    return {
      policyNumber: (row.policyNumber as string | null) ?? null,
      policyStartDate: (row.policyStartDate as string | null) ?? null,
    };
  }

  async getMonthlyTotal(params: { startDate: string; endDate: string }) {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT SUM(CAST(amount as REAL)) as total
      FROM investments
      WHERE date >= ? AND date < ?;`,
      [params.startDate, params.endDate],
    );

    const row = result.rows.item(0) ?? {};
    return Number(row.total ?? 0);
  }
}
