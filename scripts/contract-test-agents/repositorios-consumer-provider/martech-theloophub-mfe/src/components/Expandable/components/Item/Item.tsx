import { ReactNode, useMemo } from 'react';

import { BigNumber, BigNumberData } from 'components/deprecated';
import { Expand } from 'components/Expand/Expand';
import { useExpandable } from 'contexts/Expandable';

import {
  StyledItemButtomContainer,
  StyledItemCard,
  StyledItemHeaderContainer,
} from './Item.styles';

export interface ItemProps {
  expand?: 'none' | 'enabled' | 'disabled';
  expandableChildren?: ReactNode;
  colapsedChildren?: ReactNode;
  bigNumberHeaderData?: BigNumberData & {
    targetViewMeasure?: 'collapsed' | 'expanded';
    titleSize?: 'H2' | 'H3' | 'H4' | 'H5';
  };
  bigNumberDivider?: boolean;
  showBigNumber?: boolean;
  id: string;
  expandedHeaderHeight?: string;
  minHeaderHeight?: string;
  headerCustomized?: React.ReactNode;
  minWidth?: string;
  gap?: 'sm' | 'xs';
  borderBottom?: 'hidden';
  showBorder?: boolean;
  dataTestId?: string;
  border?: 'small' | 'medium' | 'large';
  elevated?: 'minimal' | 'medium' | 'large';
}

export const Item = ({
  expand = 'enabled',
  expandableChildren,
  colapsedChildren,
  bigNumberHeaderData,
  bigNumberDivider,
  showBigNumber = true,
  id,
  expandedHeaderHeight = '100px',
  minHeaderHeight = 'min-content',
  headerCustomized,
  minWidth,
  gap,
  borderBottom,
  showBorder = true,
  dataTestId,
  border = 'medium',
  elevated = 'medium',
}: ItemProps) => {
  const context = useExpandable();
  if (!context && expand !== 'none') {
    console.error(
      'Expandable.Item must be used within Expandable.Container with expand active!',
    );
  }

  const { expandedId, toggleExpansion } = context || {};
  const isExpanded = expandedId === id || !context;
  const tooltipLabel = bigNumberHeaderData?.title;

  const bigNumberMemoizedData = useMemo(() => {
    if (!bigNumberHeaderData) return null;

    const { targetViewMeasure, title, measure, tooltipContent } =
      bigNumberHeaderData;
    const shouldShowMeasure =
      !targetViewMeasure ||
      targetViewMeasure === (isExpanded ? 'expanded' : 'collapsed');

    return isExpanded
      ? {
          title,
          measure: shouldShowMeasure ? measure : null,
          titleSize: bigNumberHeaderData?.titleSize,
          tooltipContent,
          dateRefresh: bigNumberHeaderData?.dateRefresh,
        }
      : {
          ...bigNumberHeaderData,
          measure: shouldShowMeasure ? measure : null,
          divider: true,
        };
  }, [bigNumberHeaderData, isExpanded]);

  const testIdToRender = dataTestId || id;

  return (
    <StyledItemCard
      data-testid={testIdToRender}
      border={border}
      elevated={elevated}
      className={`${isExpanded ? 'expanded' : ''}`}
      aria-expanded={isExpanded}
      hide={expand && !isExpanded && expandedId !== null}
      minWidth={minWidth ? Number.parseInt(minWidth) : 250}
      {...(!showBorder && { cardBorder: 'none' })}
    >
      {showBigNumber && (
        <StyledItemHeaderContainer
          style={{
            minHeight: isExpanded ? expandedHeaderHeight : minHeaderHeight,
          }}
          className={`${expand === 'none' ? '' : 'paddingRight'}`}
          isExpanded={isExpanded}
          {...(borderBottom && { borderBottom })}
        >
          {bigNumberHeaderData && (
            <BigNumber
              data={{ ...bigNumberMemoizedData }}
              likeCard={false}
              divider={bigNumberDivider}
              {...(gap && { gap })}
            />
          )}

          {headerCustomized && !bigNumberHeaderData && headerCustomized}

          {expand !== 'none' && (
            <StyledItemButtomContainer isExpanded={isExpanded}>
              <Expand
                value={isExpanded}
                disabled={expand === 'disabled'}
                onValueChange={() => {
                  toggleExpansion(id, isExpanded, tooltipLabel);
                }}
                dataTestId={
                  dataTestId ? `${dataTestId}-expand-button` : undefined
                }
              />
            </StyledItemButtomContainer>
          )}
        </StyledItemHeaderContainer>
      )}

      {isExpanded ? expandableChildren : colapsedChildren}
    </StyledItemCard>
  );
};
