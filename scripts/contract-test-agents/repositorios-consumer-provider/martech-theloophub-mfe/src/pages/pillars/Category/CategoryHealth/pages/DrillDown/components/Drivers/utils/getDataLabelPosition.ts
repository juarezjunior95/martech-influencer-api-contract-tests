import { LabelPosition } from '../drivers.types';

interface ChartScale {
  getPixelForValue: (value: number) => number | null;
}

export interface ChartContext {
  chart: {
    scales: {
      y?: ChartScale;
      y1?: ChartScale;
    };
  };
  dataIndex: number;
}

interface GetDataLabelPositionParams {
  context: ChartContext;
  populationValues: number[];
  iclValues: number[];
  series: 'population' | 'icl';
}

export const getDataLabelPosition = ({
  context,
  populationValues,
  iclValues,
  series,
}: GetDataLabelPositionParams): LabelPosition => {
  const popY = context.chart.scales.y?.getPixelForValue(
    populationValues[context.dataIndex],
  );
  const iclY = context.chart.scales.y1?.getPixelForValue(
    iclValues[context.dataIndex],
  );

  if (popY == null || iclY == null) {
    return series === 'population'
      ? { anchor: 'end', align: 'top' }
      : { anchor: 'start', align: 'bottom' };
  }

  if (series === 'population') {
    return popY <= iclY
      ? { anchor: 'end', align: 'top' }
      : { anchor: 'start', align: 'bottom' };
  }

  return iclY < popY
    ? { anchor: 'end', align: 'top' }
    : { anchor: 'start', align: 'bottom' };
};
