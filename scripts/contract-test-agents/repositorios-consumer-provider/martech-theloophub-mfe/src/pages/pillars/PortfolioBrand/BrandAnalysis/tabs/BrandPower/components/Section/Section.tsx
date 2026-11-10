import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { BasicContainer } from 'components';
import { KpiConfig } from 'pages/types';
import { StyledTooltip } from 'shared/Styles';

import { BrandPowerData } from '../../../../types';
import { KpiRequestResponse, SectionProps } from '../../types';
import { getChartList } from '../../utils';
import { handleExpandSection } from '../../utils/handleExpand';
import { Chart } from '../Chart/Chart';
import { Expand } from '../Expand/Expand';
import { KpiSection } from '../KpiSection/KpiSection';

interface Props extends Pick<SectionProps, 'quarterYearSelected'> {
  name: string;
  mainKpi: KpiConfig;
  secondKpi: KpiConfig;
  thirdKpi: KpiConfig;
  mainKpiResponse: KpiRequestResponse<BrandPowerData>;
  secondKpiResponse: KpiRequestResponse<BrandPowerData>;
  thirdKpiResponse: KpiRequestResponse<BrandPowerData>;
  dataTestId?: string;
}

export const Section: React.FC<Props> = ({
  name,
  mainKpi,
  secondKpi,
  thirdKpi,
  mainKpiResponse,
  secondKpiResponse,
  thirdKpiResponse,
  quarterYearSelected,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();

  const isExpanded = searchParams.get('section') === name;

  const handleExpand = (value: boolean) => {
    handleExpandSection(value, name, setSearchParams, searchParams);
  };

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: mainKpi.title,
          defaultMessage: '',
        }),
        tooltip: (
          <StyledTooltip size="small">
            {formatMessage({
              id: mainKpi.tooltip.content,
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
        loading={mainKpiResponse.loading}
        chartList={getChartList(mainKpiResponse.kpiData, quarterYearSelected)}
      />
      {isExpanded && (
        <>
          <KpiSection
            kpi={secondKpi}
            loading={secondKpiResponse.loading}
            data={getChartList(secondKpiResponse.kpiData, quarterYearSelected)}
          />
          <KpiSection
            kpi={thirdKpi}
            loading={thirdKpiResponse.loading}
            data={getChartList(thirdKpiResponse.kpiData, quarterYearSelected)}
          />
        </>
      )}
    </BasicContainer>
  );
};
