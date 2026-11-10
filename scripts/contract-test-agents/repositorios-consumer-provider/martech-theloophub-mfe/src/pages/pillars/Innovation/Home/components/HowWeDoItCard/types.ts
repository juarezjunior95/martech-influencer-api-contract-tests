import type { BigNumberData } from 'components/BigNumber/types';

/** Shape of `innovation-home-big-numbers` (How we do it) from the BFF. */
export type HowWeDoItSection = {
  title: string;
  period: string;
  measure?: string;
  bigNumberData: BigNumberData[];
  chartLineData?: number[];
};

export interface HowWeDoItCardProps {
  titleId: string;
  descriptionId: string;
  section: HowWeDoItSection | null;
  loading: boolean;
  error: Error | null;
  minHeight?: string;
  dataTestId?: string;
}
