import { FilterValue } from 'models/Filters';
import { getPreviusQuarter } from 'utils/date';
import { formatDateToQuarterYear, formatDateToR12M } from 'utils/format';

const getDate = (dateInput: string | Date, timePeriod: FilterValue) => {
  if (typeof dateInput === 'string') {
    if (timePeriod === 'QTD') {
      return new Date(dateInput);
    } else {
      return parseMonthYearString(dateInput);
    }
  } else {
    return dateInput;
  }
};

export function lastDataRefreshByTimePeriod(
  dateInput?: string | Date,
  timePeriod?: FilterValue,
): string {
  if (!dateInput || !timePeriod) return '';

  if (typeof dateInput === 'object') {
    dateInput = formatarData(dateInput);
  }

  const date = getDate(dateInput, timePeriod);

  if (Number.isNaN(date.getTime())) return '';

  switch (timePeriod) {
    case 'QTD':
      return formatDateToQuarterYear(date);
    case 'R12M':
      return formatDateToR12M(date);
    default:
      return '';
  }
}

function formatarData(dataString: any) {
  const data = new Date(dataString);
  const mes = data.toLocaleString('en-US', { month: 'short' });
  const ano = data.getFullYear();
  return `${mes} - ${ano}`;
}

export function parseMonthYearString(input: string): Date {
  const cleanedInput = input.replace(' - ', ' ');
  const date = new Date(cleanedInput);

  date.setMonth(date.getMonth() + 1);

  return date;
}

export function vsLastYearByTimePeriod(
  dateInput?: string | Date,
  timePeriod?: FilterValue,
): string {
  if (!dateInput || !timePeriod) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  switch (timePeriod) {
    case 'QTD': {
      const previousQuarterDate = getPreviusQuarter(date);
      return formatDateToQuarterYear(previousQuarterDate);
    }
    case 'R12M': {
      const oneYearAgo = new Date(date);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return formatDateToR12M(oneYearAgo, 'vsLastYear');
    }
    default:
      return '';
  }
}
