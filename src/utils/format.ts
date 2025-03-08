/**
 * Converts lovelace (smallest unit) to ADA with proper formatting
 * @param lovelace - Amount in lovelace (1 ADA = 1,000,000 lovelace)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string with ADA amount
 */
export const toAda = (lovelace: number | string, decimals: number = 2): string => {
  const amount = Number(lovelace) / 1_000_000;
  // Set decimals to 0 if amount is equal to zero
  if (amount === 0) {
    decimals = 0;
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats an ADA amount with symbol and optional prefix/suffix
 * @param lovelace - Amount in lovelace
 * @param options - Formatting options
 * @returns Formatted ADA string
 */
export const formatAda = (
  lovelace: number | string,
  options: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
    showSymbol?: boolean;
  } = {}
): string => {
  const {
    prefix = '',
    suffix = '',
    decimals = 2,
    showSymbol = true,
  } = options;

  const amount = toAda(lovelace, decimals);
  const symbol = showSymbol ? '₳' : '';
  
  return `${prefix}${symbol}${amount}${suffix}`;
};

/**
 * Shortens large ADA amounts (e.g., 1,234,567 -> 1.23M)
 * @param lovelace - Amount in lovelace
 * @returns Shortened ADA amount with appropriate suffix
 */
export const shortenAda = (lovelace: number | string): string => {
  const ada = Number(lovelace) / 1_000_000;
  
  if (ada >= 1_000_000) {
    return formatAda((ada / 1_000_000).toFixed(2), { suffix: 'M' });
  }
  if (ada >= 1_000) {
    return formatAda((ada / 1_000).toFixed(2), { suffix: 'K' });
  }
  return formatAda(lovelace);
}; 