import { useIntl } from 'react-intl';

import {
  BasicContainer,
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
} from 'components';
import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks';
import { BigNumberSparkLineCard } from 'pages/components';
import { AISummary } from 'pages/components/AISummary';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
} from 'shared/Styles/layout.styles';

import { INNOVATION_PAGE_NAME } from '../../../constants';
import { HOW_WE_DO_IT_CONFIG, MAIN_CARDS_CONFIG } from '../../constants';
import type { InnovationHomePageDataBundle } from '../../hooks/useInnovationHomePageData';
import { StyledSubPillarCardsGrid } from '../../InnovationHome.styles';
import type { InnovationHomeFeatureToggleTuple } from '../../utils/innovationHomeToggleUtils';
import { isInnovationHomeToggleOn } from '../../utils/innovationHomeToggleUtils';
import { HowWeDoItCard } from '../HowWeDoItCard';
import { StyledCardsGrid } from './OldInnovationContent.styles';

export type OldInnovationContentProps = InnovationHomePageDataBundle & {
  innovationHomeContentToggle: InnovationHomeFeatureToggleTuple;
  innovationHomeNewPageExperienceToggle: InnovationHomeFeatureToggleTuple;
};

export const OldInnovationContent = ({
  innovationHomeContentToggle,
  innovationHomeNewPageExperienceToggle,
  isDesktopLarge,
  pageData,
  mainCardsData,
  howWeDoItCardsData,
  onKpiClick,
}: OldInnovationContentProps) => {
  const { formatMessage } = useIntl();
  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.innovation.home.aiSummary.volume,
      featureToggles.pillar.innovation.home.aiSummary.nr,
    ]);

  const isContentEnabled = isInnovationHomeToggleOn(
    innovationHomeContentToggle,
  );
  const isNewPageExperience = isInnovationHomeToggleOn(
    innovationHomeNewPageExperienceToggle,
  );
  const showLegacyMainCards = isContentEnabled && !isNewPageExperience;

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
              title={formatMessage({ id: 'Pillars.sidebar.innovation' })}
              subtitle={formatMessage({
                id: 'Innovation.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          {showLegacyMainCards && (
            <>
              <StyledCardsGrid data-testid="innovation-home-legacy-main-cards-grid">
                {MAIN_CARDS_CONFIG.map(
                  ({ titleId, dataKey, kpiId, aiSummaryIdentifier }) => (
                    <BigNumberSparkLineCard
                      key={titleId}
                      containerTitle={formatMessage({ id: titleId })}
                      loading={pageData?.loading}
                      error={pageData?.error}
                      data={mainCardsData?.[dataKey] ?? null}
                      onClick={() => onKpiClick(kpiId)}
                    >
                      {tabToggles[
                        featureToggles.pillar.innovation.home.aiSummary[kpiId]
                      ] &&
                        togglesReady && (
                          <AISummary
                            pageName={INNOVATION_PAGE_NAME}
                            summaryPageIdentifier={aiSummaryIdentifier}
                            kpiGroup="innovation"
                            dataTestId="ai-summary-big-number-spark-line-card"
                            hasExpandedAction={false}
                          />
                        )}
                    </BigNumberSparkLineCard>
                  ),
                )}
              </StyledCardsGrid>

              <BasicContainer
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
                <StyledSubPillarCardsGrid>
                  {HOW_WE_DO_IT_CONFIG.map(
                    ({ titleId, descriptionId, dataKey }) => (
                      <HowWeDoItCard
                        key={dataKey}
                        titleId={titleId}
                        descriptionId={descriptionId}
                        section={howWeDoItCardsData?.[dataKey] ?? null}
                        loading={pageData?.loading ?? false}
                        error={pageData?.error ?? null}
                      />
                    ),
                  )}
                </StyledSubPillarCardsGrid>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.innovation' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
