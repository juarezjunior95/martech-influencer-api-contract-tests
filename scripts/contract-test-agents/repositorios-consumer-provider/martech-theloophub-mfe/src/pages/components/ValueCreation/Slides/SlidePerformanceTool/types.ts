import { BigNumberData } from 'components/BigNumber/types';
import { IChartHeaderProps } from 'components/ChartHeader/types/interface';
import { UseBffDataResponse } from 'hooks';
import { LineBarChartsSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';

export interface BigNumberDataHeader {
  title: string;
  measure?: string;
}

export interface BigNumberDataSlide {
  header: BigNumberDataHeader;
  data: BigNumberData[];
}

export interface SlidePerformanceToolProps {
  bignumberHeaderConfig?: NonNullable<IChartHeaderProps['config']>;
  bigNumberData?: BigNumberDataSlide[];
  bigNumberRequest: UseBffDataResponse;
  lineBarChartsData?: LineBarChartsSectionData;
  lineBarChartsRequest: UseBffDataResponse;
}
