import type { BigNumberData } from 'components/BigNumber/types';

export interface GrowthLeverCardRow {
  label: string;
  bigNumberData: BigNumberData[];
}

export interface GrowthLeverCardData {
  title: string;
  rows: GrowthLeverCardRow[];
  noticeMessage?: string;
}

export interface GrowthLeverCardProps {
  image: string;
  tooltip?: string;
  data?: GrowthLeverCardData;
  active?: boolean;
  isExportPage?: boolean;
}
