import React from 'react';

import {
  StyledBigNumberCard,
  StyledBigNumberContainer,
  StyledBigNumberContentBody,
  StyledBigNumberContentHeader,
  StyledDivider,
} from './BigNumber.styles';
import { BigNumberContent, BigNumberNoData } from './components';
import {
  BigNumberAlignment,
  BigNumberData,
  BigNumberOrientation,
  BigNumberSize,
  BigNumberSpacing,
  EmptyStateConfig,
} from './types';

const BIG_NUMBER_PROP_KEYS = [
  'header',
  'data',
  'asCard',
  'orientation',
  'size',
  'spacing',
  'alignment',
  'onClick',
  'isSelected',
  'fullWidth',
  'emptyStateMessage',
  'emptyStateIcon',
  'emptyStateConfig',
  'dataTestId',
  'preserveComparisonSpace',
  'enableTruncation',
] as const;

export type BigNumberProps = {
  header?: React.ReactNode;
  data: BigNumberData[];
  asCard?: boolean;
  orientation?: BigNumberOrientation;
  size?: BigNumberSize;
  spacing?: BigNumberSpacing;
  alignment?: BigNumberAlignment;
  onClick?: () => void;
  isSelected?: boolean;
  fullWidth?: boolean;
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
  emptyStateConfig?: EmptyStateConfig;
  dataTestId?: string;
  preserveComparisonSpace?: boolean;
  enableTruncation?: boolean;
  footer?: React.ReactElement;
} & Omit<
  React.ComponentPropsWithoutRef<'div'>,
  (typeof BIG_NUMBER_PROP_KEYS)[number]
>;

export const BigNumber = ({
  header,
  data,
  asCard,
  orientation = 'vertical',
  size = 'medium',
  spacing = 'loose',
  alignment = 'left',
  onClick,
  isSelected,
  fullWidth = false,
  emptyStateMessage,
  emptyStateIcon,
  emptyStateConfig,
  dataTestId,
  preserveComparisonSpace = false,
  enableTruncation = false,
  className,
  footer,
  ...rest
}: BigNumberProps) => {
  const hasData = data.length > 0;
  const containerClassName = [
    isSelected ? 'selected' : '',
    'bigNumberContainer',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const cardClassName = [
    isSelected ? 'selected' : '',
    'bigNumberCard',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <StyledBigNumberContainer
      {...(asCard ? {} : rest)}
      orientation={orientation}
      clickeable={!!onClick && hasData}
      onClick={hasData ? onClick : undefined}
      spacing={spacing}
      className={containerClassName}
      data-testid={
        dataTestId ? `card-bignumber-${dataTestId}` : rest['data-testid']
      }
    >
      {header && (
        <StyledBigNumberContentHeader
          orientation={orientation}
          data-testid={
            dataTestId ? `card-bignumber-${dataTestId}-header` : undefined
          }
        >
          {header}
        </StyledBigNumberContentHeader>
      )}
      {orientation === 'horizontal' && <StyledDivider />}
      <StyledBigNumberContentBody
        orientation={orientation}
        data-testid={
          dataTestId ? `card-bignumber-${dataTestId}-body` : undefined
        }
      >
        {hasData ? (
          <BigNumberContent
            data={data}
            size={size}
            spacing={spacing}
            alignment={alignment}
            orientation={orientation}
            preserveComparisonSpace={preserveComparisonSpace}
            enableTruncation={enableTruncation}
            dataTestId={
              dataTestId ? `card-bignumber-${dataTestId}-content` : undefined
            }
          />
        ) : (
          <BigNumberNoData
            orientation={orientation}
            text={emptyStateMessage}
            emptyStateIcon={emptyStateIcon}
            emptyStateConfig={emptyStateConfig}
            dataTestId={
              dataTestId ? `card-bignumber-${dataTestId}-no-data` : undefined
            }
          />
        )}
        {footer && <div>{footer}</div>}
      </StyledBigNumberContentBody>
    </StyledBigNumberContainer>
  );

  if (asCard)
    return (
      <StyledBigNumberCard
        {...rest}
        border="medium"
        elevated="medium"
        clickeable={!!onClick && hasData}
        className={cardClassName}
        fullWidth={fullWidth}
        data-testid={
          dataTestId
            ? `card-bignumber-${dataTestId}-wrapper`
            : rest['data-testid']
        }
      >
        {content}
      </StyledBigNumberCard>
    );

  return content;
};
