import { useEffect } from 'react';

import { loadTransactionsRequested } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.transactions.items);

  useEffect(() => {
    dispatch(loadTransactionsRequested());
  }, [dispatch]);

  useEffect(() => {
    console.log('[Transactions] Loaded items:', items);
  }, [items]);

  return {};
};
