import React from 'react';

import { Divider, Paragraph } from '@hexa-ui/components';

import {
  VariationCaptionData,
  VariationValue,
  VariationValueData,
} from './types';
import * as S from './VariationCaption.styles';

interface VariationCaptionProps {
  variationCaptionData: VariationCaptionData[];
  gridColumnsCount: number;
  paddingLeft?: number;
  paddingRight?: number;
  headerMarginLeft?: number;
  dividerPaddingRight?: number;
  columnGap?: number;
  rowGap?: number;
  dataTestId?: string;
}

export const VariationCaption = ({
  variationCaptionData,
  gridColumnsCount,
  paddingLeft = 20,
  paddingRight = 15,
  headerMarginLeft = 0,
  dividerPaddingRight = 0,
  columnGap = 5,
  rowGap = 5,
  dataTestId,
}: VariationCaptionProps) => {
  const renderVariationValue = (value: VariationValue, divider = false) => (
    <S.StyledParagraph style={{ color: value?.color }} divider={divider}>
      {value?.value}
      {Number.isFinite(Number(value?.value)) && value?.unit_of_measure}
    </S.StyledParagraph>
  );

  const renderCellContent = (cellData: VariationValueData) => {
    if (!cellData) return null;

    if (Array.isArray(cellData)) {
      const size = cellData.length;

      return (
        <S.StyledVariationValueContainer
          style={{
            gridTemplateColumns: `repeat(${cellData.length}, 1fr)`,
          }}
        >
          {cellData.map((v, idx) => (
            <S.StyledVariationValue
              key={[v.value, v.unit_of_measure, v.color ?? ''].join('|')}
            >
              {renderVariationValue(v, size > 1 && idx < size - 1)}
            </S.StyledVariationValue>
          ))}
        </S.StyledVariationValueContainer>
      );
    }

    return renderVariationValue(cellData);
  };

  return (
    <S.StyledVariationGrid
      data-testid={dataTestId}
      style={{
        gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
      }}
    >
      {variationCaptionData?.map((caption, captionIndex) => (
        <React.Fragment key={`caption-${caption.title}-${caption.subtitle}`}>
          {(caption.title || caption.subtitle) && (
            <S.StyledVariationHeaderRow
              data-testid={
                dataTestId ? `${dataTestId}-header-${captionIndex}` : undefined
              }
            >
              <S.StyledVariationHeaderContent
                style={{ marginLeft: headerMarginLeft }}
              >
                <Paragraph>{caption.title}</Paragraph>
                <Paragraph>{caption.subtitle}</Paragraph>
              </S.StyledVariationHeaderContent>

              <S.StyledVariationHeaderDivider
                style={{ paddingRight: dividerPaddingRight }}
              >
                <Divider orientation="horizontal" />
              </S.StyledVariationHeaderDivider>
            </S.StyledVariationHeaderRow>
          )}

          {caption.label && (
            <S.StyledVariationHeaderRow>
              <Paragraph size="xsmall" style={{ color: '#0000008c' }}>
                {caption.label}
              </Paragraph>
            </S.StyledVariationHeaderRow>
          )}

          {Array.from({ length: gridColumnsCount }).map((_, itemIndex) => {
            const cellData = caption.data?.[itemIndex];

            return cellData ? (
              <S.StyledVariationCell
                key={`variation-${captionIndex}-${itemIndex}`}
                isFirstCell={itemIndex === 0}
                hasDivider={!Array.isArray(cellData) || cellData.length == 1}
                data-testid={
                  dataTestId
                    ? `${dataTestId}-cell-${captionIndex}-${itemIndex}`
                    : undefined
                }
              >
                {renderCellContent(cellData)}
              </S.StyledVariationCell>
            ) : (
              <div key={`variation-${captionIndex}-${itemIndex}`}></div>
            );
          })}
        </React.Fragment>
      ))}
    </S.StyledVariationGrid>
  );
};
