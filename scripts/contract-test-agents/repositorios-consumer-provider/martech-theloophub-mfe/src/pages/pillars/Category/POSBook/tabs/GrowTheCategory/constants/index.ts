import { POSBookViewType } from '../types';

export const POS_BOOK_VIEW_MAP: Record<string, POSBookViewType> = {
  country: 'ByCountry',
  cohort: 'ByCohort',
  'maturity-zone': 'ByZoneMaturity',
};

export const DEFAULT_COHORT = 'All';
export const TRANSLATION_KEY_PREFIX = 'Category.POSBook.GrowTheCategory';

export const COHORTS_KEY = 'cohorts-grow';
export const POS_KPI_KEY = 'pos_kpi';
export const DEFAULT_POS_KPI = 'participation';

export const VIEW_TYPES = {
  COUNTRY: 'country',
  COHORT: 'cohort',
  MATURITY_ZONE: 'maturity-zone',
} as const;
