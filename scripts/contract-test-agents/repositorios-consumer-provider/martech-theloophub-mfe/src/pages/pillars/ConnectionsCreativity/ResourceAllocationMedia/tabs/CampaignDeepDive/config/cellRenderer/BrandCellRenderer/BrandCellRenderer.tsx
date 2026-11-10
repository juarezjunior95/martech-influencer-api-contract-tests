import React from 'react';

import { GroupCellRendererParams } from 'ag-grid-community';
import { CustomTooltip } from 'components';
import { TableCellType } from 'components/Table/types';
import { StyledBlackTooltipContainer } from 'shared/Styles';

import {
  StyledBorderLeft,
  StyledContainer,
  StyledFallback,
  StyledImg,
  StyledImgContainer,
  StyledImgContent,
} from './BrandCellRenderer.styles';

export const BrandCellRenderer = (
  params: GroupCellRendererParams,
): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const field = params.colDef.field;
  const config = params.data[field + '_config'] as TableCellType;
  const brandName = String(config?.value || '').trim();
  const imageUrl = config?.src;

  const isImageAvailable = Boolean(imageUrl);

  const handleRowHover = React.useCallback((isHovering: boolean) => {
    const rowElement = ref.current?.closest('.ag-row');
    if (rowElement) {
      rowElement.classList.toggle('row-hover', isHovering);
    }
  }, []);
  return (
    <StyledContainer
      className="ag-cell-content"
      onMouseEnter={() => handleRowHover(true)}
      onMouseLeave={() => handleRowHover(false)}
      ref={ref}
    >
      {brandName ? (
        <StyledImgContainer hasPortolioColor={!!config.portfolio}>
          <StyledBorderLeft
            portfolioColor={config.portfolio}
            aria-hidden="true"
          />
          <StyledImgContent hasPortolioColor={!!config.portfolio}>
            <CustomTooltip
              backgroundStyle="transparent"
              content={
                <StyledBlackTooltipContainer className="tooltip-text">
                  {config.value}
                </StyledBlackTooltipContainer>
              }
            >
              <>
                {isImageAvailable ? (
                  <StyledImg
                    src={imageUrl || ''}
                    alt={`${config.value} brand logo`}
                  />
                ) : (
                  <StyledFallback>{config.value}</StyledFallback>
                )}
              </>
            </CustomTooltip>
          </StyledImgContent>
        </StyledImgContainer>
      ) : (
        <StyledFallback>{config.value}</StyledFallback>
      )}
    </StyledContainer>
  );
};
