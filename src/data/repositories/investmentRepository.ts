import type { Investment, InvestmentType } from '../../types/investments';
import { LocalInvestmentRepository } from './investmentRepository.local';

export type InvestmentRepository = {
  create: (investment: Investment) => Promise<void>;
  listAll: () => Promise<Investment[]>;
  listByDateRange: (params: {
    startDate: string;
    endDate: string;
  }) => Promise<Investment[]>;
  getLastPolicyByType: (type: InvestmentType) => Promise<{
    policyNumber: string | null;
    policyStartDate: string | null;
  } | null>;
  getMonthlyTotal: (params: { startDate: string; endDate: string }) => Promise<number>;
};

export const investmentRepository: InvestmentRepository =
  new LocalInvestmentRepository();
