import { BarY } from 'components/Chart';
import { StyledVariation } from 'shared/Styles';

import { StyledContainer } from './SingleBarWithVariation.styles';

export interface SingleBarChartWithVariationProps {
  chartData: {
    data: number[];
    label: string[];
    backgroundColor: string | string[];
    barThickness?: number;
    unitMeasure?: string;
  };
  variation: {
    variation: number;
    direction: 'red' | 'green';
    unitOfMeasure: string;
  };
  width?: string;
  posKpi?: string;
  columnMaxValue?: number;
  dataTestId?: string;
  formatValueFn?: (value: number) => string;
}

export const SingleBarWithVariation: React.FC<
  SingleBarChartWithVariationProps
> = ({
  chartData,
  variation,
  width = '80%',
  posKpi,
  columnMaxValue,
  formatValueFn,
}) => {
  if (!chartData || !variation) {
    return null;
  }

  const { variation: variationValue, direction, unitOfMeasure } = variation;

  const calculateBarScale = (): number | undefined => {
    if (!posKpi || !['occasions', 'servings'].includes(posKpi.toLowerCase())) {
      return undefined;
    }

    const maxValue = columnMaxValue ?? Math.max(...chartData.data);
    if (maxValue <= 5) {
      return 5;
    }
    return maxValue;
  };

  const barScale = calculateBarScale();

  const formattedVariation = formatValueFn
    ? formatValueFn(variationValue)
    : variationValue;

  return (
    <StyledContainer id="single-bar">
      <div style={{ width: width, height: '32px' }}>
        <BarY
          chartData={{
            ...chartData,
            barThickness: 32,
            label: ['singleBar'],
          }}
          scale={barScale}
          formatValueFn={formatValueFn}
        />
      </div>
      <StyledVariation color={direction}>
        <span>{formattedVariation}</span>
        {unitOfMeasure && <span>{unitOfMeasure}</span>}
      </StyledVariation>
    </StyledContainer>
  );
};
