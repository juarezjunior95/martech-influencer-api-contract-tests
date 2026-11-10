import { FALLBACK_VALUE } from './constants';

const filterValidStrings = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is string => typeof v === 'string' && v.trim().length > 0,
  );
};

export const formatArray = (value: unknown): string[] | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const filtered = filterValidStrings(value);
  return filtered.length > 0 ? filtered : null;
};

const textFieldValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return String(value);
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol'
  ) {
    return String(value);
  }

  return FALLBACK_VALUE;
};

export const formatAudienceField = (
  key: string,
  value: unknown,
): { type: 'text' | 'array'; value: string | string[] } => {
  if (key === 'age' || key === 'gender' || key === 'incomeBracket') {
    const formatted = formatArray(value);
    return formatted
      ? { type: 'array', value: formatted }
      : { type: 'text', value: FALLBACK_VALUE };
  }

  return {
    type: 'text',
    value: textFieldValue(value),
  };
};
