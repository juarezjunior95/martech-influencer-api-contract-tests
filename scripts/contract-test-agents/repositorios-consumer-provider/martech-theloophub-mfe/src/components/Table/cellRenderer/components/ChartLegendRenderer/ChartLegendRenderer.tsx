import React from 'react';

import { Paragraph } from '@hexa-ui/components';

import {
  StyledColorBox,
  StyledContent,
  StyledLegendGroup,
  StyledLegendItem,
} from './ChartLegendRenderer.styles';

interface ChartLegendRendererProps {
  title: string;
  legend: { color: string; label: string }[];
  dataTestId?: string;
}

export const ChartLengendRenderer = ({
  title,
  legend,
  dataTestId,
}: ChartLegendRendererProps): JSX.Element => {
  return (
    <StyledContent
      data-testid={dataTestId ? `chart-legend-${dataTestId}` : undefined}
    >
      <Paragraph marginHeight={20} size="small" color="primary" weight="medium">
        {title}
      </Paragraph>
      <StyledLegendGroup>
        {legend && legend.length > 0
          ? legend.map((item, index) => (
              <StyledLegendItem
                key={`${item.label}-${index}`}
                data-testid={
                  dataTestId ? `legend-item-${dataTestId}-${index}` : undefined
                }
              >
                <StyledColorBox
                  style={{ backgroundColor: item.color }}
                ></StyledColorBox>
                <span>{item.label}</span>
              </StyledLegendItem>
            ))
          : null}
      </StyledLegendGroup>
    </StyledContent>
  );
};
