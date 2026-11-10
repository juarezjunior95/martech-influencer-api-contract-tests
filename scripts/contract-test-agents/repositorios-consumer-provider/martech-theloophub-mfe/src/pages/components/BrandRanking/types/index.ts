export interface VariationGroup {
  variation: string;
  direction: 'up' | 'down';
  unit_of_measure: string;
}

export interface VariationRow {
  data: {
    variationsGroup: VariationGroup[];
  }[];
}

export interface VariationCaption {
  title: string;
  subtitle: string;
  variationsRows: {
    [key: string]: VariationRow;
  };
}

export interface LegendItem {
  label: string;
  color: string;
}

export interface Dataset {
  data: number[];
  source: string[];
  unitMeasure: string[];
}

export interface RankedContainerData {
  labels: [string, string][];
  datasets: Dataset[];
  legend?: {
    items: LegendItem[];
  };
  variation_caption?: VariationCaption;
}
