import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { BasicContainer } from 'components';
import { useSubFilters } from 'hooks';
import { ChartData } from 'pages/components/ChartWithCaption/types';
import { PcYearQuarter } from 'pages/pillars/PortfolioBrand/BrandAnalysis/components/PcYearQuarter/PcYearQuarter';
import { KpiConfig } from 'pages/types';
import { StyledTooltip } from 'shared/Styles';

import { BrandPowerData } from '../../../../types';
import { powerKpiConfigs } from '../../constants';
import { KpiRequestResponse, SectionProps } from '../../types';
import { getChartList } from '../../utils';
import { handleExpandSection } from '../../utils/handleExpand';
import { Chart } from '../Chart/Chart';
import { Expand } from '../Expand/Expand';
import { KpiSection } from '../KpiSection/KpiSection';
import { PowerAwarenessFilter } from '../PowerAwarenessFilter/PowerAwarenessFilter';

type SalienceSectionProps = Pick<SectionProps, 'quarterYearSelected'> & {
  kpisConfig: Record<string, KpiConfig>;
  salienceKpiResponse: KpiRequestResponse<BrandPowerData>;
  occasionKpiResponse: KpiRequestResponse<ChartData>;
  powerAwarenessKpiResponses: Record<
    string,
    KpiRequestResponse<BrandPowerData>
  >;
  powerAwarenessSelected: string;
  onPowerAwarenessChange: (value: string) => void;
  dataTestId?: string;
};

const EMPTY_RESPONSE = {
  kpiData: null,
  loading: false,
} as KpiRequestResponse<BrandPowerData>;

export const SalienceSection: React.FC<SalienceSectionProps> = ({
  quarterYearSelected,
  kpisConfig,
  salienceKpiResponse,
  occasionKpiResponse,
  powerAwarenessKpiResponses,
  powerAwarenessSelected,
  onPowerAwarenessChange,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { subFiltersLoaded } = useSubFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const isExpanded = searchParams.get('section') === 'salience';

  const handleExpand = (value: boolean) => {
    handleExpandSection(value, 'salience', setSearchParams, searchParams);
  };

  const pcTimeFrameLoaded =
    quarterYearSelected === 'year'
      ? subFiltersLoaded.pc_time_frame_years
      : subFiltersLoaded.pc_time_frame_quarters;

  const powerAwarenessKey = useMemo(
    () => powerAwarenessSelected.replaceAll('-', '_'),
    [powerAwarenessSelected],
  );

  const powerAwarenessKpiResponse = useMemo(
    () => powerAwarenessKpiResponses?.[powerAwarenessKey] || EMPTY_RESPONSE,
    [powerAwarenessKpiResponses, powerAwarenessKey],
  );

  const powerAwarenessKpiConfig = useMemo(() => {
    const selectedConfig =
      kpisConfig?.[powerAwarenessKey] || kpisConfig.unaided_awareness;

    return {
      ...powerKpiConfigs.powerAwareness,
      title: `${selectedConfig.title}.${powerAwarenessSelected}.title`,
      tooltip: {
        content: `${selectedConfig.tooltip.content}.${powerAwarenessSelected}.tooltip`,
      },
    };
  }, [powerAwarenessKey, powerAwarenessSelected, kpisConfig]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: powerKpiConfigs.salience.title,
          defaultMessage: '',
        }),
        tooltip: (
          <StyledTooltip size="small">
            {formatMessage({
              id: powerKpiConfigs.salience.tooltip.content,
              defaultMessage: '',
            })}
          </StyledTooltip>
        ),
        titleSize: 'H3',
        rightContent: (
          <Expand value={isExpanded} onValueChange={handleExpand} />
        ),
      }}
      layout={{
        bodyPadding: false,
        shadow: 'large',
        border: 'none',
      }}
      dataTestId={dataTestId}
    >
      <Chart
        loading={salienceKpiResponse.loading}
        chartList={getChartList(
          salienceKpiResponse.kpiData,
          quarterYearSelected,
        )}
      />
      {isExpanded && (
        <>
          <KpiSection
            kpi={powerAwarenessKpiConfig}
            loading={powerAwarenessKpiResponse.loading}
            data={getChartList(
              powerAwarenessKpiResponse.kpiData,
              quarterYearSelected,
            )}
            subFilter={
              <PowerAwarenessFilter
                value={powerAwarenessSelected}
                onChange={(op) => onPowerAwarenessChange(op.value as string)}
              />
            }
          />
          <KpiSection
            kpi={powerKpiConfigs.occasion}
            loading={occasionKpiResponse.loading || !pcTimeFrameLoaded}
            data={
              occasionKpiResponse.kpiData ? [occasionKpiResponse.kpiData] : []
            }
            subFilter={
              <div style={{ maxWidth: 'max-content' }}>
                <PcYearQuarter yearQuarterSelected={quarterYearSelected} />
              </div>
            }
          />
        </>
      )}
    </BasicContainer>
  );
};
