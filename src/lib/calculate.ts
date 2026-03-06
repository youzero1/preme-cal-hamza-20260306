export type CalculatorState = {
  display: string;
  expression: string;
  result: string;
  hasResult: boolean;
  error: string | null;
};

export const initialState: CalculatorState = {
  display: '0',
  expression: '',
  result: '',
  hasResult: false,
  error: null,
};

export function formatNumber(num: number): string {
  if (!isFinite(num)) return 'Error';
  const str = num.toString();
  if (str.includes('e')) return str;
  const parts = str.split('.');
  if (parts[0].length > 12) {
    return num.toPrecision(8);
  }
  return str;
}

export function evaluateExpression(expression: string): number {
  // Replace display operators with JS operators
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  // Basic safety check
  if (!/^[0-9+\-*/.() ]+$/.test(sanitized)) {
    throw new Error('Invalid expression');
  }

  // Check for division by zero
  if (/\/\s*0(?![0-9])/.test(sanitized)) {
    throw new Error('Division by zero');
  }

  // eslint-disable-next-line no-new-func
  const result = Function('"use strict"; return (' + sanitized + ')')();

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }

  return result;
}

export type ButtonType = 'number' | 'operator' | 'function' | 'equals' | 'clear';

export interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  wide?: boolean;
}

export const buttons: CalcButton[] = [
  { label: 'C', value: 'clear', type: 'clear' },
  { label: '+/-', value: 'toggle', type: 'function' },
  { label: '%', value: 'percent', type: 'function' },
  { label: '÷', value: '÷', type: 'operator' },

  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '×', type: 'operator' },

  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '−', type: 'operator' },

  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },

  { label: '⌫', value: 'backspace', type: 'function' },
  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'equals' },
];
