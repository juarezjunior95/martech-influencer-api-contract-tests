import { useIntl } from 'react-intl';

import { Paragraph } from '@hexa-ui/components';
import { BarChart2, Info } from '@hexa-ui/icons2';
import { CustomTooltip, SubFilter } from 'components';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../../../ResourceAllocationMedia';
import {
  RA_BUBBLE_SUBFILTER,
  RA_BUBBLE_SUBFILTER_PRESET,
} from '../../constants';
import { getMediaDrilldownHeaderMessage } from '../../utils/mediaDrilldownHeaderUtils';
import {
  StyledBubbleHeaderContainer,
  StyledBubbleHeaderFilters,
  StyledBubbleHeaderMeasure,
  StyledBubbleHeaderTextBox,
  StyledBubbleHeaderTitle,
  StyledIconInfo,
} from './BubbleChartHeader.styles';

export interface BubbleHeaderProps {
  dataTestId?: string;
}

export const BubbleHeader = ({ dataTestId }: BubbleHeaderProps) => {
  const { formatMessage } = useIntl();

  const { isGlobalZone } = usePageFilterApplied(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );
  const { activeSubFilters } = useSubFilters();

  const headerMessage = getMediaDrilldownHeaderMessage({
    activeSubFilters,
    isGlobalZone,
    formatMessage,
  });

  const processedTooltip =
    typeof headerMessage.tooltip === 'string'
      ? headerMessage.tooltip
          .split('.')
          .filter((val) => val.trim())
          .join('\n')
      : headerMessage.tooltip;

  return (
    <StyledBubbleHeaderContainer
      data-testid={dataTestId ? `bubble-chart-header-${dataTestId}` : undefined}
    >
      <StyledBubbleHeaderTextBox
        data-testid={
          dataTestId ? `bubble-chart-header-text-box-${dataTestId}` : undefined
        }
      >
        {headerMessage.title && (
          <StyledBubbleHeaderTitle
            data-testid={
              dataTestId ? `bubble-chart-header-title-${dataTestId}` : undefined
            }
          >
            {headerMessage.title}
          </StyledBubbleHeaderTitle>
        )}
        {headerMessage.measure && (
          <StyledBubbleHeaderMeasure
            data-testid={
              dataTestId
                ? `bubble-chart-header-measure-${dataTestId}`
                : undefined
            }
          >
            {headerMessage.measure}
          </StyledBubbleHeaderMeasure>
        )}
        {headerMessage.tooltip && (
          <CustomTooltip
            data-testid={
              dataTestId
                ? `${dataTestId}-bubble-chart-header-tooltip`
                : undefined
            }
            content={
              <Paragraph style={{ whiteSpace: 'pre-line' }} size="small">
                {processedTooltip}
              </Paragraph>
            }
            size="large"
          >
            <StyledIconInfo icon={Info} size="large" />
          </CustomTooltip>
        )}
      </StyledBubbleHeaderTextBox>
      <StyledBubbleHeaderFilters
        data-testid={
          dataTestId ? `bubble-chart-header-filters-${dataTestId}` : undefined
        }
      >
        <SubFilter.Select
          name="kpis"
          apiKey={RA_BUBBLE_SUBFILTER_PRESET}
          stateKey={RA_BUBBLE_SUBFILTER}
          dataApiKey="kpis"
          params={{}}
          icon={BarChart2}
          dataTestId={
            dataTestId
              ? `${dataTestId}-${RA_BUBBLE_SUBFILTER}-bubble-chart-header`
              : undefined
          }
        />
      </StyledBubbleHeaderFilters>
    </StyledBubbleHeaderContainer>
  );
};

export default BubbleHeader;
