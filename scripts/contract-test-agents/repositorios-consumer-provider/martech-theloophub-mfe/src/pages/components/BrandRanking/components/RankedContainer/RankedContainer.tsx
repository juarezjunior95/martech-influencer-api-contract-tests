import React from 'react';

import { VariationCaption } from 'components/VariationCaption';
import { VariationValueData } from 'components/VariationCaption/types';
import { getVariationColor } from 'utils/getColor';

import { RankedContainerData } from '../../types';
import { RankedVerticalBar } from '../RankedVerticalBar';
import { StyledChartWrapper, StyledContainer } from './RankedContainer.styles';

const extractVariations = (
  variationCaption: RankedContainerData['variation_caption'],
): VariationValueData[] => {
  if (!variationCaption?.variationsRows) {
    return [];
  }

  return Object.values(variationCaption.variationsRows)
    .flatMap((row) => row.data)
    .flatMap((group) =>
      Array.isArray(group?.variationsGroup) ? group.variationsGroup : [],
    )
    .map((v) => ({
      value: v?.variation,
      unit_of_measure: v?.unit_of_measure,
      color: getVariationColor(v?.direction),
    }));
};

export interface RankedContainerProps {
  data: RankedContainerData;
  dataTestId?: string;
  isExport?: boolean;
  getBarColors?: (source: string[]) => string[];
  barThickness?: number;
}

export const RankedContainer: React.FC<RankedContainerProps> = ({
  data,
  dataTestId,
  isExport = false,
  getBarColors,
  barThickness = 40,
}) => {
  return (
    <StyledContainer
      data-testid={dataTestId ? `ranked-container-${dataTestId}` : undefined}
    >
      <StyledChartWrapper
        data-testid={
          dataTestId ? `ranked-chart-wrapper-${dataTestId}` : undefined
        }
      >
        <RankedVerticalBar
          data={data}
          dataTestId={dataTestId ? `${dataTestId}` : undefined}
          isExport={isExport}
          getBarColors={getBarColors}
          barThickness={barThickness}
        />
      </StyledChartWrapper>
      {data.variation_caption && (
        <div style={{ marginLeft: -10 }}>
          <VariationCaption
            variationCaptionData={[
              {
                title: data.variation_caption.title,
                subtitle: data.variation_caption.subtitle,
                data: extractVariations(data.variation_caption),
              },
            ]}
            gridColumnsCount={data.labels.length}
            paddingLeft={6}
            paddingRight={0}
            headerMarginLeft={5}
            dataTestId={
              dataTestId ? `variation-caption-${dataTestId}` : undefined
            }
          />
        </div>
      )}
    </StyledContainer>
  );
};
