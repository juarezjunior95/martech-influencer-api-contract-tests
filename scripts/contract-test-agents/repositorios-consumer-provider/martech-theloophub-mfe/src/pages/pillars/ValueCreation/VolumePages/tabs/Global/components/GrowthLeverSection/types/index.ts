import {
  GrowthLeverConfig,
  GrowthLeverMainSubFilters,
  GrowthLeverPortfolioConfig,
  TableOrderItem,
} from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/growthLevers';
import { PageInfo } from 'pages/types';

type DtEnd = string | null | undefined;

export interface GrowthLeverSectionMainSubFilters extends Omit<
  GrowthLeverMainSubFilters,
  'bigNumbers' | 'topBottomBrands'
> {
  bigNumbers: GrowthLeverMainSubFilters['bigNumbers'] & { dt_end: DtEnd };
  topBottomBrands: GrowthLeverMainSubFilters['topBottomBrands'] & {
    dt_end: DtEnd;
  };
}

interface GrowthLeverSectionProps {
  leverKey: string;
  config: GrowthLeverConfig;
  period: string;
  dt_end: DtEnd;
  getPageByName: (name: string) => PageInfo | undefined;
  dataTestId?: string;
  mainSubFilters: GrowthLeverSectionMainSubFilters;
  prioritiesPageType: string;
  prioritiesGrowthLever?: string;
  portfolioConfig?: GrowthLeverPortfolioConfig;
  tableOrder?: TableOrderItem[];
}

export type { GrowthLeverSectionProps };
