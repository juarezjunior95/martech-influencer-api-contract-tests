export interface BubbleChartData {
  yAxis: { min: number; max: number };
  info: { label: string };
  backgroundChart: {
    backgrounds: BackgroundItem[];
    borderColorBubbleHover?: string;
  };

  label?: LabelItem[];
  caption: {
    title: string;
    subtitle: string;
    data: CaptionItem[];
  };
  datasets: { bubbles: BubblePoint[] }[];
}

export interface BubblePoint {
  y: number;
  r: number;
  tooltip: string;
  pointStyle?: string;
  backgroundColor: string;
  hoverBackgroundColor?: string;
}

export interface CaptionItem {
  color: string;
  value: string;
  unit_of_measure: string;
}

export interface BackgroundItem {
  from: number;
  to: number;
  color: string;
  hoverColor?: string;
}

export interface LabelItem {
  text?: string;
  image?: string;
}
