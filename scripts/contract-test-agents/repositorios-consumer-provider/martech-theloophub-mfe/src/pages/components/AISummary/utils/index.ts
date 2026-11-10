import { SummaryBffResponse } from '../types';

export const generateEmptySummary = (message: string): SummaryBffResponse => {
  return {
    resume: message,
    empty: true,
  };
};
