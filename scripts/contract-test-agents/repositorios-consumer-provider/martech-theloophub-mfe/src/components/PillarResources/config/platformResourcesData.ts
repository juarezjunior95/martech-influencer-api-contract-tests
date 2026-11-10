import productOverviewPdf from 'assets/pdf/product-overview.pdf';
import {
  StaticPlatformResource,
  StaticPlatformResourcesData,
} from 'components/PillarResources/config/types';
import {
  PlatformPillar,
  PlatformResourcesResponse,
  PlatformResourceTypeOption,
} from 'components/PillarResources/types';
import { featureToggles } from 'config/featureToggle';

const PILLAR_IDS = {
  category: 16,
  consumer: 21,
  portfolioBrand: 26,
  innovation: 31,
  connectionsCreativity: 36,
  tradeExecution: 41,
  valueCreation: 46,
} as const;

const RESOURCE_TYPE_IDS = {
  powerBI: 6,
  report: 11,
  learningMaterial: 61,
  tradeExecution: 66,
  sharePoint: 71,
} as const;

const PLATFORM_RESOURCE_TYPE_NAMES = {
  powerBI: 'Power BI',
  report: 'Report',
  learningMaterial: 'Learning Material',
  tradeExecution: 'Trade Execution',
  sharePoint: 'SharePoint',
} as const;

const platformPillars: PlatformPillar[] = [
  {
    id: PILLAR_IDS.category,
    name: 'Category',
    description: 'Define the key opportunities to Lead and Grow the category',
    hexaIcon: 'beer',
    resourcesIds: [6, 31, 51, 101, 106],
  },
  {
    id: PILLAR_IDS.consumer,
    name: 'Consumer',
    description: 'Define and deeply understand our consumer target',
    hexaIcon: 'users',
    resourcesIds: [71, 101, 106],
  },
  {
    id: PILLAR_IDS.portfolioBrand,
    name: 'Portfolio & Brand',
    description: 'Prioritize brands and platforms to drive growth at scale',
    hexaIcon: 'beerbottles',
    resourcesIds: [1, 11, 16, 36, 41, 46, 66, 101, 106, 156],
  },
  {
    id: PILLAR_IDS.innovation,
    name: 'Innovation',
    description: 'Optimize our portfolio through sustainable innovation',
    hexaIcon: 'lightbulb',
    resourcesIds: [76, 101, 106],
  },
  {
    id: PILLAR_IDS.connectionsCreativity,
    name: 'Connections & Creativity',
    description: 'Connect with our consumers effectively to drive growth',
    hexaIcon: 'barchart4',
    resourcesIds: [21, 101, 106],
  },
  {
    id: PILLAR_IDS.tradeExecution,
    name: 'Trade Execution',
    description: 'Build brands and drive growth at the point-of-purchase',
    hexaIcon: 'cart',
    resourcesIds: [81, 101, 106],
  },
  {
    id: PILLAR_IDS.valueCreation,
    name: 'Value Creation',
    description: 'Ensure that we are actually creating value',
    hexaIcon: 'dollarsign',
    resourcesIds: [26, 61, 121, 126, 131, 136, 141, 146, 161],
  },
];

