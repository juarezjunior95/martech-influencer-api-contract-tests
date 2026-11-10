import { TableDataType } from 'components/Table/types';
import {
  BarChartKpiData,
  BigNumbersKpiData,
  LineChartKpiData,
  WaterfallChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';
import { PortfolioPerformanceFooter } from 'pages/pillars/ValueCreation/VolumePages/types/portfolioPerformance';

import {
  CountryBrandChartMock,
  GlobalBrandChartMock,
  GlobalCountryChartMock,
  GlobalMovesBarChartMock,
  LeadPremiumGlobalBrand,
} from './BarChart';
import { GlobalBigNumbersMock } from './BigNumber/global';
import { GlobalChartMock, GlobalMovesLineChartMock } from './LineChart';
import {
  BeyondBeerTableMock,
  GlobalBrandsTableMock,
  GlobalPortfolioTableMock,
  GlobalPrioritiesTableMock,
  GrowthLeversTableMock,
  PortfolioPerformanceTableMock,
} from './Table';
import { PortfolioPerformanceFooterMock } from './TableFooter/portfolioPerformance';
import {
  GlobalBrandsWaterfallChartMock,
  GlobalWaterfallChartMock,
  GrowthLeversWaterfallChartMock,
} from './Waterfall';

export * from './DataHelper/comparisonHelper';
export * from './DataHelper/tableHelper';

export { brandsSlideDataMock } from './BrandsSlide/brandsSlideData';
export { globalSlideDataMock } from './globalSlideData';

export interface GlobalSlideMocks {
  bigNumbers: BigNumbersKpiData[];
  globalLineChart: LineChartKpiData;
  movesLineChart: LineChartKpiData;
  globalCountryBarChart: BarChartKpiData;
  globalMovesBarChart: BarChartKpiData;
  globalBrandBarChart: BarChartKpiData;
  countryBrandBarChart: BarChartKpiData;
  globalPrioritiesTable: TableDataType;
  globalPortfolioTable: TableDataType;
  globalBeyondBeerTable?: TableDataType;
  portfolioTable?: TableDataType;
  portfolioFooter?: PortfolioPerformanceFooter[];
  globalBrandsTable?: TableDataType;
  globalWaterfallChart?: WaterfallChartKpiData;
  globalBrandsWaterfallChart?: WaterfallChartKpiData;
  growthLeversWaterfallChart?: WaterfallChartKpiData;
}

export const GlobalMockData: GlobalSlideMocks = {
  bigNumbers: GlobalBigNumbersMock,
  globalLineChart: GlobalChartMock,
  movesLineChart: GlobalMovesLineChartMock,
  globalCountryBarChart: GlobalCountryChartMock,
  globalMovesBarChart: GlobalMovesBarChartMock,
  globalBrandBarChart: GlobalBrandChartMock,
  countryBrandBarChart: CountryBrandChartMock,
  globalPrioritiesTable: GrowthLeversTableMock,
  globalPortfolioTable: GlobalPortfolioTableMock,
  portfolioTable: PortfolioPerformanceTableMock,
  portfolioFooter: PortfolioPerformanceFooterMock,
  globalWaterfallChart: GlobalWaterfallChartMock,
  growthLeversWaterfallChart: GrowthLeversWaterfallChartMock,
};

export const GrowthLeversMockData: GlobalSlideMocks = {
  bigNumbers: GlobalBigNumbersMock,
  globalLineChart: GlobalChartMock,
  movesLineChart: GlobalMovesLineChartMock,
  globalCountryBarChart: GlobalCountryChartMock,
  globalMovesBarChart: GlobalMovesBarChartMock,
  globalBrandBarChart: LeadPremiumGlobalBrand,
  countryBrandBarChart: CountryBrandChartMock,
  globalPrioritiesTable: GlobalPrioritiesTableMock,
  globalPortfolioTable: GlobalPortfolioTableMock,
  globalBrandsTable: GlobalBrandsTableMock,
  globalBeyondBeerTable: BeyondBeerTableMock,
  globalWaterfallChart: GlobalWaterfallChartMock,
  globalBrandsWaterfallChart: GlobalBrandsWaterfallChartMock,
  growthLeversWaterfallChart: GrowthLeversWaterfallChartMock,
};
