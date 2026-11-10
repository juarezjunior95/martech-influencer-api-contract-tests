import { Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components';
import { StyledTooltipContainer } from 'components/TooltipImage/TooltipImage.styles';

import {
  DeepDiveChartHeaderContainer,
  DeepDiveChartHeaderTitleWrapper,
} from './DeepDiveChartHeader.styles';

interface DeepDiveChartHeaderProps {
  title: string;
  connector?: string;
  context?: string;
  measure: string;
  tooltip?: React.ReactNode;
  tooltipTransparent?: boolean;
  dataTestId?: string;
}

export const DeepDiveChartHeader: React.FC<DeepDiveChartHeaderProps> = ({
  title,
  connector,
  context,
  measure,
  tooltip,
  tooltipTransparent = true,
  dataTestId,
}) => {
  const processedTooltip =
    typeof tooltip === 'string'
      ? tooltip
          .split('.')
          .filter((val) => val.trim())
          .map((val) => val.trim() + '.')
          .join('\n')
      : tooltip;

  return (
    <DeepDiveChartHeaderContainer
      data-testid={
        dataTestId
          ? `${dataTestId}-deep-dive-chart-header-container`
          : undefined
      }
    >
      <DeepDiveChartHeaderTitleWrapper
        data-testid={
          dataTestId
            ? `${dataTestId}-deep-dive-chart-header-title-wrapper`
            : undefined
        }
      >
        <Paragraph
          data-testid={
            dataTestId
              ? `${dataTestId}-deep-dive-chart-header-title`
              : undefined
          }
          style={{ fontWeight: 'bold', fontSize: '1rem', fontFamily: 'Barlow' }}
        >
          {title}
        </Paragraph>
        {connector && (
          <Paragraph
            style={{ fontSize: '1rem', fontFamily: 'Barlow' }}
            data-testid={
              dataTestId
                ? `${dataTestId}-deep-dive-chart-header-connector`
                : undefined
            }
          >
            {connector}
          </Paragraph>
        )}
        {context && (
          <Paragraph
            data-testid={
              dataTestId
                ? `${dataTestId}-deep-dive-chart-header-context`
                : undefined
            }
            style={{
              fontWeight: 'bold',
              fontSize: '1rem',
              fontFamily: 'Barlow',
            }}
          >
            {context}
          </Paragraph>
        )}
        <Paragraph
          data-testid={
            dataTestId
              ? `${dataTestId}-deep-dive-chart-header-measure`
              : undefined
          }
          style={{
            fontSize: '0.75rem',
            color: 'rgba(0, 0, 0, .55)',
            fontWeight: '600',
            fontFamily: 'Barlow',
          }}
        >
          {measure}
        </Paragraph>

        {tooltip && (
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            data-testid={
              dataTestId
                ? `${dataTestId}-deep-dive-chart-header-tooltip-container`
                : undefined
            }
          >
            <CustomTooltip
              data-testid={
                dataTestId
                  ? `${dataTestId}-deep-dive-chart-header-tooltip`
                  : undefined
              }
              size="medium"
              backgroundStyle={tooltipTransparent ? 'transparent' : 'default'}
              content={
                <StyledTooltipContainer
                  style={{ whiteSpace: 'pre-line', padding: '8px' }}
                >
                  {processedTooltip}
                </StyledTooltipContainer>
              }
              label={title}
            >
              <Icon
                size="small"
                icon={Info}
                data-testid={
                  dataTestId
                    ? `${dataTestId}-deep-dive-chart-header-tooltip-icon`
                    : undefined
                }
              />
            </CustomTooltip>
          </div>
        )}
      </DeepDiveChartHeaderTitleWrapper>
    </DeepDiveChartHeaderContainer>
  );
};
