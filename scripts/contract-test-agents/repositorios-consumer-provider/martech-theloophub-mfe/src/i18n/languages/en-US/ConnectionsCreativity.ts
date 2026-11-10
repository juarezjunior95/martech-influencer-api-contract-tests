export const ConnectionsCreativity = {
  Home: {
    pageSubtitle:
      'Connect with consumers effectively and use creativity to solve consumer & business problems',
    breadcrumbPageName: 'Connections & Creativity',
    howWeDoIt: 'How We Do It',
    mediaEffectiveness: 'Media Effectiveness',
    businessEfficiency: 'Business Efficiency',
    resourceAllocation: {
      title: '5.1 - Resource Allocation',
      description:
        'Design Connections plans in accordance with media best practices & resource allocation guidelines',
    },
    creativeDevelopment: {
      title: '5.2 - Creative Development',
      description:
        'Develop Creative through a cross-functional briefing and assessment process, supported by our CreativeX ecosystem',
      alt: 'Creative Development',
    },
    abiConnect: {
      title: '5.3 - ABI Connect',
      description:
        'Global tool for social risk intelligence, influencer management (Genome) and real-time social insights & trends monitoring to enable brand governance & relevance',
      altQrcode: 'ABI Connect QR Code',
      altLogo: 'ABI Connect',
    },
  },
  NoCountrySelected: {
    noCountrySelectedTitle: 'No country selected',
    noCountrySelectedDescription:
      'The information here is country-specific and needs a selection to display accurate results.',
    selectACountry: 'Select a Country',
  },
  ResourceAllocationMedia: {
    Overview: {
      title: 'Media Overview',
      tooltip: `A summary of our Media KPIs performance`,
      SummaryBreakdown: {
        title: 'Summary ',
        breakdown_toggle: 'Breakdown',
        ranking_toggle: 'Ranking',
        media_spend: {
          title: 'Media Spend',
          measure: '[Mio USD]',
        },
        mega_brands: {
          title: 'Megabrands QWOA',
          measure: '[% Megabrands >= 45 QWOA]',
        },
        campaigns: {
          title: 'Key Campaigns QWOA',
          measure: '[% key campaigns > 12 weeks on air]',
        },
        non_working_money: {
          title: 'Non-Working Money',
          measure: '[%]',
        },
        empty: {
          title: 'No Data Available',
          measure: 'No Data Available',
        },
      },
      DeepDive: {
        title: 'Deep Dive',
        tooltip: `This page will brings a deep dive into the media spend and allocation into the company's countries and brands.`,
        tableTitles: {
          media_spend: 'Media Spend by',
          qwoaByCountry: 'Megabrands >= 45 QWOA by',
          qwoaByBrand: 'QWOA by',
          campaings: 'Campaigns > 12 weeks on air by',
          nwm: 'Non-Working Money by',
          measurePercentage: '[%]',
          measureMioUsd: '[Mio USD]',
        },
        breakdown_toggle: 'Breakdown',
        ranking_toggle: 'Ranking',
      },
      Ranking: {
        titles: {
          mediaSpendGlobal: 'Key campaigns > 12 weeks on air by Country',
          mediaSpendCountries: 'Key campaigns > 12 weeks on air by Brand',
          megabrandsGlobal: 'Megabrands >= 45 QWOA by Country',
          megabrandsCountries: 'Megabrands >= 45 QWOA by Brand',
          qwoaGlobal: 'Megabrands >= 45 QWOA by Country',
          qwoaCountries: 'QWOA by Brand',
          campaignsGlobal: 'Campaigns > 12 weeks on air by Country',
          campaignsCountries: 'Campaigns > 12 weeks on air by Brand',
          resourceAllocationGlobal: 'Non-Working Money by Country',
          resourceAllocationCountries: 'Non-Working Money by Brand',
          connectorGlobal: 'in the',
          connectorCountries: 'of',
          topCountries: 'Top {countriesQuantity} Countries',
          countryBrands: 'Country Brands',
          measureHash: '[# of weeks]',
          measurePercentage: '[%]',
          measureMioUsd: '[%]',
        },
        tooltips: {
          mediaSpend:
            'The ranking shows the media spend allocation across different regions and brands, helping identify investment priorities.',
          megabrands:
            'Megabrands Guideline: 45 QWOA. Other brands Guideline: 35 QWOA.',
          qwoa: 'Quality Weighted On Air (QWOA) measures the effectiveness and reach of advertising campaigns based on duration and quality metrics.',
          campaigns:
            'The metric tracks campaigns that run for more than 12 weeks on air, showing sustained advertising efforts and brand consistency.',
          resourceAllocationGlobal: 'NWM Global Guideline: 17%',
          resourceAllocationCountries:
            'Global Brands Guideline: 17%. Country Brands Guideline: 17%.',
          resourceAllocationLabelIconCountries:
            'As a Global Brand, this brands has 17% NWM Guideline',
        },
      },
    },
    ResourceAllocationTab: {
      title: 'Resource Allocation',
      tooltip: `This page will brings a overview about resource allocation into the company's countries and brands`,
      sectionTitle: 'Marketing Package Comparison',
      sectionDescription:
        'Here you can find the most relevant information concerning the investment per category:',
      sectionComparisonValueLabel: 'Comparison',
      sectionComparisonSelectAllLabel: 'Select all',
      sectionComparisonAllSelectedChip: 'All',
    },
    InvestmentBreakdownTab: {
      title: 'Investment Breakdown',
      tooltip: `This page will brings an overview about resource allocation into the company's countries and brands`,
      noCountrySelectedTitle: 'No country selected',
      noCountrySelectedDescription:
        'The information here is country-specific and needs a selection to display accurate results.',
      selectACountry: 'Select a Country',

      USA: {
        alert: {
          title: 'US Megaplatform allocation under review',
          message:
            "The US Megaplatform allocation is under review and it’s impacting the brand 'Spon & Act totals.",
        },
      },
    },
    CampaignDeepDiveTab: {
      title: 'Campaign Deep Dive',
      CampaignsPerformance: {
        title: 'Key Campaigns Performance',
        tooltip: `This page will brings a deep dive into the campaigns performance into the company's countries and brands`,
        campaignTracker: {
          title: 'Key Campaign Tracker by Brand',
        },
      },
    },
    MediaDrilldoownTab: {
      globalView: {
        title: {
          media_qwoa: 'Media QWOA in the top 12 countries',
          campaign_qwoa: 'Key campaigns > 12 QWOA in the top 12 countries',
          non_working_money:
            'Non-Working Money by Brand in the top 12 countries',
        },
        tooltip: {
          media_qwoa:
            'Megabrands Guideline: 45 QWOA. Other brands Guideline: 35 QWOA',
          non_working_money:
            'Global Brands Guideline: 17%. Country Brands Guideline: 17%',
        },
        measure: {
          media_qwoa: '[# of weeks]',
          campaign_qwoa: '[#]',
          non_working_money: '[%]',
        },
      },
      countryView: {
        title: {
          media_qwoa: 'Media QWOA by Brand',
          campaign_qwoa: 'Key campaigns QWOA by Brand',
          non_working_money: 'Non-Working Money by Portfolio',
        },
        tooltip: {
          media_qwoa:
            'Megabrands Guideline: 45 QWOA. Other brands Guideline: 35 QWOA',
          non_working_money:
            'Global Brands Guideline: 17%. Country Brands Guideline: 17%',
        },
        measure: {
          media_qwoa: '[# of weeks]',
          campaign_qwoa: '[# of weeks]',
          non_working_money: '[%]',
        },
      },
    },
  },
};
