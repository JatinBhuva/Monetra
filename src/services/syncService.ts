import { getDb, resetDatabase } from '../data/db/sqlite';
import type { Category } from '../types/categories';
import type { Investment } from '../types/investments';
import type { Transaction } from '../types/transactions';
import { categorySeeds } from '../utils/categorySeeds';
import {
  getLastSyncedUserId,
  requireCurrentAuthUserId,
  setLastSyncedUserId,
} from './authService';
import { supabase } from './supabase';

type RemoteCategoryRow = {
  owner_id: string;
  id: string;
  type: Category['type'];
  name: string;
  emoji: string;
  is_default: boolean;
  label_key: string | null;
  created_at: string;
};

type RemoteTransactionRow = {
  owner_id: string;
  id: string;
  type: Transaction['type'];
  amount: string;
  description: string;
  category_id: string;
  date: string;
  category_json: string | null;
};

type RemotePreferenceRow = {
  owner_id: string;
  key: string;
  value: string;
};

type RemoteInvestmentRow = {
  owner_id: string;
  id: string;
  type: Investment['type'];
  amount: string;
  date: string;
  policy_number: string | null;
  policy_start_date: string | null;
  note: string | null;
  created_at: string;
};

type SyncEntityType = 'transaction' | 'category' | 'preference' | 'investment';
type SyncOperation = 'upsert' | 'delete';

type SyncQueueItem = {
  queueKey: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  payload: string;
  createdAt: string;
};

let isFlushingQueue = false;

const buildCategoryRow = (
  authUserId: string,
  category: Category,
): RemoteCategoryRow => ({
  owner_id: authUserId,
  id: category.id,
  type: category.type,
  name: category.name,
  emoji: category.emoji,
  is_default: category.isDefault,
  label_key: category.labelKey ?? null,
  created_at: category.createdAt,
});

const buildTransactionRow = (
  authUserId: string,
  transaction: Transaction,
): RemoteTransactionRow => ({
  owner_id: authUserId,
  id: transaction.id,
  type: transaction.type,
  amount: transaction.amount,
  description: transaction.description,
  category_id: transaction.categoryId,
  date: transaction.date,
  category_json: transaction.category ? JSON.stringify(transaction.category) : null,
});

const buildInvestmentRow = (
  authUserId: string,
  investment: Investment,
): RemoteInvestmentRow => ({
  owner_id: authUserId,
  id: investment.id,
  type: investment.type,
  amount: investment.amount,
  date: investment.date,
  policy_number: investment.policyNumber ?? null,
  policy_start_date: investment.policyStartDate ?? null,
  note: investment.note?.trim() || null,
  created_at: investment.createdAt,
});

const enqueueSyncItem = async (item: {
  queueKey: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  payload: unknown;
}) => {
  const db = await getDb();
  await db.executeSql(
    `INSERT OR REPLACE INTO sync_queue
      (queueKey, entityType, entityId, operation, payload, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);`,
    [
      item.queueKey,
      item.entityType,
      item.entityId,
      item.operation,
      JSON.stringify(item.payload),
      new Date().toISOString(),
    ],
  );
};

const removeSyncItem = async (queueKey: string) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM sync_queue WHERE queueKey = ?;', [queueKey]);
};

const listQueuedSyncItems = async () => {
  const db = await getDb();
  const [result] = await db.executeSql(
    `SELECT queueKey, entityType, entityId, operation, payload, createdAt
     FROM sync_queue
     ORDER BY createdAt ASC;`,
  );

  const items: SyncQueueItem[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    items.push(result.rows.item(i) as SyncQueueItem);
  }

  return items;
};

const upsertRemoteTransaction = async (
  authUserId: string,
  transaction: Transaction,
) => {
  const { error } = await supabase
    .from('app_transactions')
    .upsert(buildTransactionRow(authUserId, transaction), {
      onConflict: 'owner_id,id',
    });

  if (error) {
    throw new Error(error.message);
  }
};

const upsertRemoteCategory = async (authUserId: string, category: Category) => {
  const { error } = await supabase
    .from('app_categories')
    .upsert(buildCategoryRow(authUserId, category), {
      onConflict: 'owner_id,id',
    });

  if (error) {
    throw new Error(error.message);
  }
};

