export const ScreenConstants = {
  ROOT_TAB: 'RootTab',
  DASHBOARD_SCREEN: 'DashboardScreen',
  ADD_ACTION: 'AddAction',
  ADD_TRANSACTION_SCREEN: 'AddTransactionScreen',
  TRANSACTIONS_SCREEN: 'TransactionsScreen',
  MONTH_TRANSACTIONS_SCREEN: 'MonthTransactionsScreen',
  ANALYSIS_SCREEN: 'AnalysisScreen',
  ANALYSIS_CATEGORIES_SCREEN: 'AnalysisCategoriesScreen',
  SETTINGS_SCREEN: 'SettingsScreen',
  MANAGE_CATEGORIES_SCREEN: 'ManageCategoriesScreen',
} as const;

export const ApiMethods = {
  GET: 'GET' as const,
  POST: 'POST' as const,
  PUT: 'PUT' as const,
  DELETE: 'DELETE' as const,
};
