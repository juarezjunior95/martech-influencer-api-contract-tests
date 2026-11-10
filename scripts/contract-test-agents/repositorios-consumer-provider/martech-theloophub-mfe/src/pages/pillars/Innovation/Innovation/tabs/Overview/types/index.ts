import { BigNumberData } from 'components/BigNumber/types';
import { ConnectorPluginProps } from 'components/Chart/plugins';
import { BaseChartComponentProps } from 'components/Chart/types';
import { ComparisonLineData } from 'components/ComparisonLine/ComparisonLine';

export interface BigNumbersItem {
  id?: string;
  hasDeepDive?: boolean;
  colorIndicator?: string;
  period?: string;
  data: BigNumberData[];
}

export interface StrategicInnovationData {
  id: string;
  headerColor?: string;
  empty?: boolean;
  health?: StrategicInnovationHealthData;
  chartSection: StrategicInnovationChartSectionData;
  noticeMessage?: string;
}

export interface StrategicInnovationChartSectionData {
  bigNumber?: BigNumbersItem;
  chart?: ChartData;
}

export interface StrategicInnovationHealthData {
  id: string;
  period: string;
  bigNumbers?: BigNumbersItem[];
  legend?: {
    label: string;
    color?: string;
  }[];
}

interface ChartData extends BaseChartComponentProps {
  datasetsSum?: number[];
  connector?: ConnectorPluginProps;
  comparisonLine?: ComparisonLineData;
}
