import { COMMERCIAL_RESULTS_PATH } from 'pages/pillars/ValueCreation/CommercialResults/constants';
import { PERFORMANCE_TOOL_PATH } from 'pages/pillars/ValueCreation/PerformanceTool/constants';

export const ValueCreation = {
  Home: {
    pageSubtitle:
      'Analyze Value Creation performance across the 5 sustainable growth levers',
    breadcrumbPageName: 'Value Creation',
    globalSustainableGrowthOverview: {
      tooltip:
        'Sustainable growth is reliable topline growth that flows to the bottom line with a long-term horizon. We measure this at ABI with 5 key KPIs',
    },
    strategyDrivers: {
      title: 'Strategy Drivers',
      tooltip: 'Monitor the strategy trough these main KPIs',
    },
    tooltips: {
      volume: 'Total ABI volume sales to customer incluing all product types',
      netRevenue:
        'Income earned from volume, minus all excise taxes and discounts',
      cores:
        '<b>CO</b>mmercial <b>RES</b>ult which is the profit attributable to our brands. This is net revenue minus production, logistics, sales and marketing costs',
      marketShare:
        'ABI <b>Beer</b> volume as a % of total industry beer volume',
      brandPower:
        'Share of influence in the minds of consumers. It is the mental equivalent of market share for <b>Beer</b> and <b>Beyond Beer</b> products',
      abiLovers:
        'Percentage of the legal drinking age population who consume ABI <b>Beer</b> brands at least once a week',
      occasions:
        'Average weekly consumption of ABI <b>Beer</b> brands among ABI Beer drinkers',
      lda24Participation:
        'Percentage of the legal drinking age to 24 year old population who consume ABI <b>Beer</b> brands at least once in a month',
      leadPremium:
        'Lead the Beer category with premium products (super premium, premium, core+), focusing on markets with medium to high maturity',
      superiorCore:
        'Maintain and grow the Beer category with entry brands (core, value) across all market maturity scores',
      balancedChoices:
        'Diversify the Beer category with products that meet the new consumption profile, especially in markets with medium to high maturity',
      beyondBeer:
        'Opportunity to lead and grow a new alcoholic category that goes beyond beer, especially in developed markets',
    },
  },
  PerformanceTool: {
    defaultSubtitle: 'Analyze and understand performance drivers',
    volume: { subtitle: 'Analyze and understand volume performance drivers' },
    power: {
      subtitle: 'Analyze and understand brand power performance drivers',
    },
    net_revenue: {
      subtitle: 'Analyze and understand net revenue performance drivers',
    },
    market_share: {
      subtitle: 'Track competitive position and market presence',
    },
    cores: {
      subtitle: 'Analyze and understand performance drivers',
    },
    emptyBrandContribution: {
      title: 'Contribution by brand not available for this country',
    },
    exploreFurther: {
      commercialResults: {
        title: 'Commercial Data',
        description:
          'Continue analyzing country performance across business dimensions, such as channel, pack type, region, and more.',
        linkLabel: 'Go to Commercial Results',
        linkHref: COMMERCIAL_RESULTS_PATH,
        abbreviation: 'CR',
      },
      driversDecomposition: {
        title: 'Drivers Decomposition',
        description: 'Understand how key drivers impact Brand Performance',
        linkLabel: 'Go to WatchTower Drivers',
        linkHref: '',
        abbreviation: 'WT',
      },
    },
  },
  GrowthLeague: {
    seeFullRanking: 'See full ranking',
    leagues: {
      premier: 'Premier League',
      super: 'Super League',
    },
    Overview: {
      title: 'Overview',
      GrowthLeague: 'Growth League',
      LeagueWinners: {
        title: 'League Winners',
      },
    },
    Rankings: {
      title: 'Rankings',
      rankingBreakdown: 'Ranking Breakdown',
      tooltip: 'Rankings',
      League: 'League',
      Cup: 'Dashboard',
    },
    CupWinners: {
      title: 'Dashboard Winners',
      subtitle: 'Other Dashboards',
      MegabrandsDashboards: 'Megabrands Dashboards Brands',
      MegabrandsDashboardsCountry: 'Megabrands Dashboards Country',
      KaCupLeagueA: 'KA Dashboard League A',
      KaCupLeagueB: 'KA Dashboard League B',
      BeesCupAcceleration: 'BEES Dashboard Acceleration',
      BeesCupMaturity: 'BEES Dashboard Maturity',
      DtcCup: 'DTC Dashboard',
    },
    LeaguesLeaderboard: {
      title: 'Leagues Leaderboard',
      PremierLeague: 'Premier League',
      SuperLeague: 'Super League',
    },
  },
  PRPages: {
    volume: 'Volume',
    nr: 'Net Revenue',
    market_share: 'Market Share',
  },
  VolumePages: {
    countryMarketTitle: '{countryName} {kpiLabel}',
    countryMarketBrandsBreakdownTitle:
      '{countryName} {kpiLabel} Brands Breakdown',
  },
  CommercialResults: {
    title: 'Commercial Results',
    subtitle: 'Analyze and understand Commercial Results drivers',
    bigNumbers: {
      title: 'Overtime Performance',
    },
    performance: {
      tooltip:
        'This country presents at least 95% data accuracy vs. local reports for all key attributes (channel, region, pack, and brand).',
      waterfallTitle: 'Contribution',
      lineBarChart: {
        title: 'Monthly View',
        subtitlePrefix: 'Filtered by',
      },
    },
    exploreFurther: {
      financialData: {
        title: 'Financial Data',
        description:
          'Continue analyzing financial performance across multiple business dimensions.',
        linkLabel: 'Go to Performance Tool',
        linkHref: PERFORMANCE_TOOL_PATH,
        abbreviation: 'PT',
      },
      driversDecomposition: {
        title: 'Drivers Decomposition',
        description: 'Understand how key drivers impact Brand Performance',
        linkLabel: 'Go to WatchTower Drivers',
        linkHref: '',
        abbreviation: 'WT',
      },
    },
  },
};
