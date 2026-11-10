import { StackedBarData } from './StackedBar';

export interface CaptionFlag {
  flag: string;
  label: string;
}

export interface KpiContent {
  caption_country_flag: Record<string, CaptionFlag>;
  total_allocation: {
    unit?: string;
    value: (string | number)[][];
  };
  datasets: StackedBarData[];
  labels: string[];
}

interface Content {
  [subKey: string]: KpiContent;
}

export interface ComparisonFilterItem {
  label: string;
  value: string;
}

export interface ResourceAllocationData {
  filter?: ComparisonFilterItem[];
  media?: Content;
  non_working_money?: Content;
  sponsorship_activation?: Content;
  empty?: boolean;
}