const platformResources: StaticPlatformResource[] = [
  {
    id: 1,
    name: 'Portfolio Performance',
    summary: 'Performance of our main KPIs analyzed by the ABI categories.',
    mfeUrl: '/reports/portfolio-brand/portfolio-performance',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.portfolioBrand.submenus.portfolioPerformance.id,
  },
  {
    id: 156,
    name: 'Country, Brand and Portfolio P&L',
    summary: '',
    mfeUrl: '/reports/portfolio-brand/pnl',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.portfolioBrand.submenus.pnl.id,
  },
  {
    id: 161,
    name: 'Commercial Results',
    summary:
      'Source of truth for analyzing commercial performance and key drivers across multiple business dimensions.',
    mfeUrl: '/value-creation/commercial-results',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.valueCreation.submenus.commercialResults.id,
  },
  {
    id: 6,
    name: 'POS Deep Dive Power BI',
    summary:
      "Please contact Marcus Vinicius if you don't have access: marcus.vinicius-ext2@ab-inbev.com\r\n\r\nSelf-service Power BI to help you deep dive into the POS information",
    mfeUrl: 'https://abi.tools/s/pos',
    pillarsIds: [PILLAR_IDS.category],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 11,
    name: 'Brand Power Drivers',
    summary:
      'Overview of our Sustainable Growth KPIs to delve deeper into the analysis.',
    mfeUrl: '/reports/portfolio-brand/brand-analysis',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.portfolioBrand.submenus.brandAnalysis.id,
  },
  {
    id: 16,
    name: 'Brand Power - Power BI',
    summary:
      "Please contact Manoela Nogueira if you don't have access: manoela.nogueira@ab-inbev.com",
    mfeUrl: 'https://abi.tools/s/brandguidance',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 21,
    name: 'Media & Campaign Results',
    summary:
      'Most relevant information concerning the investment per category.',
    mfeUrl: '/reports/connections-creativity/resource-allocation-media',
    pillarsIds: [PILLAR_IDS.connectionsCreativity],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.id,
  },
  {
    id: 26,
    name: 'Growth League',
    summary:
      'Inspiring, ranking & recognizing commercial excellence through a BU-level competition.',
    mfeUrl: '/reports/value-creation/growth-league',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.valueCreation.submenus.growthLeague.id,
  },
  {
    id: 31,
    name: 'POS Results',
    summary: 'Standard views showing how the category is evolving.',
    mfeUrl: '/reports/category/pos',
    pillarsIds: [PILLAR_IDS.category],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.category.submenus.posBook.id,
  },
  {
    id: 36,
    name: 'Brand Power Results',
    summary:
      'Standard view to understand Brand Power, which refers to the strength and influence of a brand.',
    mfeUrl: '/reports/portfolio-brand/brand-power-book',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
  },
  {
    id: 41,
    name: 'Beyond Beer Control Tower',
    summary:
      "Please contact Henrique Leite if you don't have access: henrique.leite@ab-inbev.com",
    mfeUrl: 'https://abi.tools/s/beyondbeer',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 46,
    name: 'NA Beer Control Tower',
    summary:
      "Please contact Henrique Leite if you don't have access: henrique.leite@ab-inbev.com",
    mfeUrl: 'https://abi.tools/s/nabeer',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 51,
    name: 'Category Health',
    summary: 'Key KPIs to monitor category performance.',
    mfeUrl: '/reports/category/category-health',
    pillarsIds: [PILLAR_IDS.category],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.category.submenus.categoryHealth.id,
  },
  {
    id: 61,
    name: 'Volume Performance Review',
    summary:
      'Performance of Volume analyzed by Growth levers, Top brands and Must win markets.',
    mfeUrl: '/reports/value-creation/volume-pages/global',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.valueCreation.submenus.volumePages.id,
  },
  {
    id: 66,
    name: 'Brand Power Results Export',
    summary: '',
    mfeUrl: '/reports/portfolio-brand/brand-power-book-export',
    pillarsIds: [PILLAR_IDS.portfolioBrand],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.portfolioBrand.submenus.brandPowerBookExport.id,
  },
  {
    id: 71,
    name: 'Audience Targeting',
    summary: 'POS and Brand Power measures for Core and Halo Audiences.',
    mfeUrl: '/reports/consumer/audience-targeting/audience-definition',
    pillarsIds: [PILLAR_IDS.consumer],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.consumer.submenus.audienceTargeting.id,
  },
  {
    id: 76,
    name: 'Innovation Performance',
    summary:
      'Know the Innovation process to optimize our portfolio towards long-term, scalable growth.',
    mfeUrl: '/reports/innovation/innovation',
    pillarsIds: [PILLAR_IDS.innovation],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.innovation.submenus.innovation.id,
  },
  {
    id: 81,
    name: 'BEES Distribution',
    summary: 'Visualize trade execution performance month-over-month.',
    mfeUrl: '/reports/trade-execution/bees-distribution',
    pillarsIds: [PILLAR_IDS.tradeExecution],
    typesIds: [RESOURCE_TYPE_IDS.report],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    reportVisibilityToggleKey:
      featureToggles.pillar.tradeExecution.submenus.beesDistribution.id,
  },
  {
    id: 101,
    name: 'Marketing Academy',
    summary:
      'Download the ONE ABI WAY consumer playbook to understand how to execute the methodology',
    mfeUrl: '/',
    pillarsIds: [
      PILLAR_IDS.consumer,
      PILLAR_IDS.category,
      PILLAR_IDS.portfolioBrand,
      PILLAR_IDS.innovation,
      PILLAR_IDS.connectionsCreativity,
      PILLAR_IDS.tradeExecution,
    ],
    typesIds: [RESOURCE_TYPE_IDS.learningMaterial],
    comingSoon: true,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 106,
    name: 'Playbook',
    summary:
      'Download the ONE ABI WAY consumer playbook to understand how to execute the methodology',
    mfeUrl: '/',
    pillarsIds: [
      PILLAR_IDS.consumer,
      PILLAR_IDS.category,
      PILLAR_IDS.portfolioBrand,
      PILLAR_IDS.innovation,
      PILLAR_IDS.connectionsCreativity,
      PILLAR_IDS.tradeExecution,
    ],
    typesIds: [RESOURCE_TYPE_IDS.learningMaterial],
    comingSoon: true,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  // {
  //   id: 116,
  //   name: 'Marketing campaign',
  //   summary: 'Create your own promotional marketing campaign.',
  //   mfeUrl: '/marketing-campaigns-platforms',
  //   pillarsIds: [PILLAR_IDS.tradeExecution],
  //   typesIds: [RESOURCE_TYPE_IDS.tradeExecution],
  //   comingSoon: false,
  //   subPillar: null,
  //   options: [],
  //   isUserFavorite: false,
  //   openInNewTab: true,
  // },
  {
    id: 121,
    name: 'Growth League Handbook',
    summary: 'Comprehensive Guide for all 2026 Growth League KPIs.',
    mfeUrl:
      'https://anheuserbuschinbev.sharepoint.com/:p:/s/GGCapabilities/IQBu4dIkofSiTKRPMN5uvVuDAbJOMidst4_ILjQybrW7hgo?CID=98744952-1c9d-540a-e13c-c81e1e9a869a',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.learningMaterial],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 126,
    name: 'BEES Acceleration Index',
    summary:
      'Source of truth and additional resources related to the BEES Acceleration Index Dashboard.',
    mfeUrl:
      'https://app.powerbi.com/groups/me/reports/fd276c25-dda9-4adb-8b04-badae8f4c409/5f53c08e61d34a686803?ctid=cef04b19-7776-4a94-b89b-375c77a8f936&experience=power-bi&bookmarkGuid=b8a71c54-2dfb-434a-ad2c-8937af5a7002',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 131,
    name: 'DTC PBI',
    summary:
      'Source of truth and additional resources related to the DTC Dashboard.',
    mfeUrl:
      'https://app.powerbi.com/groups/me/reports/6ca887bd-9767-4ffe-9d06-a10a5a7e88f8/b185267f59ca6798d9b1?ctid=cef04b19-7776-4a94-b89b-375c77a8f936&experience=power-bi',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 136,
    name: 'BEES Maturity Index',
    summary:
      'Source of truth and additional resources related to the BEES Maturity Index Dashboard.',
    mfeUrl:
      'https://app.powerbi.com/groups/me/apps/d161adf9-72a1-46c2-967c-2d7c2e9501ee/reports/586e3d37-987c-4fb3-8aaf-1305accb7b57/f9bd97fe71e8748a7cd2?ctid=cef04b19-7776-4a94-b89b-375c77a8f936&experience=power-bi',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.powerBI],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 141,
    name: 'Key Account',
    summary:
      'Source of truth and additional resources related to the Key Account Dashboard.',
    mfeUrl: 'https://anheuserbuschinbev.sharepoint.com/sites/KeyAccounts',
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.sharePoint],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  },
  {
    id: 146,
    name: 'Product Overview',
    summary: 'Product functionality and usage guidance',
    mfeUrl: productOverviewPdf,
    pillarsIds: [PILLAR_IDS.valueCreation],
    typesIds: [RESOURCE_TYPE_IDS.learningMaterial],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
    openInNewTab: true,
  },
];

