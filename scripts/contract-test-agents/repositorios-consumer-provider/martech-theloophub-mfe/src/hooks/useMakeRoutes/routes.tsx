import { Navigate } from 'react-router-dom';

import { featureToggles } from 'config/featureToggle';
import {
  AudienceTargeting,
  BeesDistribution,
  BrandAnalysis,
  BrandPowerBook,
  BrandPowerBookExport,
  CategoryHealth,
  CategoryHome,
  CommercialResults,
  ComponentsPage,
  ConnectionsCreativityHome,
  ConsumerHome,
  DrillDown,
  GrowthLeague,
  Innovation,
  InnovationHome,
  InnovationHub,
  Performance,
  PerformanceTool,
  PnlPage,
  PortfolioBrandHome,
  POSBook,
  ResourceAllocationMedia,
  TradeExecutionHome,
  ValueCreationHome,
  VolumePages,
  VolumePagesCountryPpr,
} from 'pages';

export type Route = {
  id: string;
  path: string;
  element: React.ReactNode;
};

const BASE_PATHS = {
  valueCreation: '/value-creation',
  portfolioBrand: '/portfolio-brand',
  category: '/category',
  consumer: '/consumer',
  connectionsCreativity: '/connections-creativity',
  development: '/development',
  innovation: '/innovation',
  tradeExecution: '/trade-execution',
};

