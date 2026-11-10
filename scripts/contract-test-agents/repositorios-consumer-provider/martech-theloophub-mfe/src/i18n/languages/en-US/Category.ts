export const Category = {
  Home: {
    pageSubtitle: 'Define the key opportunities to Lead and Grow the category',
    breadcrumbPageName: 'Category',
    containerTitleGrow: 'Grow the Category',
    containerTitleLead: 'Lead the Category',
    howWeDoIt: 'How We do it',
    categoryUnderstanding: {
      title: '1.1 - Category Understanding',
      description:
        'Understand which of the growth levers offer the best opportunities in your market, and identify the category "must wins" underpinning each lever',
      alt: 'Category Understanding',
    },
    consumerMotivation: {
      title: '1.2 - Consumer Motivation',
      description:
        'Define the brand portfolio through a deep understanding of Consumer Motivations, and allocate megabrands & sustain brands to key motivations',
      alt: 'Consumer Motivation',
    },
    consumerBehavior: {
      title: '1.3 - Consumer Behavior',
      description:
        'Assess consumer behavior to identify key opportunities to grow via Participation, Occasions and Servings.',
      alt: 'Consumer Behavior',
    },
  },
  POSBook: {
    GrowTheCategory: {
      title: 'Category Overview',
      tooltip:
        'Overview of the alcohol category, including its four subcategories, to understand the overall performance.',
      country: {
        title: 'by Country',
      },
      'maturity-zone': {
        title: 'by Zone and Maturity',
      },
      cohort: {
        title: 'by Cohort',
      },
    },
    LeadTheCategory: {
      title: 'Beer Category Deep Dive',
      tooltip:
        'An in-depth analysis of the beer category by manufacturer and brand to evaluate our performance relative to competitors.',
      manufacture: {
        title: 'Manufacture Participation',
        otherCompetitors: {
          tooltip: {
            firstLine:
              'To identify the local competitor for each country, hover the mouse over the respective bar.',
            secondLine:
              'If a country does not have a competitor bar, it means there is no local competitor in that country.',
          },
        },
      },
      brandParticipation: {
        title: 'Key Brand Participation',
        portfolio: {
          title: 'Participation by Portfolio',
        },
        'global-brands': {
          title: 'Participation by Global Brands',
        },
        rankings: {
          title: 'Brand Ranking by Participation',
        },
      },
    },
    USA: {
      alert: {
        title: 'Q2 USA Data not available',
        message:
          "The U.S. data is under review, and it's impacting the Global, NAZ and M3 aggregated values.",
      },
    },
  },
  CategoryHealth: {
    title: 'Category Health',
    description: 'Monitor category performance across markets',
    tooltip:
      'The Category Health capability provides key KPIs to monitor category performance and understand if the category is growing.',
    Overview: {
      title: 'Overview',
      tooltip:
        'Key industry metrics for alcohol categories to assess their health and evolution',
    },
    Volume: {
      Beer: {
        tooltip:
          'Total beer volume consumed by legal drinking age consumers across all brewers and brands in the market.',
      },
      BeyondBeer: {
        tooltip:
          'Total beyond beer volume consumed by legal drinking age consumers across all brewers and brands in the market.',
      },
      BeerBeyondBeer: {
        tooltip:
          'Total beer + beyond beer volume consumed by legal drinking age consumers across all brewers and brands in the market.',
      },
    },
    ICL: {
      BICL: {
        tooltip:
          'BICL = Beer Industry Consumption Level. This represents the amount of beer consumed per legal drinking age consumer in the market.\nBICL = Beer Volume / # LDA+ Consumers',
      },
      BYB: {
        tooltip:
          'BYB ICL = Beyond Beer Industry Consumption Level. This represents the amount of beyond beer consumed per legal drinking age consumer in the market.\nBYB ICL = Beyond Beer Volume / # LDA+ Consumers',
      },
      BeerBeyondBeer: {
        tooltip:
          'B+BYB ICL = Beer + Beyond Beer Industry Consumption Level. This represents the amount of beer + beyond beer consumed per legal drinking age consumer in the market.\nB+BYB ICL = B+BYB Volume / # LDA+ Consumers',
      },
    },
    SOT: {
      Beer: {
        tooltip: 'The share of beer within total alcohol.',
      },
      BeyondBeer: {
        tooltip: 'The share of beyond beer within total alcohol.',
      },
      BeerBeyondBeer: {
        tooltip: 'The share of beer+beyond beer within total alcohol.',
      },
    },
    Participation: {
      Beer: {
        tooltip:
          '% of the legal drinking age population who consume beer (every 4 weeks)',
      },
      BeyondBeer: {
        tooltip:
          '% of the legal drinking age population who consume beyond beer (every 4 weeks)',
      },
      BeerBeyondBeer: {
        tooltip:
          '% of the legal drinking age population who consume beer + beyond beer (every 4 weeks)',
      },
    },
    WMTBB: {
      tooltip:
        'WMTBB = Working Minutes to Buy Beer. Measures the amount of time the average person in the market needs to work to be able to afford a 1/2 liter of beer.\nWMTBB = Avg Beer $ per half liter / (Household consumption per capita / working minutes per year)',
    },
  },
};
