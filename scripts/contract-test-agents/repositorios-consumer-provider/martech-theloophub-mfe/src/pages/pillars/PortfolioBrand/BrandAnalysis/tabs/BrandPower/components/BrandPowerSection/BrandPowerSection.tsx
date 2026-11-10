import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { BasicContainer } from 'components';
import { usePageFilterApplied } from 'hooks';
import { SourceTooltipContent } from 'pages/pillars/PortfolioBrand/BrandAnalysis/components';
import { BRAND_ANALYSIS_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandAnalysis/constants';
import { BrandPowerData } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';
import { StyledTooltip } from 'shared/Styles';

import { powerKpiConfigs } from '../../constants';
import { KpiRequestResponse, SectionProps } from '../../types';
import { getChartList } from '../../utils';
import { Chart } from '../Chart/Chart';

type BrandPowerSectionProps = SectionProps & {
  kpisConfig: typeof powerKpiConfigs;
  kpiResponse: KpiRequestResponse<BrandPowerData>;
  dataTestId?: string;
};

export const BrandPowerSection: React.FC<BrandPowerSectionProps> = ({
  quarterYearSelected,
  setQuarterYearSelected,
  kpisConfig,
  kpiResponse,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { isGlobalZone } = usePageFilterApplied(BRAND_ANALYSIS_PAGE_NAME);

  const quarterYearOptions = [
    {
      label: formatMessage({
        id: 'Label.quarter',
        defaultMessage: 'Quarter',
      }),
      value: 'quarter',
    },
    {
      label: formatMessage({
        id: 'Label.year',
        defaultMessage: 'Year',
      }),
      value: 'year',
    },
  ];

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: isGlobalZone
            ? kpisConfig.power.titleAllBrands
            : kpisConfig.power.title,
          defaultMessage: 'Brand Power',
        }),
        tooltip: (
          <StyledTooltip size="small">
            {formatMessage({
              id: kpisConfig.power.tooltip.content,
              defaultMessage: '',
            })}
            <br />
            <SourceTooltipContent
              source={kpisConfig.power.tooltip.source}
              refresh={kpisConfig.power.tooltip.refresh}
            />
          </StyledTooltip>
        ),
        titleSize: 'H3',
        measure: `[${formatMessage({
          id: kpisConfig.power.measure,
          defaultMessage: '',
        })}]`,
        rightContent: (
          <SegmentedControl
            options={quarterYearOptions}
            value={quarterYearSelected}
            onValueChange={setQuarterYearSelected}
          />
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
        loading={kpiResponse.loading}
        chartList={getChartList(kpiResponse.kpiData, quarterYearSelected)}
      />
    </BasicContainer>
  );
};
