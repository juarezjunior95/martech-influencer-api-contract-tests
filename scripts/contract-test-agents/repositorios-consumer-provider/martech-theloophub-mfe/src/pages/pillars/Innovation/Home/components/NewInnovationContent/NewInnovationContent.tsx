import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  BasicContainer,
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
} from 'components';
import type { BigNumberSparkLineCardData } from 'pages/components';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
} from 'shared/Styles/layout.styles';

import { getInnovationHomeFourCardTrendMockData } from '../../__mocks';
import { INNOVATION_PAGE_NAME } from '../../../constants';
import {
  HOW_WE_DO_IT_CONFIG,
  PERFORMANCE_KPI_MAIN_CARDS_CONFIG,
} from '../../constants';
import type { InnovationHomePageDataBundle } from '../../hooks/useInnovationHomePageData';
import type { InnovationHomeFeatureToggleTuple } from '../../utils/innovationHomeToggleUtils';
import { isInnovationHomeToggleOn } from '../../utils/innovationHomeToggleUtils';
import { HowWeDoItCard } from '../HowWeDoItCard';
import { PerformanceKpiCard } from '../PerformanceKpiCard/PerformanceKpiCard';
import {
  StyledHowWeDoItCardsGrid,
  StyledHowWeDoItHandoffSection,
  StyledNewInnovationKpiGrid,
} from './NewInnovationContent.styles';

export type NewInnovationContentProps = InnovationHomePageDataBundle & {
  innovationHomeContentToggle: InnovationHomeFeatureToggleTuple;
};

export const NewInnovationContent = ({
  innovationHomeContentToggle,
  isDesktopLarge,
  pageData,
  howWeDoItCardsData,
  onKpiClick,
}: NewInnovationContentProps) => {
  const { formatMessage } = useIntl();

  const isContentEnabled = isInnovationHomeToggleOn(
    innovationHomeContentToggle,
  );

  const performanceKpiTrendCards = useMemo((): BigNumberSparkLineCardData[] => {
    const api = pageData?.data?.['innovation-home-big-numbers-trend'];
    if (Array.isArray(api) && api.length >= 4) {
      return api.slice(0, 4);
    }
    return getInnovationHomeFourCardTrendMockData();
  }, [pageData]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: INNOVATION_PAGE_NAME,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/innovation',
              pageName: formatMessage({
                id: 'Innovation.Home.breadcrumbPageName',
              }),
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
      />

      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <StyledHomeHeaderContainer>
            <PageHeader
              title={formatMessage({
                id: 'Innovation.Home.newInnovationHomeTitle',
              })}
              subtitle={formatMessage({
                id: 'Innovation.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          <BasicContainer
            header={{
              title: formatMessage({
                id: 'Innovation.Home.globalOvertimePerformance',
              }),
              titleSize: isDesktopLarge ? 'H2' : 'H3',
            }}
            layout={{
              bodyPadding: false,
              background: '#fafafa',
              border: 'gray',
            }}
          >
            <StyledNewInnovationKpiGrid data-testid="innovation-home-four-cards-grid">
              {PERFORMANCE_KPI_MAIN_CARDS_CONFIG.map(
                ({ titleId, kpiId }, index) => (
                  <PerformanceKpiCard
                    key={titleId}
                    containerTitle={formatMessage({ id: titleId })}
                    dataTestId={`innovation-home-performance-kpi-${kpiId}`}
                    loading={pageData?.loading}
                    error={pageData?.error}
                    data={performanceKpiTrendCards[index] ?? null}
                    onClick={() => onKpiClick(kpiId)}
                  />
                ),
              )}
            </StyledNewInnovationKpiGrid>
          </BasicContainer>

          <StyledHowWeDoItHandoffSection>
            <BasicContainer
              dataTestId="innovation-home-how-we-do-it"
              header={{
                title: formatMessage({
                  id: 'Innovation.Home.howWeDoIt',
                }),
                titleSize: isDesktopLarge ? 'H2' : 'H3',
              }}
              layout={{
                bodyPadding: false,
                background: '#fafafa',
                border: 'gray',
              }}
            >
              <StyledHowWeDoItCardsGrid>
                {HOW_WE_DO_IT_CONFIG.map(
                  ({ titleId, descriptionId, dataKey }) => (
                    <HowWeDoItCard
                      key={dataKey}
                      titleId={titleId}
                      descriptionId={descriptionId}
                      section={howWeDoItCardsData?.[dataKey] ?? null}
                      loading={pageData?.loading ?? false}
                      error={pageData?.error ?? null}
                      dataTestId={`innovation-home-how-we-do-it-${dataKey}`}
                    />
                  ),
                )}
              </StyledHowWeDoItCardsGrid>
            </BasicContainer>
          </StyledHowWeDoItHandoffSection>

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.innovation' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
