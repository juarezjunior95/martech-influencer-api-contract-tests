import { useMemo } from 'react';

import { ContentCard } from 'components';
import { usePageFilterApplied } from 'hooks';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';
import { WaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';
import {
  LineBarChartsSectionData,
  WaterfallData,
  WaterfallSectionData,
} from 'pages/pillars/ValueCreation/PerformanceTool/types';

import {
  MARKET_SHARE_COUNTRIES_WITHOUT_BRAND_DATA,
  PERFORMANCE_TOOL_PAGE_NAME,
} from '../../../constants';
import { CoresCompositionSection } from '../../Kpis/Cores/components';
import { LineBarChartsSection, WaterfallSection } from '../Charts';
import { EmptyBrandContributionSection } from '../EmptyBrandContributionSection';
import { StyledSectionsContainer } from './PerformanceSection.styles';

interface PerformanceSectionProps {
  tooltip?: string;
  measure: string;
  lineBarChartsData?: LineBarChartsSectionData;
  waterfallData?: WaterfallSectionData;
  lineBarChartsRequest: UseBffDataResponse;
  waterfallRequest: UseBffDataResponse;
  error?: Error | null;
  waterfallVariant?: 'large' | 'small';
  showDrivers?: boolean;
  waterfallConfig: WaterfallConfig;
  compositionData?: WaterfallData;
  compositionBffData?: UseBffDataResponse;
  showCompositionSection?: boolean;
  showLineDataLabels?: boolean;
}

const PERFORMANCE_TOOL_KPIS = {
  power: 'Brand Power',
  volume: 'Volume',
  nr: 'Net Revenue',
  market_share: 'Market Share',
  cores: 'CORES',
};

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  tooltip,
  measure,
  lineBarChartsData,
  waterfallData,
  lineBarChartsRequest,
  waterfallRequest,
  waterfallVariant = 'large',
  showDrivers = false,
  waterfallConfig,
  compositionData,
  compositionBffData,
  showCompositionSection = false,
  showLineDataLabels = true,
}) => {
  const { applied } = usePageFilterApplied(PERFORMANCE_TOOL_PAGE_NAME);

  const kpi = useMemo(() => {
    return applied.kpis as keyof typeof PERFORMANCE_TOOL_KPIS;
  }, [applied.kpis]);

  const title = useMemo(() => {
    if (kpi) return `${PERFORMANCE_TOOL_KPIS[kpi]} Performance`;
    return `Performance`;
  }, [kpi]);

  const lineBarChartsTitle = useMemo(() => {
    if (kpi) return `${PERFORMANCE_TOOL_KPIS[kpi]} Overtime`;
    return `Overtime`;
  }, [kpi]);

  const waterfallTitle = useMemo(() => {
    if (kpi) return `${PERFORMANCE_TOOL_KPIS[kpi]} Contribution`;
    return `Contribution`;
  }, [kpi]);

  const isCountryWithoutBrandData = useMemo(() => {
    return (
      kpi === 'market_share' &&
      MARKET_SHARE_COUNTRIES_WITHOUT_BRAND_DATA.includes(
        applied?.country as string,
      )
    );
  }, [kpi, applied?.country]);

  return (
    <ContentCard fullWidth title={title} tooltip={tooltip}>
      <StyledSectionsContainer>
        <LineBarChartsSection
          title={lineBarChartsTitle}
          measure={measure}
          data={lineBarChartsData}
          loading={lineBarChartsRequest.loading}
          error={lineBarChartsRequest.error}
          showLineDataLabels={showLineDataLabels}
        />
        {showCompositionSection && (
          <CoresCompositionSection
            measure="[ $Mio ]"
            data={compositionData}
            loading={compositionBffData?.loading}
            error={compositionBffData?.error}
          />
        )}

        {!showDrivers && !isCountryWithoutBrandData && (
          <WaterfallSection
            config={waterfallConfig}
            title={waterfallTitle}
            measure={measure}
            data={waterfallData}
            variant={waterfallVariant}
            loading={waterfallRequest.loading}
            error={waterfallRequest.error}
          />
        )}

        {isCountryWithoutBrandData && (
          <EmptyBrandContributionSection title={waterfallTitle} />
        )}
      </StyledSectionsContainer>
    </ContentCard>
  );
};
