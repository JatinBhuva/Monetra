export const INVESTMENT_TYPES = [
  'mutual_fund',
  'public_provident_fund',
  'stock_market',
  'life_insurance',
  'fixed_deposit',
] as const;

export type InvestmentType = (typeof INVESTMENT_TYPES)[number];

export type Investment = {
  id: string;
  type: InvestmentType;
  amount: string;
  date: string;
  policyNumber?: string | null;
  policyStartDate?: string | null;
  note?: string;
  createdAt: string;
};
