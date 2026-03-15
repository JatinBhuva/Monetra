import { useCallback, useEffect } from 'react';

import { loadTransactionsRequested } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const { items, status, isRefreshing, isLoadingMore, hasMore } =
    useAppSelector(state => state.transactions);

  useEffect(() => {
    dispatch(loadTransactionsRequested());
  }, [dispatch]);

  useEffect(() => {
    console.log('[Transactions] Loaded items:', items);
  }, [items]);

  const refresh = useCallback(() => {
    dispatch(loadTransactionsRequested({ refresh: true }));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isRefreshing || status === 'loading') {
      return;
    }
    dispatch(loadTransactionsRequested({ loadMore: true }));
  }, [dispatch, hasMore, isLoadingMore, isRefreshing, status]);

  return {
    items,
    status,
    isRefreshing,
    isLoadingMore,
    hasMore,
    refresh,
    loadMore,
  };
};
