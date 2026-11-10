import { BrandsSlideData } from 'pages/pillars/ValueCreation/VolumePages/components/Slides/BrandsSlide/types';

import { GlobalBigNumbersMock } from '../BigNumber/global';
import { GlobalChartMock } from '../LineChart/global';
import { GlobalMarketsTableMock } from '../Table/globalMarkets';
import { brandsSlideBarChartMock } from './brandsSlideBarChart';

export const brandsSlideDataMock: BrandsSlideData = {
  bigNumbersKpiData: GlobalBigNumbersMock,
  lineChartKpiData: GlobalChartMock,
  barChartKpiData: brandsSlideBarChartMock,
  marketsTableKpiData: GlobalMarketsTableMock,
};
