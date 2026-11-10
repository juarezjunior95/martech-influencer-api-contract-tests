import type { BaseChartComponentProps } from 'components/Chart/types';

export interface SparkLineGradientOptions {
  opacityStart?: number;
  opacityEnd?: number;
}

export interface SparkLineProps extends BaseChartComponentProps {
  labelColors?: string[];
  dataTestId?: string;
  color?: string;
  gradientOptions?: SparkLineGradientOptions;
}
