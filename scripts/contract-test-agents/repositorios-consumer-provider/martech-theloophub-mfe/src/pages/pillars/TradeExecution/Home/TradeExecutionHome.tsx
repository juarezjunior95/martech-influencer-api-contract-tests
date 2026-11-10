import { useIntl } from 'react-intl';

import executionImage from 'assets/img/TradeOverview/execution.png';
import pocSegmentationImage from 'assets/img/TradeOverview/poc_segmentation.png';
import resourceAllocationImage from 'assets/img/TradeOverview/resource_allocation.png';
import {
  BasicContainer,
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
  SubPillarCard,
} from 'components';
import { useMediaQuery } from 'hooks';
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

import { TRADE_EXECUTION_HOME_PAGE_NAME } from './constants';
import { useTradeExecutionHome } from './hooks/useTradeExecutionHome';
import {
  StyledCardImage,
  StyledCardsGrid,
  StyledSubPillarCardsGrid,
} from './TradeExecutionHome.styles';

export const TradeExecutionHome = () => {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const { formatMessage } = useIntl();

  const {
    isHomeContentEnabled,
    pageData,
    handleCardClick,
    isAISummaryTotalEnabled,
    isAISummaryMegabrandsEnabled,
    togglesReady,
  } = useTradeExecutionHome();

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: TRADE_EXECUTION_HOME_PAGE_NAME,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/trade-execution',
              pageName: formatMessage({
                id: 'TradeExecution.Home.breadcrumbPageName',
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
              title={formatMessage({ id: 'Pillars.sidebar.tradeExecution' })}
              subtitle={formatMessage({
                id: 'TradeExecution.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          {isHomeContentEnabled && (
            <>
              <StyledCardsGrid>
                <BigNumberSparkLineCard
                  containerTitle={formatMessage({
                    id: 'TradeExecution.Home.growthAtPointOfPurchase',
                  })}
                  loading={pageData.loading}
                  error={pageData.error}
                  data={
                    pageData.data?.[
                      'total-distribution'
                    ] as BigNumberSparkLineCardData
                  }
                  onClick={() => handleCardClick('total')}
                >
                  {isAISummaryTotalEnabled && togglesReady && (
                    <AISummary
                      pageName={TRADE_EXECUTION_HOME_PAGE_NAME}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.BEES_DISTRIBUTION_OVERVIEW
                      }
                      kpiGroup="bees-distribution"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                      subFilters={{
                        scope: 'total',
                      }}
                    />
                  )}
                </BigNumberSparkLineCard>

                <BigNumberSparkLineCard
                  containerTitle={formatMessage({
                    id: 'TradeExecution.Home.buildIconicBrands',
                  })}
                  loading={pageData.loading}
                  error={pageData.error}
                  data={
                    pageData.data?.[
                      'total-megabrands-distribution'
                    ] as BigNumberSparkLineCardData
                  }
                  onClick={() => handleCardClick('megabrand')}
                >
                  {isAISummaryMegabrandsEnabled && togglesReady && (
                    <AISummary
                      pageName={TRADE_EXECUTION_HOME_PAGE_NAME}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.BEES_DISTRIBUTION_OVERVIEW
                      }
                      kpiGroup="bees-distribution"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                      subFilters={{
                        scope: 'megabrand',
                      }}
                    />
                  )}
                </BigNumberSparkLineCard>
              </StyledCardsGrid>

              <BasicContainer
                header={{
                  title: formatMessage({ id: 'TradeExecution.Home.howWeDoIt' }),
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
                      id: 'TradeExecution.Home.pocSegmentation.title',
                    })}
                    description={formatMessage({
                      id: 'TradeExecution.Home.pocSegmentation.description',
                    })}
                  >
                    <StyledCardImage
                      src={pocSegmentationImage}
                      alt={formatMessage({
                        id: 'TradeExecution.Home.pocSegmentation.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'TradeExecution.Home.execution.title',
                    })}
                    description={formatMessage({
                      id: 'TradeExecution.Home.execution.description',
                    })}
                  >
                    <StyledCardImage
                      src={executionImage}
                      alt={formatMessage({
                        id: 'TradeExecution.Home.execution.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'TradeExecution.Home.resourceAllocation.title',
                    })}
                    description={formatMessage({
                      id: 'TradeExecution.Home.resourceAllocation.description',
                    })}
                  >
                    <StyledCardImage
                      src={resourceAllocationImage}
                      alt={formatMessage({
                        id: 'TradeExecution.Home.resourceAllocation.alt',
                      })}
                    />
                  </SubPillarCard>
                </StyledSubPillarCardsGrid>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.tradeExecution' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
