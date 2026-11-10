import type { BigNumberData } from 'components/BigNumber/types';
import type { IChartHeaderProps } from 'components/ChartHeader/types/interface';

export interface StrategyDriverCardData {
  chartHeader: Pick<IChartHeaderProps, 'title' | 'period'>;
  bigNumberData: BigNumberData[];
  noticeMessage?: string;
}

export interface StrategyDriverCardProps {
  data?: StrategyDriverCardData;
  tooltip?: string;
  isExportPage?: boolean;
}
