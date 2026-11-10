import { BrandAvatarList, ComparisonLine, DataStateHandler } from 'components';
import { Waterfall } from 'components/Chart/Bar/Waterfall';
import { AISummaryAlert } from 'pages/components/AISummary';
import { SectionHeader } from 'pages/components/SectionHeader';
import { LegendItem } from 'pages/pillars/ValueCreation/VolumePages/types';
import { processVariationCaptions } from 'utils/variationCaptions';

import { BRAND_POWER_BOOK_EXPORT_PAGE_NAME } from '../../BrandPowerBookExport';
import { HeaderContainer } from '../HeaderContainer';
import * as S from './TopContribuitionCountry.styles';

const WATERFALL_LAYOUT = {
  padding: {
    left: 20,
    right: 16,
    top: 49,
    bottom: 0,
  },
  barColors: {
    first: '#C9D1D6',
    last: '#4C5965',
    retained: '#D1A33C',
    negative: '#A20A0A',
    positive: '#49764B',
  },
} as const;

interface ChartData {
  data?: number[];
  labels?: { value: string; image: string }[];
  legend?: LegendItem[];
  variationCaptions?: any[];
}

interface AiSummaryConfig {
  id: string;
  subFilters: Record<string, string>;
}

interface TopCountryContribuitionProps {
  countryContribuitionKpiData: any;
  loading: boolean;
  error: Error | null;
  title: string;
  dataTestId?: string;
  aiSummary?: AiSummaryConfig;
}

interface AiSummarySlotProps {
  aiSummary?: AiSummaryConfig;
  dataTestId?: string;
}

const AiSummarySlot = ({ aiSummary, dataTestId }: AiSummarySlotProps) => {
  if (!aiSummary?.id) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <AISummaryAlert
        pageName={BRAND_POWER_BOOK_EXPORT_PAGE_NAME}
        summaryPageIdentifier={aiSummary.id}
        dataTestId={`ai-summary-${dataTestId}`}
        kpiGroup="power"
        subFilters={aiSummary.subFilters}
        hasExpandedAction={false}
      />
    </div>
  );
};

const processBrandAvatarData = (chartData: unknown) => {
  const data = chartData as ChartData;

  if (!Array.isArray(data?.labels)) {
    return [];
  }

  return data.labels.map((label) => ({
    title: label.value,
    mainBrand: { src: label.image, alt: label.value },
  }));
};

const extractLegends = (chartData: unknown): LegendItem[] | undefined => {
  const data = chartData as ChartData;
  return Array.isArray(data?.legend) ? data.legend : undefined;
};

const processWaterfallData = (chartData: unknown) => {
  const data = chartData as ChartData;

  const values = data?.data || [];
  const labels = data?.labels?.map((label) => label.value) || [];

  return { values, labels };
};

export const TopCountryContribution = ({
  countryContribuitionKpiData,
  loading,
  error,
  title,
  dataTestId,
  aiSummary,
}: TopCountryContribuitionProps) => {
  const empty = countryContribuitionKpiData?.empty;
  const chartData = countryContribuitionKpiData?.countriesContribution;
  const { values: waterfallValues, labels: waterfallLabels } =
    processWaterfallData(chartData);
  const legends = extractLegends(chartData);
  const comparisonData = processVariationCaptions(chartData);
  const brandAvatarData = processBrandAvatarData(chartData);

  return (
    <>
      <AiSummarySlot aiSummary={aiSummary} dataTestId={dataTestId} />
      <S.StyledCountryContributionContainer
        loading={loading}
        data-testid={dataTestId}
      >
        <HeaderContainer
          title={title}
          legends={
            <S.StyledLegend>
              <SectionHeader legends={legends} />
            </S.StyledLegend>
          }
          noBorderBottom
        >
          <DataStateHandler
            loading={loading}
            error={error}
            empty={empty}
            skeletonProps={{
              height: '360px',
              width: '100%',
              length: 1,
              borderRadius: 'none',
            }}
          >
            <S.StyledWaterfallContainer>
              <Waterfall
                values={waterfallValues}
                labels={waterfallLabels}
                showLabels={false}
                size="small"
                options={{
                  layout: {
                    padding: { ...WATERFALL_LAYOUT.padding },
                  },
                  plugins: {
                    connectBars: {
                      color: 'rgba(20, 20, 20, 0.5)',
                    },
                    waterfallDatalabel: {
                      decimalPlaces: 1,
                    },
                  },
                }}
                colors={WATERFALL_LAYOUT.barColors}
                decimalPlaces={1}
              />
            </S.StyledWaterfallContainer>
            <S.StyledAvatarContainer>
              <BrandAvatarList
                data={brandAvatarData}
                length={waterfallLabels.length}
                borderConfig={{ marginLeft: 0, marginRight: 0 }}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
              />
            </S.StyledAvatarContainer>

            <ComparisonLine
              data={comparisonData}
              gridColumnsLength={waterfallLabels.length}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
              borderConfig={{ marginLeft: 20, marginRight: 16 }}
            />
          </DataStateHandler>
        </HeaderContainer>
      </S.StyledCountryContributionContainer>
    </>
  );
};
