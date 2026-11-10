import { BigNumberData } from 'components/BigNumber/types';
import { TableDataType } from 'components/Table/types';
import { UseBffDataResponse } from 'hooks';

export interface Empty {
  empty: boolean;
}

export interface BigNumbersKpiData {
  data: BigNumberData[];
  header: {
    title: string;
  };
}

export interface PowerBigNumbersKpiData extends UseBffDataResponse {
  data: {
    'big-numbers-lq': BigNumbersKpiData & Empty;
    'big-numbers-ly': BigNumbersKpiData & Empty;
  };
}

export interface TableKpiData {
  table: TableDataType & Empty;
}

export interface BreakdownTableKpiData {
  table: TableDataType & Empty;
  tableComp: TableDataType & Empty;
}

export interface TableDetailsKpiData {
  performanceDetails: TableDataType & Empty;
}

export interface PowerBookPerformanceData {
  NAZ?: {
    [key: string]: TableDetailsKpiData;
  };
  SAZ?: {
    [key: string]: TableDetailsKpiData;
  };
  MAZ?: {
    [key: string]: TableDetailsKpiData;
  };
  APAC?: {
    [key: string]: TableDetailsKpiData;
  };
  AFR?: {
    [key: string]: TableDetailsKpiData;
  };
  EUR?: {
    [key: string]: TableDetailsKpiData;
  };
  [key: string]: any;
}

export interface InsightSection {
  title: string;
  insights: string[];
}

export interface InsightsByCategory {
  insights?: string | string[];
}
export interface PowerBookInsightsData {
  executive_summary?: {
    ABI?: {
      insights?: InsightSection[];
    };
  };
  evolution?: {
    ABI?: {
      insights?: string[];
      Megabrands?: {
        insights?: string[];
      };
    };
  };
  by_country?: {
    ABI?: InsightsByCategory;
    Segments?: {
      Mainstream?: { Maturity?: InsightsByCategory };
      Core?: { Maturity?: InsightsByCategory };
      Premiumization?: { Maturity?: InsightsByCategory };
    };
    Portfolio?: {
      Megabrands?: {
        Zones?: InsightsByCategory;
        Maturity?: InsightsByCategory;
      };
      Expansion?: { Maturity?: InsightsByCategory };
      Sustain?: { Maturity?: InsightsByCategory };
      Tail?: { Maturity?: InsightsByCategory };
    };
    global_brands?: {
      all_global_brands?: { Maturity?: InsightsByCategory };
      Corona?: { Maturity?: InsightsByCategory };
      Budweiser?: { Maturity?: InsightsByCategory };
      michelob_ultra?: { Maturity?: InsightsByCategory };
      stella_artois?: { Maturity?: InsightsByCategory };
      Heineken?: { Maturity?: InsightsByCategory };
    };
  };
  [key: string]: any;
}

export interface BrandCategory {
  key: string;
  filter: string;
  displayName?: string;
}

export type GlobalSlideType =
  | 'executive-summary'
  | 'evolution'
  | 'by-country'
  | 'performance'
  | 'contribution'
  | 'cover';

interface BaseSlideConfig {
  type: GlobalSlideType;
  section: string;
}

interface ExecutiveSummaryConfig extends BaseSlideConfig {
  type: 'executive-summary';
}

interface EvolutionConfig extends BaseSlideConfig {
  type: 'evolution';
  title: string;
  dataKey: 'global' | string;
  insightsPath?: string;
  portfolioType?: string;
}

interface ByCountryConfig extends BaseSlideConfig {
  type: 'by-country';
  title: string;
  dataKey: string;
  insightsPath?: string;
}

interface PerformanceConfig extends BaseSlideConfig {
  type: 'performance';
  title: string;
  dataKey: string;
  insightsPath?: string;
  isCompetitor?: boolean;
}

interface ContributionConfig extends BaseSlideConfig {
  type: 'contribution';
  title: string;
}

interface CoverConfig extends BaseSlideConfig {
  type: 'cover';
  category: string;
  name: string;
}

export type UnifiedSlideConfig =
  | ExecutiveSummaryConfig
  | EvolutionConfig
  | ByCountryConfig
  | PerformanceConfig
  | ContributionConfig
  | CoverConfig;
