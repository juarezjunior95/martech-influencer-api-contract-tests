import { Fragment } from 'react/jsx-runtime';

import { Tooltip } from '@hexa-ui/components2';
import {
  StyledBigNumber,
  StyledBigNumberSuffix,
  StyledBigNumberWithSuffix,
  StyledDivider,
} from 'components/BigNumber/BigNumber.styles';
import {
  BigNumberAlignment,
  BigNumberData,
  BigNumberOrientation,
  BigNumberSize,
  BigNumberSpacing,
} from 'components/BigNumber/types';
import { useTruncationDetection } from 'hooks';
import { StyledBlackTooltipContainer } from 'shared/Styles/misc.styles';

import {
  BigNumberAudienceTargeting,
  BigNumberComparison,
  BigNumberSecondaryInfo,
} from '../';
import {
  StyledBigNumberItemContainer,
  StyledBigNumberItemContent,
  StyledBigNumberMainContent,
} from './BigNumberContent.styles';

interface BigNumberContentProps {
  data: BigNumberData[];
  size?: BigNumberSize;
  spacing?: BigNumberSpacing;
  alignment?: BigNumberAlignment;
  orientation?: BigNumberOrientation;
  dataTestId?: string;
  preserveComparisonSpace?: boolean;
  enableTruncation?: boolean;
}

const buildTooltipText = (item: BigNumberData): string => {
  const parts: string[] = [];

  if (item.bigNumber?.value) {
    parts.push(`${item.bigNumber.value}${item.bigNumber.measure || ''}`);
  }

  if (item.comparison?.number?.value) {
    parts.push(
      `${item.comparison.number.value}${item.comparison.number.measure || ''}`,
    );
  }

  return parts.join(' ');
};

const DEFAULT_COLORS_BY_TREND = {
  positive: '#007800',
  negative: '#B91C1C',
};

const getBigNumberDisplayColor = (item: BigNumberData): string => {
  const trend = item.bigNumber?.trend;
  if (trend) {
    return DEFAULT_COLORS_BY_TREND[trend];
  }
  return item.bigNumber?.color || '#141414';
};

interface BigNumberMainContentItemProps {
  item: BigNumberData;
  index: number;
  size?: BigNumberSize;
  preserveComparisonSpace: boolean;
  dataTestId?: string;
}

const BigNumberMainContentItem = ({
  item,
  index,
  size,
  preserveComparisonSpace,
  dataTestId,
}: BigNumberMainContentItemProps) => {
  const numberValue = item.bigNumber?.value || '';

  const {
    ref: containerRef,
    displayText,
    isTruncated,
  } = useTruncationDetection<HTMLDivElement>(numberValue?.toString() || '', {
    mode: 'dynamic',
  });

  const bigNumberColor = getBigNumberDisplayColor(item);

  const tooltipText = buildTooltipText(item);

  const mainContent = (
    <StyledBigNumberMainContent css={{ minWidth: 0 }}>
      {item.bigNumber?.value && (
        <StyledBigNumberWithSuffix ref={containerRef}>
          <StyledBigNumber
            truncatable
            size={size}
            style={{ color: bigNumberColor }}
          >
            {displayText}
          </StyledBigNumber>
          {item.bigNumber.measure && (
            <StyledBigNumberSuffix
              size={size}
              style={{ color: bigNumberColor }}
            >
              {item.bigNumber.measure}
            </StyledBigNumberSuffix>
          )}
        </StyledBigNumberWithSuffix>
      )}
      <BigNumberComparison
        item={item}
        size={size}
        preserveSpace={preserveComparisonSpace}
        dataTestId={
          dataTestId ? `${dataTestId}-item-${index}-comparison` : undefined
        }
      />

      {item.audience && (
        <BigNumberAudienceTargeting
          item={item}
          dataTestId={
            dataTestId ? `${dataTestId}-item-${index}-audience` : undefined
          }
          audienceType={item.audienceType}
        />
      )}
    </StyledBigNumberMainContent>
  );

  if (isTruncated) {
    return (
      <Tooltip
        content={
          <StyledBlackTooltipContainer>
            {tooltipText}
          </StyledBlackTooltipContainer>
        }
        position="top"
      >
        {mainContent}
      </Tooltip>
    );
  }

  return mainContent;
};

interface BigNumberItemPrimaryContentProps {
  enableTruncation: boolean;
  item: BigNumberData;
  index: number;
  size?: BigNumberSize;
  preserveComparisonSpace: boolean;
  dataTestId?: string;
}

const BigNumberItemPrimaryContent = ({
  enableTruncation,
  item,
  index,
  size,
  preserveComparisonSpace,
  dataTestId,
}: BigNumberItemPrimaryContentProps) => {
  if (enableTruncation) {
    return (
      <BigNumberMainContentItem
        item={item}
        index={index}
        size={size}
        preserveComparisonSpace={preserveComparisonSpace}
        dataTestId={dataTestId}
      />
    );
  }

  return (
    <StyledBigNumberMainContent>
      {item.bigNumber?.value && (
        <StyledBigNumber
          size={size}
          style={{ color: getBigNumberDisplayColor(item) }}
        >
          {item.bigNumber.value}
          {item.bigNumber.measure}
        </StyledBigNumber>
      )}
      <BigNumberComparison
        item={item}
        size={size}
        preserveSpace={preserveComparisonSpace}
        dataTestId={
          dataTestId ? `${dataTestId}-item-${index}-comparison` : undefined
        }
      />

      {item.audience && (
        <BigNumberAudienceTargeting
          item={item}
          dataTestId={
            dataTestId ? `${dataTestId}-item-${index}-audience` : undefined
          }
        />
      )}
    </StyledBigNumberMainContent>
  );
};

export const BigNumberContent = ({
  data,
  size,
  spacing,
  alignment,
  orientation,
  dataTestId,
  preserveComparisonSpace = false,
  enableTruncation = false,
}: BigNumberContentProps) => {
  return (
    <StyledBigNumberItemContainer
      orientation={orientation}
      style={
        orientation === 'horizontal'
          ? { gridTemplateColumns: `repeat(${data.length}, 150px)` }
          : undefined
      }
      data-testid={dataTestId ? `${dataTestId}` : undefined}
    >
      {data.map((item, index) => {
        const shouldRenderDivider =
          orientation != 'horizontal' && index < data.length - 1;

        return (
          <Fragment key={`${item.bigNumber?.value}-${index}`}>
            <StyledBigNumberItemContent
              spacing={spacing}
              alignment={alignment}
              orientation={orientation}
              css={enableTruncation ? { minWidth: 0 } : undefined}
            >
              <BigNumberItemPrimaryContent
                enableTruncation={enableTruncation}
                item={item}
                index={index}
                size={size}
                preserveComparisonSpace={preserveComparisonSpace}
                dataTestId={dataTestId}
              />

              <BigNumberSecondaryInfo
                item={item}
                size={size}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-item-${index}-secondary`
                    : undefined
                }
              />
            </StyledBigNumberItemContent>
            {shouldRenderDivider && <StyledDivider />}
          </Fragment>
        );
      })}
    </StyledBigNumberItemContainer>
  );
};
