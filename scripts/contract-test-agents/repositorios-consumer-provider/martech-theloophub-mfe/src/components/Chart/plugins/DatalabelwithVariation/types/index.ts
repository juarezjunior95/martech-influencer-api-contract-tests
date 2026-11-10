import { Scale } from 'chart.js';
import { BarElement } from 'chart.js/dist';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';

export interface DatalabelWithVariationProps {
  separator: { yAxis: string; xAxis: string };
  label: {
    display: boolean;
    font: string;
    position: 'inside' | 'top';
    fontBold: string;
    textBaseline: CanvasTextBaseline;
    textColor?: string;
    color: {
      inside: string;
      outside: string;
      white: string;
    };
    unitOfMeasure?: string;
  };
  variation: {
    font: string;
    fontBold: string;
    textBaseline: CanvasTextBaseline;
    color: {
      up: string;
      down: string;
    };
  };
  background?: string;
}

export interface LabelData {
  value: string;
  variation: string;
  variationDirection: 'up' | 'down' | undefined;
  label: string;
}

export interface AxisData {
  x: Scale;
  bar: BarElement;
  value: number;
  labelData: LabelData;
  configOptions: _DeepPartialObject<DatalabelWithVariationProps>;
  y: Scale;
  measuredText: {
    width: number;
    height: number;
  };
}