const deleteRemoteCategory = async (authUserId: string, id: string) => {
  const { error } = await supabase
    .from('app_categories')
    .delete()
    .eq('owner_id', authUserId)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

const upsertRemotePreference = async (
  authUserId: string,
  key: string,
  value: string,
) => {
  const { error } = await supabase.from('app_preferences').upsert(
    {
      owner_id: authUserId,
      key,
      value,
    },
    { onConflict: 'owner_id,key' },
  );

  if (error) {
    throw new Error(error.message);
  }
};

const upsertRemoteInvestment = async (
  authUserId: string,
  investment: Investment,
) => {
  const { error } = await supabase
    .from('app_investments')
    .upsert(buildInvestmentRow(authUserId, investment), {
      onConflict: 'owner_id,id',
    });

  if (error) {
    throw new Error(error.message);
  }
};

const applyQueuedSyncItem = async (
  authUserId: string,
  item: SyncQueueItem,
) => {
  const payload = JSON.parse(item.payload);

  if (item.entityType === 'transaction' && item.operation === 'upsert') {
    await upsertRemoteTransaction(authUserId, payload as Transaction);
    return;
  }

  if (item.entityType === 'category' && item.operation === 'upsert') {
    await upsertRemoteCategory(authUserId, payload as Category);
    return;
  }

  if (item.entityType === 'category' && item.operation === 'delete') {
    await deleteRemoteCategory(authUserId, payload.id as string);
    return;
  }

  if (item.entityType === 'preference' && item.operation === 'upsert') {
    await upsertRemotePreference(
      authUserId,
      payload.key as string,
      payload.value as string,
    );
    return;
  }

  if (item.entityType === 'investment' && item.operation === 'upsert') {
    await upsertRemoteInvestment(authUserId, payload as Investment);
  }
};

const pushLocalSnapshotToRemote = async (authUserId: string) => {
  const db = await getDb();

  const [categoriesResult] = await db.executeSql(
    'SELECT id, type, name, emoji, isDefault, labelKey, createdAt FROM categories;',
  );
  const categories: Category[] = [];
  for (let i = 0; i < categoriesResult.rows.length; i += 1) {
    const row = categoriesResult.rows.item(i);
    categories.push({
      id: row.id,
      type: row.type,
      name: row.name,
      emoji: row.emoji,
      isDefault: Boolean(row.isDefault),
      labelKey: row.labelKey,
      createdAt: row.createdAt,
    });
  }

  const [transactionsResult] = await db.executeSql(
    'SELECT id, type, amount, description, categoryId, date, categoryJson FROM transactions;',
  );
  const transactions: Transaction[] = [];
  for (let i = 0; i < transactionsResult.rows.length; i += 1) {
    const row = transactionsResult.rows.item(i);
    transactions.push({
      id: row.id,
      type: row.type,
      amount: row.amount,
      description: row.description,
      categoryId: row.categoryId,
      date: row.date,
      category: row.categoryJson ? JSON.parse(row.categoryJson) : undefined,
    });
  }

  const [preferencesResult] = await db.executeSql(
    'SELECT key, value FROM preferences;',
  );
  const preferences: RemotePreferenceRow[] = [];
  for (let i = 0; i < preferencesResult.rows.length; i += 1) {
    const row = preferencesResult.rows.item(i);
    preferences.push({
      owner_id: authUserId,
      key: row.key,
      value: row.value,
    });
  }

  const [investmentsResult] = await db.executeSql(
    'SELECT id, type, amount, date, policyNumber, policyStartDate, note, createdAt FROM investments;',
  );
  const investments: Investment[] = [];
  for (let i = 0; i < investmentsResult.rows.length; i += 1) {
    const row = investmentsResult.rows.item(i);
    investments.push({
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

  if (categories.length > 0) {
    const { error } = await supabase
      .from('app_categories')
      .upsert(categories.map(item => buildCategoryRow(authUserId, item)), {
        onConflict: 'owner_id,id',
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  if (transactions.length > 0) {
    const { error } = await supabase
      .from('app_transactions')
      .upsert(transactions.map(item => buildTransactionRow(authUserId, item)), {
        onConflict: 'owner_id,id',
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  if (preferences.length > 0) {
    const { error } = await supabase.from('app_preferences').upsert(preferences, {
      onConflict: 'owner_id,key',
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  if (investments.length > 0) {
    const { error } = await supabase
      .from('app_investments')
      .upsert(investments.map(item => buildInvestmentRow(authUserId, item)), {
        onConflict: 'owner_id,id',
      });

    if (error) {
      throw new Error(error.message);
    }
  }
};

const fetchRemoteSnapshot = async (authUserId: string) => {
  const [
    { data: categories, error: categoriesError },
    { data: transactions, error: transactionsError },
    { data: preferences, error: preferencesError },
    { data: investments, error: investmentsError },
  ] = await Promise.all([
    supabase
      .from('app_categories')
      .select('*')
      .eq('owner_id', authUserId)
      .order('name', { ascending: true }),
    supabase
      .from('app_transactions')
      .select('*')
      .eq('owner_id', authUserId)
      .order('date', { ascending: false }),
    supabase.from('app_preferences').select('*').eq('owner_id', authUserId),
    supabase
      .from('app_investments')
      .select('*')
      .eq('owner_id', authUserId)
      .order('date', { ascending: false }),
  ]);

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  if (transactionsError) {
    throw new Error(transactionsError.message);
  }

  if (preferencesError) {
    throw new Error(preferencesError.message);
  }

  if (investmentsError) {
    throw new Error(investmentsError.message);
  }

  return {
    categories: (categories ?? []) as RemoteCategoryRow[],
    transactions: (transactions ?? []) as RemoteTransactionRow[],
    preferences: (preferences ?? []) as RemotePreferenceRow[],
    investments: (investments ?? []) as RemoteInvestmentRow[],
  };
};

const replaceLocalSnapshot = async (snapshot: {
  categories: RemoteCategoryRow[];
  transactions: RemoteTransactionRow[];
  preferences: RemotePreferenceRow[];
  investments: RemoteInvestmentRow[];
}) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM categories;');
  await db.executeSql('DELETE FROM transactions;');
  await db.executeSql('DELETE FROM preferences;');
  await db.executeSql('DELETE FROM investments;');

  for (const category of snapshot.categories) {
    await db.executeSql(
      'INSERT OR REPLACE INTO categories (id, type, name, emoji, isDefault, labelKey, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        category.id,
        category.type,
        category.name,
        category.emoji,
        category.is_default ? 1 : 0,
        category.label_key,
        category.created_at,
      ],
    );
  }

  for (const transaction of snapshot.transactions) {
    await db.executeSql(
      'INSERT OR REPLACE INTO transactions (id, type, amount, description, categoryId, date, categoryJson) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        transaction.id,
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.category_id,
        transaction.date,
        transaction.category_json,
      ],
    );
  }

  for (const preference of snapshot.preferences) {
    await db.executeSql(
      'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);',
      [preference.key, preference.value],
    );
  }

  for (const investment of snapshot.investments) {
    await db.executeSql(
      `INSERT OR REPLACE INTO investments
      (id, type, amount, date, policyNumber, policyStartDate, note, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        investment.id,
        investment.type,
        investment.amount,
        investment.date,
        investment.policy_number,
        investment.policy_start_date,
        investment.note,
        investment.created_at,
      ],
    );
  }
};

const seedDefaultCategoriesIfNeeded = async (authUserId: string) => {
  const db = await getDb();
  const [result] = await db.executeSql('SELECT COUNT(*) as count FROM categories;');
  const count = Number(result.rows.item(0).count ?? 0);

  if (count > 0) {
    return;
  }

  for (const seed of categorySeeds) {
    await db.executeSql(
      'INSERT OR REPLACE INTO categories (id, type, name, emoji, isDefault, labelKey, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [
        seed.id,
        seed.type,
        seed.name,
        seed.emoji,
        seed.isDefault ? 1 : 0,
        seed.labelKey ?? null,
        seed.createdAt,
      ],
    );
  }

  const { error } = await supabase
    .from('app_categories')
    .upsert(categorySeeds.map(item => buildCategoryRow(authUserId, item)), {
      onConflict: 'owner_id,id',
    });

  if (error) {
    throw new Error(error.message);
  }
};

const tryRemoteWrite = async (work: () => Promise<void>, queueOnFailure: () => Promise<void>) => {
  try {
    await work();
  } catch {
    await queueOnFailure();
  }
};

export const flushPendingSyncQueue = async () => {
  if (isFlushingQueue) {
    return;
  }

  isFlushingQueue = true;

  try {
    const authUserId = await requireCurrentAuthUserId();
    const items = await listQueuedSyncItems();

    for (const item of items) {
      await applyQueuedSyncItem(authUserId, item);
      await removeSyncItem(item.queueKey);
    }
  } finally {
    isFlushingQueue = false;
  }
};

export const syncCurrentUserData = async () => {
  const authUserId = await requireCurrentAuthUserId();
  const lastSyncedUserId = await getLastSyncedUserId();

  if (lastSyncedUserId && lastSyncedUserId !== authUserId) {
    await resetDatabase();
  }

  await flushPendingSyncQueue();
  await pushLocalSnapshotToRemote(authUserId);
  const remoteSnapshot = await fetchRemoteSnapshot(authUserId);
  await replaceLocalSnapshot(remoteSnapshot);
  await seedDefaultCategoriesIfNeeded(authUserId);
  await setLastSyncedUserId(authUserId);
};

export const syncTransactionToRemote = async (transaction: Transaction) => {
  const queueKey = `transaction:${transaction.id}`;

  await tryRemoteWrite(
    async () => {
      const authUserId = await requireCurrentAuthUserId();
      await upsertRemoteTransaction(authUserId, transaction);
      await removeSyncItem(queueKey);
    },
    () =>
      enqueueSyncItem({
        queueKey,
        entityType: 'transaction',
        entityId: transaction.id,
        operation: 'upsert',
        payload: transaction,
      }),
  );
};

export const syncCategoryUpsertToRemote = async (category: Category) => {
  const queueKey = `category:${category.id}`;

  await tryRemoteWrite(
    async () => {
      const authUserId = await requireCurrentAuthUserId();
      await upsertRemoteCategory(authUserId, category);
      await removeSyncItem(queueKey);
    },
    () =>
      enqueueSyncItem({
        queueKey,
        entityType: 'category',
        entityId: category.id,
        operation: 'upsert',
        payload: category,
      }),
  );
};

export const syncCategoryDeleteToRemote = async (id: string) => {
  const queueKey = `category:${id}`;

  await tryRemoteWrite(
    async () => {
      const authUserId = await requireCurrentAuthUserId();
      await deleteRemoteCategory(authUserId, id);
      await removeSyncItem(queueKey);
    },
    () =>
      enqueueSyncItem({
        queueKey,
        entityType: 'category',
        entityId: id,
        operation: 'delete',
        payload: { id },
      }),
  );
};

export const syncPreferenceToRemote = async (key: string, value: string) => {
  const queueKey = `preference:${key}`;

  await tryRemoteWrite(
    async () => {
      const authUserId = await requireCurrentAuthUserId();
      await upsertRemotePreference(authUserId, key, value);
      await removeSyncItem(queueKey);
    },
    () =>
      enqueueSyncItem({
        queueKey,
        entityType: 'preference',
        entityId: key,
        operation: 'upsert',
        payload: { key, value },
      }),
  );
};

export const syncInvestmentUpsertToRemote = async (investment: Investment) => {
  const queueKey = `investment:${investment.id}`;

  await tryRemoteWrite(
    async () => {
      const authUserId = await requireCurrentAuthUserId();
      await upsertRemoteInvestment(authUserId, investment);
      await removeSyncItem(queueKey);
    },
    () =>
      enqueueSyncItem({
        queueKey,
        entityType: 'investment',
        entityId: investment.id,
        operation: 'upsert',
        payload: investment,
      }),
  );
};
