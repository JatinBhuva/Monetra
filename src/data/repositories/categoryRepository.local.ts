import type { Category } from '../../types/categories';
import type { CategoryRepository } from './categoryRepository';
import { getDb } from '../db/sqlite';
import {
  syncCategoryDeleteToRemote,
  syncCategoryUpsertToRemote,
} from '../../services/syncService';

export class LocalCategoryRepository implements CategoryRepository {
  async listAll() {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT id, type, name, emoji, isDefault, labelKey, createdAt FROM categories ORDER BY name ASC;',
    );

    const rows = result.rows;
    const items: Category[] = [];

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows.item(i);
      items.push({
        id: row.id,
        type: row.type,
        name: row.name,
        emoji: row.emoji,
        isDefault: Boolean(row.isDefault),
        labelKey: row.labelKey,
        createdAt: row.createdAt,
      });
    }

    return items;
  }

  async upsert(category: Category) {
    const db = await getDb();
    await db.executeSql(
      'INSERT OR REPLACE INTO categories (id, type, name, emoji, isDefault, labelKey, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        category.id,
        category.type,
        category.name,
        category.emoji,
        category.isDefault ? 1 : 0,
        category.labelKey ?? null,
        category.createdAt,
      ],
    );
    await syncCategoryUpsertToRemote(category);
  }

  async remove(id: string) {
    const db = await getDb();
    await db.executeSql('DELETE FROM categories WHERE id = ?;', [id]);
    await syncCategoryDeleteToRemote(id);
  }

  async count() {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT COUNT(*) as count FROM categories;',
    );
    return Number(result.rows.item(0).count ?? 0);
  }
}
