import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import jobsToBeDoneImage from 'assets/img/Consumer/jobsToBeDone.png';
import understandingAudiencesImage from 'assets/img/Consumer/understanding_audiences.png';
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
import { BigNumberData } from 'components/BigNumber/types';
import { featureToggles } from 'config/featureToggle';
import {
  useBffData,
  useFeatureToggle,
  useMediaQuery,
  useMultiplesFeatureToggles,
  usePageFilterApplied,
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
  StyledCardImage,
  StyledCardsGrid,
  StyledSubPillarCardsGrid,
} from './ConsumerHome.styles';

const CONSUMER_HOME_PAGE_KEY = 'consumer_home';

export const ConsumerHome = () => {
  const pageName = CONSUMER_HOME_PAGE_KEY;
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const { applied } = usePageFilterApplied(pageName);
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [consumerHomeContentEnabled, consumerHomeContentLoading] =
    useFeatureToggle(featureToggles.pillar.consumer.consumer_home_content);

  const isConsumerHomeContentEnabled = useMemo(() => {
    return consumerHomeContentEnabled && !consumerHomeContentLoading;
  }, [consumerHomeContentEnabled, consumerHomeContentLoading]);

  const pageData = useBffData({
    id: 'consumer_home',
    kpiGroup: 'power',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
      timeperiod: 'R12M',
    },
  });

  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.consumer.home.aiSummary.abiLovers,
      featureToggles.pillar.consumer.home.aiSummary.increaseParticipation,
    ]);
  const isAISummaryAbiLoversEnabled = useMemo(() => {
    return tabToggles[featureToggles.pillar.consumer.home.aiSummary.abiLovers];
  }, [tabToggles]);
  const isAISummaryIncreaseParticipationEnabled = useMemo(() => {
    return tabToggles[
      featureToggles.pillar.consumer.home.aiSummary.increaseParticipation
    ];
  }, [tabToggles]);

  const increaseAbiLoversData = pageData?.data?.[
    'increase-abi-lovers'
  ] as BigNumberSparkLineCardData;

  const increaseParticipationData = pageData?.data?.[
    'increase-participation'
  ] as BigNumberSparkLineCardData;

  const targetAudiencesData = pageData?.data?.['target-audiences'];

  const handleCardClick = () => {
    navigate(`/consumer/audience-targeting/definition`);
  };

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: CONSUMER_HOME_PAGE_KEY,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isConsumerHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/consumer',
              pageName: formatMessage({
                id: 'Consumer.Home.breadcrumbPageName',
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
              title={formatMessage({ id: 'Pillars.sidebar.consumer' })}
              subtitle={formatMessage({ id: 'Consumer.Home.pageSubtitle' })}
            />
          </StyledHomeHeaderContainer>

          {isConsumerHomeContentEnabled && (
            <>
              <StyledCardsGrid>
                <BigNumberSparkLineCard
                  loading={pageData?.loading}
                  error={pageData?.error}
                  containerTitle={formatMessage({
                    id: 'Consumer.Home.increaseABILovers',
                  })}
                  data={increaseAbiLoversData}
                >
                  {isAISummaryAbiLoversEnabled && togglesReady && (
                    <AISummary
                      pageName={pageName}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.CONSUMER_HOME_ABI_LOVERS
                      }
                      kpiGroup="power"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                    />
                  )}
                </BigNumberSparkLineCard>

                <BigNumberSparkLineCard
                  loading={pageData?.loading}
                  error={pageData?.error}
                  containerTitle={formatMessage({
                    id: 'Consumer.Home.increaseParticipation',
                  })}
                  data={increaseParticipationData}
                >
                  {isAISummaryIncreaseParticipationEnabled && togglesReady && (
                    <AISummary
                      pageName={pageName}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.CONSUMER_HOME_PARTICIPATION
                      }
                      kpiGroup="power"
                      dataTestId="ai-summary-big-number-spark-line-card"
                      hasExpandedAction={false}
                    />
                  )}
                </BigNumberSparkLineCard>
              </StyledCardsGrid>
              <BasicContainer
                header={{
                  title: formatMessage({ id: 'Consumer.Home.howWeDoIt' }),
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
                      id: 'Consumer.Home.targetAudiences.title',
                    })}
                    description={formatMessage({
                      id: 'Consumer.Home.targetAudiences.description',
                    })}
                  >
                    <DataStateHandler
                      loading={pageData?.loading}
                      error={pageData?.error}
                      empty={!pageData?.data}
                      skeletonProps={{
                        height: '176px',
                        width: '100%',
                        length: 1,
                      }}
                    >
                      <BigNumber
                        header={
                          <ChartHeader
                            title={targetAudiencesData?.title}
                            period={targetAudiencesData?.period}
                            description={targetAudiencesData?.description}
                            config={{ inline: 'horizontal', type: 'small' }}
                          />
                        }
                        data={
                          (targetAudiencesData?.bigNumberData ||
                            []) as BigNumberData[]
                        }
                        asCard={true}
                        size={isDesktopLarge ? 'medium' : 'small'}
                        onClick={handleCardClick}
                        spacing="loose"
                      />
                    </DataStateHandler>
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'Consumer.Home.understandingAudiences.title',
                    })}
                    description={formatMessage({
                      id: 'Consumer.Home.understandingAudiences.description',
                    })}
                  >
                    <StyledCardImage
                      src={understandingAudiencesImage}
                      alt={formatMessage({
                        id: 'Consumer.Home.understandingAudiences.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'Consumer.Home.jobsToBeDone.title',
                    })}
                    description={formatMessage({
                      id: 'Consumer.Home.jobsToBeDone.description',
                    })}
                  >
                    <StyledCardImage
                      src={jobsToBeDoneImage}
                      alt={formatMessage({
                        id: 'Consumer.Home.jobsToBeDone.alt',
                      })}
                    />
                  </SubPillarCard>
                </StyledSubPillarCardsGrid>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.consumer' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
