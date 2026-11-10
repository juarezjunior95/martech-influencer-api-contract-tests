import { SpecialIndexes } from 'components/Chart/Bar/Waterfall/types';
import { ConnectorPluginProps } from 'components/Chart/plugins/ConnectorPlugin';

export interface InnovationComparisonLineDatum {
  value: string | null;
  measure: string;
  color: string;
}

export interface InnovationComparisonLine {
  title: string;
  data: InnovationComparisonLineDatum[];
}

export interface InnovationPerformanceData {
  data: number[];
  labels: string[];
  connector?: ConnectorPluginProps;
  specialIndexes?: SpecialIndexes;
  comparisonLineData: InnovationComparisonLine[];
  brandsImg?: InnovationBrandImage[];
  empty?: boolean;
  clickableIndexes?: { index: number; value: string }[];
}

export interface InnovationBrandImage {
  mainBrand: {
    src: string;
    alt: string;
  };
  title: string;
}
