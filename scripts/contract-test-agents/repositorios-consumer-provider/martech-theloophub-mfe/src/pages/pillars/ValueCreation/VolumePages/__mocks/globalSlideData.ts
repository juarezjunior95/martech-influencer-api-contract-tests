import { SlideContentData } from 'pages/components/ValueCreation/Slides/SlideContent/types';

import { GlobalBigNumbersMock } from './BigNumber/global';
import { GlobalChartMock } from './LineChart/global';
import {
  GlobalMarketsTableMock,
  GlobalPortfolioTableMock,
  GlobalPrioritiesTableMock,
} from './Table';

/**
 * Mock de globalSlideData com PreviousYear, CurrentYear e Budget para testes.
 */
export const globalSlideDataMock: SlideContentData & {
  isLoading: boolean;
  hasError: boolean;
} = {
  bigNumbersKpiData: GlobalBigNumbersMock,
  lineChartKpiData: GlobalChartMock,
  portfolioTableKpiData: GlobalPortfolioTableMock,
  prioritiesTableKpiData: GlobalPrioritiesTableMock,
  marketsTableKpiData: GlobalMarketsTableMock,
  isLoading: false,
  hasError: false,
};
