export const PortfolioBrand = {
  Overview: {
    title: 'Overview',
    tooltip: 'Overview of Sustainable Growth KPIs.',
    kpis: {
      volume: {
        title: 'Volume',
        tooltip:
          'Total ABI volume, comparing the selected period with the last year.',
        measure: 'k hl',
      },
      nr: {
        title: 'Net Revenue',
        tooltip:
          'Total Net Revenue, the total amount of money the company earns from sales, minus returns, allowances, and discounts.',
        measure: 'k hl',
      },
      cores: {
        title: 'CORES',
        tooltip:
          'Total CORES, a key KPI for brand profitability, calculated by subtracting the MACO.',
        measure: 'CORES',
      },
      market_share: {
        title: 'Market Share',
        tooltip:
          'Total Market Share, the percentage of total beer sales, indicating competitiveness and market presence.',
        measure: '%',
      },
      power: {
        title: 'Brand Power',
        tooltip:
          'Total Brand Power, that refers to the strength and influence of our brands.',
      },
    },
  },
  VolumeMarketShare: {
    title: 'Volume & Market Share',
    tooltip:
      'Here an overview of our Sustainable Growth KPIs Volume and Market Share to delve deeper into the analysis.',
    Pos: {
      title: 'POS',
      tooltip:
        'POS metrics is setup to understand the behavior of consumer group above the Legal Drink Age (LDA) of the specific country. Data is available since 2022.',
      kpis: {
        occasion: {
          title: 'Occasion',
          tooltip:
            'Purpose of occasion metrics should be to increase the frequency of Beer + Beyond Beer consumption occasions compared to total alcohol consumption occasions.',
          measure: '#',
        },
        p4w: {
          title: 'Participation',
          tooltip:
            'Purpose of participation metrics should be expanding consumer participation into the Beer + Beyond Beer category.',
          measure: 'P4W %',
        },
        serving: {
          title: 'Serving',
          tooltip:
            'Purpose of serving metrics should be to grow the total amount of Beer + Beyond Beer serving at a total population LDA + level, not individual level.',
          measure: '#',
        },
        cohort: {
          title: 'Participation by Cohort',
          tooltip:
            'Here an overview of Participation by cohort to delve deeper into the analysis.',
          measure: '%',
        },
      },
    },
  },
  NetRevenue: {
    title: 'Net Revenue',
    tooltip:
      'Here an overview of our Sustainable Growth KPI Net Revenue to delve deeper into the analysis.',
    kpis: {
      nr: {
        title: 'Net Revenue',
        tooltip:
          'Total Net Revenue, the total amount of money the company earns from sales, minus returns, allowances, and discounts.',
        measure: 'Mio USD',
      },
      nr_cpi: {
        title: 'NR/hl vs CPI',
        tooltip:
          'This metric compares Net Revenue per hectoliter (NR/hl) against the Consumer Price Index (CPI).',
        tooltipFooterContent:
          'Index: This KPI may have large values. Mouse over the numbers to see the full results',
        measure: '%',
      },
    },
  },
  Cores: {
    title: 'CORES',
    tooltip:
      'Here an overview of our Sustainable Growth KPI CORES to delve deeper into the analysis.',
    kpis: {
      cores: {
        title: 'CORES',
        tooltip:
          'Total CORES, a key KPI for brand profitability, calculated by subtracting the MACO.',
        measure: 'Mio USD',
      },
      pl_composition: {
        title: 'P&L Composition',
        tooltip:
          'Profit and Loss (P&L) composition refers to the breakdown of revenues, costs, and expenses that contribute to the net profit or loss of a company.',
        measure: 'Nominal',
      },
      sm: {
        title: 'S&M',
        tooltip:
          'Sales and Marketing (S&M) encompasses all activities related to promoting and selling products or services.',
        measure: 'Mio USD',
      },
      sm_of_maco: {
        title: 'S&M/hl and S&M % of MACO',
        tooltip:
          'S&M/hL: This metric measures Sales and Marketing expenses per hectoliter of product sold.',
        tooltipFooterContent:
          'S&M % of MACO: This metric represents Sales and Marketing expenses as a part of Marginal Contribution (MACO).',
        measure: '%',
      },
    },
  },
  BrandPower: {
    title: 'Brand Power Drivers',
    tooltip:
      'Here an overview of our Sustainable Growth KPI Brand Power to delve deeper into the analysis. On the right side we will have the period of analysis, the flags of the Country and the Brand (reflecting the selection of the user on the page filter).',
    kpis: {
      brandPower: {
        title: 'Brand Power Drivers',
        titleAllBrands: 'Power',
        tooltip:
          'Total Brand Power, that refers to the strength and influence of our brands.',
        measure: '%',
      },
      meaning: {
        title: 'MEANING',
        tooltip:
          "The ‘Meaningful' KPI measures how much affinity the consumer has to the brand and/or if they consider that it meets their needs.",
      },
      affinity: {
        title: 'Affinity',
        tooltip: 'A measure of how people feel towards a brand.',
      },
      meetNeeds: {
        title: 'Meet Needs',
        tooltip: 'Measure of how much each brand meet the consumers needs.',
      },
      difference: {
        title: 'DIFFERENCE',
        tooltip:
          'Measures how different the brand is compared to others and/or drives the trend within its category.',
      },
      dynamic: {
        title: 'Dynamic',
        tooltip: 'Measure of how much the brand dictates or creates trends.',
      },
      unique: {
        title: 'Unique',
        tooltip: 'Measure of how unique a brand is compared to others.',
      },
      salience: {
        title: 'SALIENCE',
        tooltip:
          'If the brand is top of mind when activated by consuming occasions within its category.',
      },
      powerAwareness: {
        'unaided-awareness': {
          title: 'Unaided Awareness',
          tooltip:
            'Measures the ability of consumers to recall a brand without any prompts or cue.',
        },
        'brand-clarity': {
          title: 'Brand Clarity',
          tooltip: 'Refers to how clearly a brand communicates its identity.',
        },
      },
      occasion: {
        title: 'Occasion Based Salience',
        tooltip:
          'Measures the brand`s relevance and recall in particular situations or events.',
      },
      imageries: {
        title: 'Imageries',
        tooltip:
          'Pertains to the visual and sensory elements associated with a brand.',
        measure: '%',
      },
    },
    Empty: {
      noBrandSelectedTitle: 'No Brand selected',
      noBrandSelectedDescription:
        'Meaning, Difference and Salience are only available at the brand level. Please select a brand using the filter to access this information.',
      selectACountry: 'Select a Brand',
    },
  },
  BrandPowerBook: {
    PowerBook: {
      title: 'Brand Power Results',
      tooltip:
        "An analysis of Brand Power's evolution over time, with a breakdown by zone, countries, and brands, including competitor comparisons.",
      BigNumbers: {
        lq: {
          tooltip:
            'Refers to the change in Power compared to the directly previous quarter.',
        },
        ly: {
          tooltip:
            'Refers to the change in Power compared to the same quarter of the previous year.',
        },
      },
      zoneMaturity: {
        zone: 'Zone',
        maturity: 'Maturity',
      },
      PerformanceTrend: {
        title: 'Power Performance and Trend',
        YearPowerVsAc: {
          title: 'Year Power vs AC',
          subtitle: 'Power comparison for past years vs AC',
          tooltip:
            'Consolidated brand power overtime with a comparison of the Last Year total brand power vs the accumulated quarter results.',
        },
        TrendOverTime: {
          title: 'Trend Over Time',
          subtitle: 'Power trend for quarters',
          tooltip:
            'Consolidated brand power overtime with a comparison of the Last Year total brand power vs the current quarter results.',
        },
      },
      PerformanceBreakdown: {
        title: 'Performance Breakdown',
        showCompetitorToggle: {
          title: 'Show Competitor',
        },
        performance: {
          zone: 'Zone Performance',
          maturity: 'Maturity Performance',
          subtitle: 'Power performance by',
        },
        details: {
          zone: 'Power performance in the zone by',
          maturity: 'Power performance by',
          noRowsMessage: {
            title: 'No Zone Selected.',
            description:
              'Please click a Zone in the table beside to see the BU breakdown.',
          },
        },
      },
      SummaryForPower: {
        title: 'Summary for Power',
        segmentPerformance: {
          title: 'Segment Performance',
          subtitle: 'Select a Segment to see the Brand Breakdown',
        },
        portfolioPerformance: {
          title: 'Portfolio Performance',
          subtitle: 'Select a Portfolio to see the Brand Breakdown',
        },
        brandBreakdown: {
          title: 'Brand Breakdown',
          tooltip:
            'A deep dive into brand power by brand, including the MDS breakdown.',
          noRowsMessage: {
            title: 'No Portfolio or Segment selected.',
            description:
              'Please click a Portfolio or Segment in the table above to see the Brand Breakdown.',
          },
        },
      },
      CountryContribution: {
        title: 'Top 10 Countries Countribution',
        subtitle: 'Power delta in the top 10 countries',
      },
      TopCountryContribution: {
        titleTotalAbi: 'Total ABI Countries',
        titleMegaBrands: 'Megabrands',
      },
    },
  },
  Home: {
    pageSubtitle:
      'Prioritize our portfolio and ensure each brand is positioned for long-term success',
    containerTitleIncreaseBrandPower: 'Increase Brand Power',
    containerTitleHowWeDoIt: 'How We do it',
    portfolioStrategy: {
      title: '3.1 - Portfolio Strategy',
      description:
        'Segment the portfolio according to the Mega Brands framework',
    },
    brandWorld: {
      title: '3.2 - Brand World',
      description:
        'Develop a distinctive brand world based on brand and consumer insights',
      alt: 'Brand World',
    },
    brandPlatforms: {
      title: '3.3 - Brand Platforms',
      description:
        'Establish ownable brand platforms that align with brand DNA, consumer passion points, and beer occasions',
      alt: 'Brand Platforms',
    },
    targetAudiences: {
      title: '3.4 - Target Audiences',
      description: 'Assess brand and portfolio superiority vs. key competitors',
    },
  },
  PortfolioPerformance: {
    OverallPerformance: {
      title: 'Overall Performance',
      tooltip:
        'Performance of our main KPIs analyzed by the ABI categories, comparing the selected period with last year.',
    },
    PortfolioPerformance: {
      title: 'Portfolio Performance',
      tooltip: 'teste',
    },
    TotalCountryResults: {
      title: 'Total Country Results',
      tooltip:
        'Overview of how our Lead and Grow KPIs are performing, comparing the selected period with last year.',
      Kpi: {
        tooltip: {
          Volume:
            'Total ABI volume, comparing the selected period with the last year.',
          'Net Revenue':
            'Total Net Revenue, the total amount of money the company earns from sales, minus returns, allowances, and discounts.',
          CORES:
            'Total CORES, a key KPI for brand profitability, calculated by subtracting sales and marketing costs.',
          'Market Share':
            'Total Market Share, the percentage of total beer sales, indicating competitiveness and market presence.',
          'Brand Power':
            'Total Brand Power, that refers to the strength and influence of our brands.',
        },
      },
    },
    CategoryGrowthLevers: {
      title: 'Category Growth Levers',
      tooltip:
        'Performance of our main KPIs analyzed by the ABI portfolio, comparing the selected period with last year.',
      Kpi: {
        tooltip: {
          'Superior Core':
            'Balances quality and affordability in the core and value segments.',
          'Beer Participation':
            'Monitors the increase in consumption frequency by category and consumer profile.',
          'Beyond Beer':
            'Refers to the category of alcoholic beverages that are alternatives to beer.',
          'Balanced Choices':
            'Expands Non-Alc Beer relevance for diverse moments.',
          'Lead Premium':
            'Elevates quality and exclusivity in Core+, Premium, and Super Premium segments.',
        },
      },
    },
    Breakdowns: {
      title: 'Breakdowns',
      tooltip:
        'Deep dive analyze the performance for the main KPIs by region, category, and portfolio.',
    },
    Pnl: {
      title: 'P&L Overview',
      tooltip: 'Financial report to compare portfolio performance',
      tableCustomization: 'Table Customization',
      noCountrySelectedTitle: 'No country selected',
      noCountrySelectedDescription:
        'The information here is country-specific and needs a selection to display accurate results.',
      selectACountry: 'Select a Country',
    },
  },
};
