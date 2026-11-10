import { Paragraph } from '@hexa-ui/components';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';

import {
  DescriptionText,
  MeasureText,
  StyledActionsContainer,
  StyledChipLabel,
  StyledChipRoot,
  StyledContentContainer,
  StyledHeaderContainer,
  StyledHeaderContent,
  StyledIconInfo,
  StyledRowContainer,
  StyledTitle,
  StyledTitleContainer,
  StyledTopRightChipRoot,
} from './ChartHeader.styles';
import { IChartHeaderProps } from './types/interface';

const alignmentMap = {
  left: 'flex-start',
  center: 'center',
};

export const ChartHeader = ({
  title,
  measure,
  info,
  period,
  description,
  actions,
  config,
  dataTestId,
  tooltipSize = 'small',
}: IChartHeaderProps) => {
  const isInline = config?.inline && config.inline !== 'none';
  const isVerticalInline = isInline && config.inline === 'vertical';
  const measureSize = config?.type === 'large' ? 'small' : 'xsmall';
  const isPeriodTopRight = config?.periodPosition === 'top-right';
  const isTooltipFloat = config?.tooltipPosition === 'float';

  return (
    <StyledHeaderContainer
      data-testid={dataTestId}
      border="medium"
      elevated="medium"
      float={config?.float}
      inline={isInline}
    >
      <StyledHeaderContent
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        <StyledContentContainer
          inline={isInline}
          isVerticalInline={isVerticalInline}
          style={{
            alignItems: alignmentMap[config?.alignment] ?? 'flex-start',
          }}
        >
          <StyledRowContainer inline={isInline}>
            <StyledTitleContainer
              vertical={config?.inline === 'vertical'}
              style={{
                display: 'flex',
                flexDirection: config?.inline === 'vertical' ? 'column' : 'row',
                alignItems: 'center',
              }}
            >
              <StyledTitle
                size={config?.type}
                data-testid={dataTestId ? `${dataTestId}-title` : undefined}
              >
                {title}
              </StyledTitle>
              {measure && (
                <MeasureText
                  size={measureSize}
                  isVertical={config?.inline === 'vertical'}
                  data-testid={dataTestId ? `${dataTestId}-measure` : undefined}
                >
                  {measure}
                </MeasureText>
              )}
            </StyledTitleContainer>
            {info && (
              <CustomTooltip
                content={<Paragraph>{info}</Paragraph>}
                size={tooltipSize}
                dataTestId={dataTestId ? `${dataTestId}-tooltip` : undefined}
              >
                <StyledIconInfo
                  data-testid={
                    dataTestId ? `${dataTestId}-tooltip-icon` : undefined
                  }
                  icon={Info}
                  size="large"
                  style={
                    isTooltipFloat
                      ? { position: 'absolute', right: '-8px', top: '-13px' }
                      : undefined
                  }
                />
              </CustomTooltip>
            )}
          </StyledRowContainer>
          {period && !isPeriodTopRight && (
            <StyledChipRoot
              disabled
              noMargin={isVerticalInline}
              data-testid={dataTestId ? `${dataTestId}-period` : undefined}
            >
              <StyledChipLabel>{period}</StyledChipLabel>
            </StyledChipRoot>
          )}
          {description && (
            <DescriptionText
              size="xsmall"
              data-testid={dataTestId ? `${dataTestId}-description` : undefined}
            >
              {description}
            </DescriptionText>
          )}
        </StyledContentContainer>
        {period && isPeriodTopRight && (
          <StyledTopRightChipRoot
            disabled
            data-testid={
              dataTestId ? `${dataTestId}-period-top-right` : undefined
            }
          >
            <StyledChipLabel>{period}</StyledChipLabel>
          </StyledTopRightChipRoot>
        )}
        {actions && (
          <StyledActionsContainer
            data-testid={dataTestId ? `${dataTestId}-actions` : undefined}
          >
            {actions.map((actionComponent) => actionComponent)}
          </StyledActionsContainer>
        )}
      </StyledHeaderContent>
    </StyledHeaderContainer>
  );
};
