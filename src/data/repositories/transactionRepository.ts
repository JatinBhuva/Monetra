import type { Transaction } from '../../types/transactions';
import { LocalTransactionRepository } from './transactionRepository.local';

export type TransactionRepository = {
  create: (transaction: Transaction) => Promise<void>;
  list: (params: { limit: number; offset: number }) => Promise<Transaction[]>;
};

export const transactionRepository: TransactionRepository =
  new LocalTransactionRepository();
