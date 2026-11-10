import 'chart.js';
import { ChartType } from 'chart.js';
import {
  ExtendXAxisProps,
  ExtendYAxisProps,
} from 'components/Chart/Bar/SimpleBarChart/plugins/ExtendYAxisPlugin/ExtendYAxisPlugin';
import { MissingDataBarPluginOptions } from 'components/Chart/Bar/SimpleBarChart/plugins/MissingDataBarPlugin/MissingDataBarPlugin';
import { ZeroLabelProps } from 'components/Chart/Bar/SimpleBarChart/plugins/ZeroLabelPlugin/ZeroLabelPlugin';
import {
  ConnectBarsProps,
  CustomGridProps,
  DatalabelWithVariationProps,
  DrawZeroLine,
  EmptyBarOverlayOptions,
  LineChartHighlightProps,
  OffsetFirstTickProps,
  RoudedArrowProps,
  VerticalGuidelinesProps,
} from 'components/Chart/plugins';
import { ConnectorPluginProps } from 'components/Chart/plugins/ConnectorPlugin/types';
import { DrawZeroValueProps } from 'components/Chart/plugins/DrawZeroValue/DrawZeroValue';
import { TotalAllocationPluginOptions } from 'components/Chart/plugins/TotalAllocation/TotalAllocation';
import { WaterfallCutBarsProps } from 'components/Chart/plugins/WaterfallCutBars/WaterfallCutBars';
import type { WaterfallDataLabelProps } from 'components/Chart/plugins/WaterfallDatalabel';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    connectBars?: ConnectBarsProps;
    waterfallCutBars?: WaterfallCutBarsProps;
    waterfallDatalabel?: WaterfallDataLabelProps;
    connector?: ConnectorPluginProps;
    datalabelWithVariation: DatalabelWithVariationProps;
    datalabelWithVariationYAxis: DatalabelWithVariationProps;
    roundedArrow?: RoudedArrowProps;
    verticalGuidelines: VerticalGuidelinesProps;
    customGrid?: CustomGridProps;
    drawZeroValue?: DrawZeroValueProps;
    offsetFirstTick?: OffsetFirstTickProps;
    drawZeroLine?: DrawZeroLine;
    zeroLabel?: ZeroLabelProps;
    extendYAxis?: ExtendYAxisProps;
    extendXAxis?: ExtendXAxisProps;
    lineChartHighlight?: LineChartHighlightProps;
    missingDataBar?: MissingDataBarPluginOptions;
    totalAllocationDatalabel: TotalAllocationPluginOptions;
    emptyBarOverlay: EmptyBarOverlayOptions;
  }
}
