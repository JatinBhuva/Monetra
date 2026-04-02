export type CurrencyOption = {
  code: string;
  symbol: string;
  label: string;
};

export const DEFAULT_CURRENCY_CODE = 'INR';

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩', label: 'South Korean Won' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', label: 'Hong Kong Dollar' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', label: 'Danish Krone' },
  { code: 'RUB', symbol: '₽', label: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', label: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
  { code: 'TRY', symbol: '₺', label: 'Turkish Lira' },
  { code: 'PLN', symbol: 'zł', label: 'Polish Zloty' },
  { code: 'THB', symbol: '฿', label: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp', label: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', label: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', label: 'Philippine Peso' },
  { code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
];

export const getCurrencyOption = (code?: string | null): CurrencyOption => {
  if (!code) {
    return CURRENCY_OPTIONS[0];
  }

  return (
    CURRENCY_OPTIONS.find(item => item.code === code.toUpperCase()) ??
    CURRENCY_OPTIONS[0]
  );
};
