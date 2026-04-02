import AddIcon from './icons/add.svg';
import AnalysisIcon from './icons/analysis.svg';
import ArrowDownIcon from './icons/arrowDown.svg';
import CheckIcon from './icons/check.svg';
import DashboardIcon from './icons/dashboard.svg';
import ExpenseCardIcon from './icons/expenseCard.svg';
import InsightsGraphIcon from './icons/insightsGraph.svg';
import InvestmentCardIcon from './icons/investmentCard.svg';
import ReceiptListIcon from './icons/receiptList.svg';
import SettingsIcon from './icons/settings.svg';
import TransactionsIcon from './icons/transactions.svg';

export const assets = {
  icons: {
    check: CheckIcon,
    insightsGraph: InsightsGraphIcon,
    receiptList: ReceiptListIcon,
    // Backward-compatible aliases (prefer insightsGraph / receiptList).
    container: InsightsGraphIcon,
    icon: ReceiptListIcon,
    arrowDown: ArrowDownIcon,
    dashboard: DashboardIcon,
    add: AddIcon,
    expenseCard: ExpenseCardIcon,
    investmentCard: InvestmentCardIcon,
    transactions: TransactionsIcon,
    analysis: AnalysisIcon,
    settings: SettingsIcon,
  },
  images: {
    sample: require('./images/sample.png'),
  },
};