export const valueCreationRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.valueCreation.id,
    path: `${BASE_PATHS.valueCreation}`,
    element: <ValueCreationHome />,
  },

  // Growth League
  {
    id: featureToggles.pillar.valueCreation.submenus.growthLeague.id,
    path: `${BASE_PATHS.valueCreation}/growth-league`,
    element: (
      <Navigate
        to={`${BASE_PATHS.valueCreation}/growth-league/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.valueCreation.submenus.growthLeague.id,
    path: `${BASE_PATHS.valueCreation}/growth-league/:tab`,
    element: <GrowthLeague />,
  },

  // Volume Pages
  {
    id: featureToggles.pillar.valueCreation.submenus.volumePages.id,
    path: `${BASE_PATHS.valueCreation}/volume-pages`,
    element: (
      <Navigate
        to={`${BASE_PATHS.valueCreation}/volume-pages/global`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.valueCreation.submenus.volumePages.id,
    path: `${BASE_PATHS.valueCreation}/volume-pages/:tab`,
    element: <VolumePages />,
  },

  // Net Revenue Pages
  {
    id: featureToggles.pillar.valueCreation.submenus.nrPages.id,
    path: `${BASE_PATHS.valueCreation}/nr-pages`,
    element: (
      <Navigate to={`${BASE_PATHS.valueCreation}/nr-pages/global`} replace />
    ),
  },
  {
    id: featureToggles.pillar.valueCreation.submenus.nrPages.id,
    path: `${BASE_PATHS.valueCreation}/nr-pages/:tab`,
    element: <VolumePages kpi="nr" />,
  },

  // Market Share Pages
  {
    id: featureToggles.pillar.valueCreation.submenus.market_sharePages.id,
    path: `${BASE_PATHS.valueCreation}/market_share-pages`,
    element: (
      <Navigate
        to={`${BASE_PATHS.valueCreation}/market_share-pages/global`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.valueCreation.submenus.market_sharePages.id,
    path: `${BASE_PATHS.valueCreation}/market_share-pages/:tab`,
    element: <VolumePages kpi="market_share" />,
  },

  // Volume Pages Country PPR
  {
    id: featureToggles.pillar.valueCreation.submenus.volumePagesCountryPpr.id,
    path: `${BASE_PATHS.valueCreation}/volume-pages-country-ppr`,
    element: <VolumePagesCountryPpr />,
  },

  // Performance Tool
  {
    id: featureToggles.pillar.valueCreation.submenus.performanceTool.id,
    path: `${BASE_PATHS.valueCreation}/performance-tool`,
    element: <PerformanceTool />,
  },
  // Commercial Results
  {
    id: featureToggles.pillar.valueCreation.submenus.commercialResults.id,
    path: `${BASE_PATHS.valueCreation}/commercial-results`,
    element: <CommercialResults />,
  },
];

// Trade execution
export const tradeExecutionRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.tradeExecution.id,
    path: `${BASE_PATHS.tradeExecution}`,
    element: <TradeExecutionHome />,
  },

  // BEES Distribution
  {
    id: featureToggles.pillar.tradeExecution.submenus.beesDistribution.id,
    path: `${BASE_PATHS.tradeExecution}/bees-distribution`,
    element: (
      <Navigate
        to={`${BASE_PATHS.tradeExecution}/bees-distribution/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.tradeExecution.submenus.beesDistribution.id,
    path: `${BASE_PATHS.tradeExecution}/bees-distribution/:tab`,
    element: <BeesDistribution />,
  },
];

export const portfolioBrandRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.portfolioBrand.id,
    path: `${BASE_PATHS.portfolioBrand}`,
    element: <PortfolioBrandHome />,
  },

  {
    id: featureToggles.pillar.portfolioBrand.submenus.portfolioPerformance.id,
    path: `${BASE_PATHS.portfolioBrand}/portfolio-performance`,
    element: <Performance />,
  },

  {
    id: featureToggles.pillar.portfolioBrand.submenus.pnl.id,
    path: `${BASE_PATHS.portfolioBrand}/pnl`,
    element: <PnlPage />,
  },
  // Brand Analysis
  {
    id: featureToggles.pillar.portfolioBrand.submenus.brandAnalysis.id,
    path: `${BASE_PATHS.portfolioBrand}/brand-analysis`,
    element: <BrandAnalysis />,
  },

  // Brand Power Book
  {
    id: featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
    path: `${BASE_PATHS.portfolioBrand}/brand-power-book`,
    element: (
      <Navigate
        to={`${BASE_PATHS.portfolioBrand}/brand-power-book/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
    path: `${BASE_PATHS.portfolioBrand}/brand-power-book/:tab`,
    element: <BrandPowerBook />,
  },

  // Brand Power Book Export
  {
    id: featureToggles.pillar.portfolioBrand.submenus.brandPowerBookExport.id,
    path: `${BASE_PATHS.portfolioBrand}/brand-power-book-export`,
    element: <BrandPowerBookExport />,
  },
];

export const categoryRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.category.id,
    path: `${BASE_PATHS.category}`,
    element: <CategoryHome />,
  },

  // POS Book
  {
    id: featureToggles.pillar.category.submenus.posBook.id,
    path: `${BASE_PATHS.category}/pos`,
    element: <Navigate to={`${BASE_PATHS.category}/pos/grow`} replace />,
  },
  {
    id: featureToggles.pillar.category.submenus.posBook.id,
    path: `${BASE_PATHS.category}/pos/:tab`,
    element: <POSBook />,
  },

  // Category Health
  {
    id: featureToggles.pillar.category.submenus.categoryHealth.id,
    path: `${BASE_PATHS.category}/category-health`,
    element: (
      <Navigate
        to={`${BASE_PATHS.category}/category-health/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.category.submenus.categoryHealth.id,
    path: `${BASE_PATHS.category}/category-health/overview`,
    element: <CategoryHealth />,
  },
  {
    id: featureToggles.pillar.category.submenus.categoryHealth.id,
    path: `${BASE_PATHS.category}/category-health/drill-down`,
    element: <DrillDown />,
  },
];

export const consumerRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.consumer.id,
    path: `${BASE_PATHS.consumer}`,
    element: <ConsumerHome />,
  },

  // Audience Targeting
  {
    id: featureToggles.pillar.consumer.submenus.audienceTargeting.id,
    path: `${BASE_PATHS.consumer}/audience-targeting`,
    element: (
      <Navigate
        to={`${BASE_PATHS.consumer}/audience-targeting/definition`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.consumer.submenus.audienceTargeting.id,
    path: `${BASE_PATHS.consumer}/audience-targeting/:tab`,
    element: <AudienceTargeting />,
  },
];

export const connectionsCreativityRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.connectionsAndCreativity.id,
    path: `${BASE_PATHS.connectionsCreativity}`,
    element: <ConnectionsCreativityHome />,
  },

  // Resource Allocation Media
  {
    id: featureToggles.pillar.connectionsAndCreativity.submenus
      .resourceAllocationMedia.id,
    path: `${BASE_PATHS.connectionsCreativity}/resource-allocation-media`,
    element: (
      <Navigate
        to={`${BASE_PATHS.connectionsCreativity}/resource-allocation-media/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.connectionsAndCreativity.submenus
      .resourceAllocationMedia.id,
    path: `${BASE_PATHS.connectionsCreativity}/resource-allocation-media/:tab`,
    element: <ResourceAllocationMedia />,
  },
];

export const innovationRoutes: Route[] = [
  // Home
  {
    id: featureToggles.pillar.innovation.id,
    path: `${BASE_PATHS.innovation}`,
    element: <InnovationHome />,
  },

  // Innovation
  {
    id: featureToggles.pillar.innovation.submenus.innovation.id,
    path: `${BASE_PATHS.innovation}/innovation`,
    element: (
      <Navigate to={`${BASE_PATHS.innovation}/innovation/overview`} replace />
    ),
  },
  {
    id: featureToggles.pillar.innovation.submenus.innovation.id,
    path: `${BASE_PATHS.innovation}/innovation/:tab`,
    element: <Innovation />,
  },

  // Innovation Hub
  {
    id: featureToggles.pillar.innovation.submenus.innovationHub.id,
    path: `${BASE_PATHS.innovation}/innovation-performance`,
    element: (
      <Navigate
        to={`${BASE_PATHS.innovation}/innovation-performance/overview`}
        replace
      />
    ),
  },
  {
    id: featureToggles.pillar.innovation.submenus.innovationHub.id,
    path: `${BASE_PATHS.innovation}/innovation-performance/:tab`,
    element: <InnovationHub />,
  },
];

const developmentRoutes: Route[] = [
  // Components
  {
    id: featureToggles.developmentViewer,
    path: `${BASE_PATHS.development}/components`,
    element: <ComponentsPage />,
  },
  {
    id: featureToggles.developmentViewer,
    path: `${BASE_PATHS.development}/components/:tab`,
    element: <ComponentsPage />,
  },
];

export const allRoutes: Route[] = [
  // Base path
  {
    id: featureToggles.pillar.valueCreation.id,
    path: '/',
    element: <Navigate to={`${BASE_PATHS.valueCreation}`} replace />,
  },
  ...valueCreationRoutes,
  ...tradeExecutionRoutes,
  ...portfolioBrandRoutes,
  ...categoryRoutes,
  ...consumerRoutes,
  ...connectionsCreativityRoutes,
  ...developmentRoutes,
  ...innovationRoutes,
];
