import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import abiConnectQrcodeImage from 'assets/img/ConnectionsCreativityOverview/abi_connect_qrcode.png';
import abiConnectImage from 'assets/img/ConnectionsCreativityOverview/abi_connect.png';
import creativeDevelopmentImage from 'assets/img/ConnectionsCreativityOverview/creative_development.png';
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
  usePageFilterApplied,
  useSubFilters,
} from 'hooks';
import {
  BigNumberSparkLineCard,
  BigNumberSparkLineCardData,
} from 'pages/components';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
} from 'shared/Styles/layout.styles';

import {
  StyledAbiConnectContent,
  StyledAbiConnectImage,
  StyledAbiConnectQrcodeImage,
  StyledCardsGrid,
  StyledHowWeDoItImage,
  StyledSubPillarCardsGrid,
} from './ConnectionsCreativityHome.styles';
import {
  MAIN_CARDS_CONFIG,
  RESOURCE_ALLOCATION_CARD_KEYS,
  RESOURCE_ALLOCATION_ROUTE,
  type ResourceAllocationCardKey,
} from './constants';

interface ResourceAllocationCardData {
  title?: string;
  period?: string;
  bigNumberData?: BigNumberData[];
}

interface ResourceAllocationCardsData {
  megabrandsQwoaBigNumber?: ResourceAllocationCardData;
  campaignsQwoaBigNumber?: ResourceAllocationCardData;
}

const CONNECTIONS_CREATIVITY_HOME_PAGE_NAME = 'connections-creativity_home';

export const ConnectionsCreativityHome = () => {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { setSubFilterValue } = useSubFilters();
  const { applied } = usePageFilterApplied(
    CONNECTIONS_CREATIVITY_HOME_PAGE_NAME,
  );
  const [
    connectionsCreativityHomeContentEnabled,
    connectionsCreativityHomeContentLoading,
  ] = useFeatureToggle(
    featureToggles.pillar.connectionsAndCreativity
      .connections_creativity_home_content,
  );

  const isConnectionsCreativityHomeContentEnabled = useMemo(() => {
    return (
      connectionsCreativityHomeContentEnabled &&
      !connectionsCreativityHomeContentLoading
    );
  }, [
    connectionsCreativityHomeContentEnabled,
    connectionsCreativityHomeContentLoading,
  ]);

  const pageData = useBffData({
    id: 'connections-and-creativity_home_home',
    kpiGroup: 'media',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
    },
  });

  const mainCardsData = useMemo(() => {
    const data = (pageData?.data?.[
      'connections-and-creativity-home-big-numbers-trend'
    ] || []) as unknown as BigNumberSparkLineCardData[];

    return {
      mediaEffectiveness:
        data.find((item) => item.chartTitle === 'Media Spend') || null,
      businessEfficiency:
        data.find((item) => item.chartTitle === 'Non-Working Money') || null,
    };
  }, [pageData]);

  const resourceAllocationCardsData = useMemo(
    (): ResourceAllocationCardsData | undefined =>
      pageData?.data?.[
        'connections-and-creativity-home-resource-allocation'
      ] as ResourceAllocationCardsData | undefined,
    [pageData],
  );

  const handleCardClick = (key: ResourceAllocationCardKey) => {
    if (key === 'megabrandsQwoaBigNumber') {
      setSubFilterValue('kpis', 'media_qwoa');
      navigate(
        `/connections-creativity/resource-allocation-media/media-drilldown`,
      );
    }

    if (key === 'campaignsQwoaBigNumber') {
      setSubFilterValue('kpis', 'campaign_qwoa');
      navigate(
        `/connections-creativity/resource-allocation-media/media-drilldown`,
      );
    }
  };

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: CONNECTIONS_CREATIVITY_HOME_PAGE_NAME,
          visibleFields: ['zone', 'country', 'periods'],
          hidden: !isConnectionsCreativityHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/connections-creativity',
              pageName: formatMessage({
                id: 'ConnectionsCreativity.Home.breadcrumbPageName',
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
                id: 'Pillars.sidebar.connectionsCreativity',
              })}
              subtitle={formatMessage({
                id: 'ConnectionsCreativity.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          {isConnectionsCreativityHomeContentEnabled && (
            <>
              <StyledCardsGrid>
                {MAIN_CARDS_CONFIG.map(({ titleId, dataKey }) => (
                  <BigNumberSparkLineCard
                    key={titleId}
                    containerTitle={formatMessage({ id: titleId })}
                    loading={pageData?.loading}
                    error={pageData?.error}
                    data={mainCardsData?.[dataKey] ?? null}
                    onClick={() => navigate(RESOURCE_ALLOCATION_ROUTE)}
                  />
                ))}
              </StyledCardsGrid>

              <BasicContainer
                header={{
                  title: formatMessage({
                    id: 'ConnectionsCreativity.Home.howWeDoIt',
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
                  <SubPillarCard
                    title={formatMessage({
                      id: 'ConnectionsCreativity.Home.resourceAllocation.title',
                    })}
                    description={formatMessage({
                      id: 'ConnectionsCreativity.Home.resourceAllocation.description',
                    })}
                  >
                    {RESOURCE_ALLOCATION_CARD_KEYS.map((key) => {
                      const cardData = resourceAllocationCardsData?.[key];
                      return (
                        <DataStateHandler
                          key={key}
                          loading={pageData?.loading}
                          error={pageData?.error}
                          empty={!resourceAllocationCardsData}
                          skeletonProps={{
                            height: '150px',
                            width: '100%',
                            length: 1,
                          }}
                        >
                          <BigNumber
                            header={
                              <ChartHeader
                                title={cardData?.title}
                                period={cardData?.period}
                                config={{ inline: 'horizontal', type: 'small' }}
                              />
                            }
                            data={cardData?.bigNumberData ?? []}
                            asCard={true}
                            size={isDesktopLarge ? 'medium' : 'small'}
                            spacing="loose"
                            onClick={() => handleCardClick(key)}
                            style={{ minHeight: '152px' }}
                          />
                        </DataStateHandler>
                      );
                    })}
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'ConnectionsCreativity.Home.creativeDevelopment.title',
                    })}
                    description={formatMessage({
                      id: 'ConnectionsCreativity.Home.creativeDevelopment.description',
                    })}
                  >
                    <StyledHowWeDoItImage
                      src={creativeDevelopmentImage}
                      alt={formatMessage({
                        id: 'ConnectionsCreativity.Home.creativeDevelopment.alt',
                      })}
                    />
                  </SubPillarCard>

                  <SubPillarCard
                    title={formatMessage({
                      id: 'ConnectionsCreativity.Home.abiConnect.title',
                    })}
                    description={formatMessage({
                      id: 'ConnectionsCreativity.Home.abiConnect.description',
                    })}
                  >
                    <StyledAbiConnectContent>
                      <StyledAbiConnectQrcodeImage
                        src={abiConnectQrcodeImage}
                        alt={formatMessage({
                          id: 'ConnectionsCreativity.Home.abiConnect.altQrcode',
                        })}
                      />
                      <StyledAbiConnectImage
                        src={abiConnectImage}
                        alt={formatMessage({
                          id: 'ConnectionsCreativity.Home.abiConnect.altLogo',
                        })}
                      />
                    </StyledAbiConnectContent>
                  </SubPillarCard>
                </StyledSubPillarCardsGrid>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({
              id: 'Pillars.pageName.connectionsCreativity',
            })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
