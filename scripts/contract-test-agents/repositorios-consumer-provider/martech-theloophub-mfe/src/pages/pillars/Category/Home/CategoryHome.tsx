import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import categoryUnderstandingImage from 'assets/img/CategoryOverview/category_understanding.png';
import consumerMotivationImage from 'assets/img/CategoryOverview/consumer_motivation.png';
import {
  BasicContainer,
  BigNumber,
  ChartHeader,
  DataStateHandler,
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
  SubPillarCard,
} from 'components';
import { featureToggles } from 'config/featureToggle';
import {
  useBffData,
  useFeatureToggle,
  useMediaQuery,
  useMultiplesFeatureToggles,
  usePageFilterApplied,
  usePageFilterManagement,
} from 'hooks';
import {
  BigNumberSparkLineCard,
  BigNumberSparkLineCardData,
} from 'pages/components';
import { AISummary } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
} from 'shared/Styles/layout.styles';

import {
  StyledCardsGrid,
  StyledSubPillarCardsGrid,
  StyledSubPillarImage,
  StyledSubPillarImageSmall,
} from './CategoryHome.styles';

const DEFAULT_POS_PERIOD = 'R12M';
const CONSUMER_BEHAVIOR_INDICES = [0, 1] as const;
export const CATEGORY_HOME_PAGE_NAME = 'category_home';

export const CategoryHome = () => {
  const { formatMessage } = useIntl();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const navigate = useNavigate();
  const { apply: applyFilters, updateForm } = usePageFilterManagement(
    CATEGORY_HOME_PAGE_NAME,
  );
  const { applied } = usePageFilterApplied(CATEGORY_HOME_PAGE_NAME);
  const [categoryHomeContentEnabled, categoryHomeContentLoading] =
    useFeatureToggle(featureToggles.pillar.category.category_home_content);

  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.category.home.aiSummary.growTheCategory,
      featureToggles.pillar.category.home.aiSummary.leadTheCategory,
    ]);

  const isAISummaryGrowEnabled = useMemo(() => {
    return tabToggles[
      featureToggles.pillar.category.home.aiSummary.growTheCategory
    ];
  }, [tabToggles]);
  const isAISummaryLeadEnabled = useMemo(() => {
    return tabToggles[
      featureToggles.pillar.category.home.aiSummary.leadTheCategory
    ];
  }, [tabToggles]);
  const isCategoryHomeContentEnabled = useMemo(() => {
    return categoryHomeContentEnabled && !categoryHomeContentLoading;
  }, [categoryHomeContentEnabled, categoryHomeContentLoading]);

  const pageData = useBffData({
    id: 'category_home',
    kpiGroup: 'pos',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
      timeperiod: 'R12M',
      pos_kpi: 'participation',
    },
  });

  const growTheCategoryData = pageData?.data?.[
    'grow-the-category'
  ]?.[0] as BigNumberSparkLineCardData;

  const leadTheCategoryData = pageData?.data?.[
    'lead-the-category'
  ]?.[0] as BigNumberSparkLineCardData;

  const consumerBehaviorData = pageData?.data?.['consumer-behavior'];

  const handleCardClick = useCallback(
    (title: string) => {
      if (!title) return;
      const tab = title === 'Beer Participation' ? 'grow' : 'lead';
      updateForm('pos_periods', DEFAULT_POS_PERIOD);
      applyFilters();
      navigate(`/category/pos/${tab}`);
    },
    [updateForm, applyFilters, navigate],
  );

  const DRILL_DOWN_BASE_URL = '/category/category-health/drill-down';

  const handleClickCategory = () => {
    navigate(DRILL_DOWN_BASE_URL);
  };

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: CATEGORY_HOME_PAGE_NAME,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isCategoryHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/category',
              pageName: formatMessage({
                id: 'Category.Home.breadcrumbPageName',
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
              title={formatMessage({ id: 'Pillars.sidebar.category' })}
              subtitle={formatMessage({ id: 'Category.Home.pageSubtitle' })}
            />
          </StyledHomeHeaderContainer>

          {isCategoryHomeContentEnabled && (
            <>
              <StyledCardsGrid>
                <BigNumberSparkLineCard
                  loading={pageData?.loading}
                  error={pageData?.error}
                  containerTitle={formatMessage({
                    id: 'Category.Home.containerTitleGrow',
                  })}
                  data={growTheCategoryData}
                  onClick={handleClickCategory}
                >
                  {isAISummaryGrowEnabled && togglesReady && (
                    <AISummary
                      pageName={CATEGORY_HOME_PAGE_NAME}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.GROW_THE_CATEGORY
                      }
                      kpiGroup="pos"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                    />
                  )}
                </BigNumberSparkLineCard>
                <BigNumberSparkLineCard
                  loading={pageData?.loading}
                  error={pageData?.error}
                  containerTitle={formatMessage({
                    id: 'Category.Home.containerTitleLead',
                  })}
                  data={leadTheCategoryData}
                >
                  {isAISummaryLeadEnabled && togglesReady && (
                    <AISummary
                      pageName={CATEGORY_HOME_PAGE_NAME}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.LEAD_THE_CATEGORY
                      }
                      kpiGroup="pos"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                    />
                  )}
                </BigNumberSparkLineCard>
              </StyledCardsGrid>
              <BasicContainer
                header={{
                  title: formatMessage({ id: 'Category.Home.howWeDoIt' }),
                  titleSize: isDesktopLarge ? 'H2' : 'H3',
                }}
                layout={{
                  bodyPadding: false,
                  background: '#fafafa',
                  border: 'gray',
                }}
              >
                <StyledSubPillarCardsGrid>
                  <SubPillarCard
                    title={formatMessage({
                      id: 'Category.Home.categoryUnderstanding.title',
                    })}
                    description={formatMessage({
                      id: 'Category.Home.categoryUnderstanding.description',
                    })}
                  >
                    <StyledSubPillarImage
                      src={categoryUnderstandingImage}
                      alt={formatMessage({
                        id: 'Category.Home.categoryUnderstanding.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'Category.Home.consumerMotivation.title',
                    })}
                    description={formatMessage({
                      id: 'Category.Home.consumerMotivation.description',
                    })}
                  >
                    <StyledSubPillarImageSmall
                      src={consumerMotivationImage}
                      alt={formatMessage({
                        id: 'Category.Home.consumerMotivation.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'Category.Home.consumerBehavior.title',
                    })}
                    description={formatMessage({
                      id: 'Category.Home.consumerBehavior.description',
                    })}
                  >
                    {CONSUMER_BEHAVIOR_INDICES.map((index) => {
                      const item = consumerBehaviorData?.[index];
                      return (
                        <DataStateHandler
                          key={index}
                          loading={pageData?.loading}
                          error={pageData?.error}
                          empty={!consumerBehaviorData}
                          skeletonProps={{
                            height: '150px',
                            width: '100%',
                            length: 1,
                          }}
                        >
                          <BigNumber
                            header={
                              <ChartHeader
                                title={item?.title}
                                period={item?.period}
                                config={{ inline: 'horizontal', type: 'small' }}
                              />
                            }
                            data={item?.bigNumberData}
                            emptyStateMessage="No data available for the selected filters"
                            asCard={true}
                            size={isDesktopLarge ? 'medium' : 'small'}
                            onClick={() => handleCardClick(item?.title)}
                            spacing="loose"
                          />
                        </DataStateHandler>
                      );
                    })}
                  </SubPillarCard>
                </StyledSubPillarCardsGrid>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.category' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
