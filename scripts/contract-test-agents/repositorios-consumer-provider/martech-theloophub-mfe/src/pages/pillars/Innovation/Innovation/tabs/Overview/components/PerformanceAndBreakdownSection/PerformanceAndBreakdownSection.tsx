import { useIntl } from 'react-intl';

import { CalendarClock } from '@hexa-ui/icons';
import { BasicContainer, Tag } from 'components';
import { StyledTooltipContainer } from 'components/TooltipImage/TooltipImage.styles';
import { useLastDataRefresh } from 'contexts';

interface PerformanceAndBreakdownSectionProps {
  dataTestId?: string;
}

export const PerformanceAndBreakdownSection: React.FC<
  PerformanceAndBreakdownSectionProps
> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.innovation;

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.title',
        }),
        tooltip: (
          <div
            style={{ marginTop: '4px' }}
            data-testid={
              dataTestId ? `${dataTestId}-tooltip-wrapper` : undefined
            }
          >
            <StyledTooltipContainer
              style={{
                padding: '8px',
              }}
              data-testid={
                dataTestId ? `${dataTestId}-tooltip-container` : undefined
              }
            >
              {formatMessage({
                id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.tooltip',
              })}
            </StyledTooltipContainer>
          </div>
        ),
        tooltipBackgroundTransparent: true,
        titleSize: 'H2',
        bottomTag: lastDataRefresh ? (
          <Tag Icon={CalendarClock} text={`: ${lastDataRefresh}`} />
        ) : null,
      }}
      layout={{
        border: 'small',
        shadow: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      }}
      dataTestId={dataTestId}
    >
      <></>
    </BasicContainer>
  );
};
