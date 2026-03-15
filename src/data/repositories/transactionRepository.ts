import type { Transaction } from '../../types/transactions';
import { LocalTransactionRepository } from './transactionRepository.local';

export type TransactionRepository = {
  create: (transaction: Transaction) => Promise<void>;
  list: () => Promise<Transaction[]>;
};

export const transactionRepository: TransactionRepository =
  new LocalTransactionRepository();
