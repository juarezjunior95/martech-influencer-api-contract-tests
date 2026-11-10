import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer, Skeleton } from 'components';
import { FilterSkeleton } from 'components/SubFilter/components/FilterSkeleton/FilterSkeleton';
import { TableDataType } from 'components/Table/types';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import { BRAND_ANALYSIS_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandAnalysis/constants';
import { BrandPowerData } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';
import { StyledTooltip } from 'shared/Styles';

import { powerKpiConfigs } from '../../constants';
import { KpiRequestResponse, SectionProps } from '../../types';
import { applyCompetitorConfigs, getChartList } from '../../utils';
import { getBipTableConfig } from '../../utils/bipTableConfig';
import { BipTable } from '../BipTable/BipTable';
import { Chart } from '../Chart/Chart';
import { ImageryQuestionsSelect } from './components/ImageryQuestionsSelect';

type ImageriesSectionProps = Pick<SectionProps, 'quarterYearSelected'> & {
  kpiConfig: typeof powerKpiConfigs;
  imageriesKpiResponse: KpiRequestResponse<Record<string, unknown>>;
  bipKpiResponse: KpiRequestResponse<Record<string, unknown>>;
  dataTestId?: string;
};
type BipKpiData = { bip: TableDataType & { empty?: boolean } };

export const ImageriesSection: React.FC<ImageriesSectionProps> = ({
  quarterYearSelected,
  imageriesKpiResponse,
  bipKpiResponse,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const {
    activeSubFilters,
    subFiltersLoaded,
    subFiltersData,
    setSubFilterValue,
    loadSubFilterData,
  } = useSubFilters();
  const { applied } = usePageFilterApplied(BRAND_ANALYSIS_PAGE_NAME);

  const [imageriesData, setImageriesData] = useState<BrandPowerData>(null);
  const [bipData, setBipData] = useState<BipKpiData['bip']>(null);

  const imageriesKpi = imageriesKpiResponse;
  const bipKpi = bipKpiResponse;

  useEffect(() => {
    if (!applied?.country || !applied?.brands_abi) return;

    loadSubFilterData(
      'imagery-questions',
      {
        'imagery-questions[country]': applied.country,
        'imagery-questions[subbrand]': applied.brands_abi,
      },
      'imagery_questions',
    );
  }, [applied?.country, applied?.brands_abi, loadSubFilterData]);

  useEffect(() => {
    if (imageriesKpi.loading) return;

    const rawData = imageriesKpi.kpiData as unknown as BrandPowerData;

    if (!rawData || rawData?.empty === true) return setImageriesData(null);

    setImageriesData(
      applyCompetitorConfigs(rawData, String(applied?.time_frame)),
    );
  }, [imageriesKpi.loading, imageriesKpi.kpiData, applied?.time_frame]);

  useEffect(() => {
    if (bipKpi.loading) return;

    const rawData = bipKpi.kpiData as unknown as BipKpiData['bip'];

    if (!rawData || rawData?.empty === true) return setBipData(null);

    setBipData(rawData);
  }, [bipKpi.loading, bipKpi.kpiData]);

  const bipTableConfig = useMemo(() => {
    return getBipTableConfig(
      activeSubFilters.competitor_brands === 'Competitor',
    );
  }, [activeSubFilters.competitor_brands]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: powerKpiConfigs.imageries.title,
          defaultMessage: 'Imageries',
        }),
        tooltip: (
          <StyledTooltip size="small">
            {formatMessage({
              id: powerKpiConfigs.imageries.tooltip.content,
              defaultMessage: '',
            })}
          </StyledTooltip>
        ),
        titleSize: 'H4',
        measure: `[${formatMessage({
          id: powerKpiConfigs.imageries.measure,
          defaultMessage: '',
        })}]`,
        rightContent: (
          <>
            {subFiltersLoaded.imagery_questions ? (
              <ImageryQuestionsSelect
                activeSubFilters={activeSubFilters}
                setSubFilterValue={setSubFilterValue}
                subFiltersData={subFiltersData}
              />
            ) : (
              <FilterSkeleton />
            )}
          </>
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
        loading={imageriesKpi.loading || !subFiltersLoaded.imagery_questions}
        chartList={getChartList(imageriesData, quarterYearSelected)}
      />

      {bipKpi.loading ? (
        <Skeleton width="100%" height="300px" length={1} borderRadius="none" />
      ) : (
        bipData && <BipTable data={bipData} config={bipTableConfig} />
      )}
    </BasicContainer>
  );
};
