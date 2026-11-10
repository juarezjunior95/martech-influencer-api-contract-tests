import { CaptionItem, Legend } from 'components/Chart/components/Legend/Legend';
import { ComparisonLine } from 'components/ComparisonLine';

import { CHART_RIGHT_MARGIN, CHART_Y_AXIS_OFFSET } from '../constants';
import { StackedArea } from '../StackedArea';
import { StackedAreaProps } from '../types';
import {
  StyledChartWrapper,
  StyledLegendWrapper,
} from './StackedAreaBody.styles';

export const StackedAreaBody: React.FC<StackedAreaProps> = ({
  data,
  ...props
}) => {
  const legendItems: CaptionItem[] | undefined = data.legends?.map(
    (label, index) => ({
      label,
      color: data.colors[index] || '#000',
      pointStyle: 'roundedRectangle',
    }),
  );

  return (
    <StyledChartWrapper>
      {legendItems && (
        <StyledLegendWrapper>
          <Legend caption={legendItems} legendPosition="center" />
        </StyledLegendWrapper>
      )}
      <StackedArea data={data} {...props} />
      {data.comparisonLine && (
        <ComparisonLine
          data={data.comparisonLine}
          gridColumnsLength={data.columns.length}
          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
          borderConfig={{
            marginLeft: CHART_Y_AXIS_OFFSET,
            marginRight: CHART_RIGHT_MARGIN,
          }}
        />
      )}
    </StyledChartWrapper>
  );
};
