import { TableDataType } from 'components/Table/types';

export type POSBookViewType =
  'ByCohort' | 'ByCountry' | 'ByZoneMaturity' | 'global-brands';

export type ParticipationViewType = 'country' | 'maturity-zone' | 'cohort';

export interface BffGrowTheCategoryData {
  participation: TableDataType;
}