const platformResourceTypes: PlatformResourceTypeOption[] = [
  {
    id: RESOURCE_TYPE_IDS.powerBI,
    name: PLATFORM_RESOURCE_TYPE_NAMES.powerBI,
    hexaColor: 'red',
  },
  {
    id: RESOURCE_TYPE_IDS.report,
    name: PLATFORM_RESOURCE_TYPE_NAMES.report,
    hexaColor: 'orange',
  },
  {
    id: RESOURCE_TYPE_IDS.learningMaterial,
    name: PLATFORM_RESOURCE_TYPE_NAMES.learningMaterial,
    hexaColor: 'lime',
  },
  {
    id: RESOURCE_TYPE_IDS.tradeExecution,
    name: PLATFORM_RESOURCE_TYPE_NAMES.tradeExecution,
    hexaColor: 'orange',
  },
  {
    id: RESOURCE_TYPE_IDS.sharePoint,
    name: PLATFORM_RESOURCE_TYPE_NAMES.sharePoint,
    hexaColor: 'blue',
  },
];

const platformResourcesStatic: StaticPlatformResourcesData = {
  platformPillars,
  platformResources,
  platformResourceTypes,
};

const REPORT_VISIBILITY_TOGGLE_KEYS: string[] = Array.from(
  new Set(
    platformResources
      .map((resource) => resource.reportVisibilityToggleKey)
      .filter((key): key is string => typeof key === 'string'),
  ),
);

const RESOURCE_ID_TO_TOGGLE_KEY: Readonly<Record<number, string>> =
  platformResources.reduce<Record<number, string>>((acc, resource) => {
    if (resource.reportVisibilityToggleKey) {
      acc[resource.id] = resource.reportVisibilityToggleKey;
    }
    return acc;
  }, {});

const toPlatformResourcesResponse = (
  data: StaticPlatformResourcesData,
): PlatformResourcesResponse => ({
  platformPillars: data.platformPillars,
  platformResources: data.platformResources.map(
    ({ reportVisibilityToggleKey: _toggleKey, ...resource }) => resource,
  ),
  platformResourceTypes: data.platformResourceTypes,
});

export {
  PLATFORM_RESOURCE_TYPE_NAMES,
  platformResourcesStatic,
  REPORT_VISIBILITY_TOGGLE_KEYS,
  RESOURCE_ID_TO_TOGGLE_KEY,
  toPlatformResourcesResponse,
};
