export const Consumer = {
  Home: {
    pageSubtitle: 'Define and deeply understand our key consumer audiences',
    breadcrumbPageName: 'Consumer',
    howWeDoIt: 'How We Do It',
    increaseABILovers: 'Increase ABI Lovers',
    increaseParticipation: 'Increase Participation',
    targetAudiences: {
      title: '2.1 - Target Audiences',
      description:
        "Clearly define each brand's core consumers and potential halo consumers",
    },
    understandingAudiences: {
      title: '2.2 - Understanding Audiences',
      description:
        'Deeply understand core and expansion consumers through consumer intimacy programs.',
      alt: 'Understanding Audiences',
    },
    jobsToBeDone: {
      title: '2.3 - Jobs to be done',
      description:
        'Identify the specific behaviors to change in order to drive growth with the selected audiences',
      alt: 'Jobs to be done',
    },
  },
  AudienceTargeting: {
    title: 'Audience Targeting',
    description: 'Analyze and understand the brands audience drivers.',
    Definition: {
      BrandAudience: {
        title: 'Brand Audience',
        tooltip: {
          title: 'Brand Audience',
          description:
            'Defines the Brand’s Core and Halo Audiences based on P/O/S declared behavior.',
        },
        emptyMessage: {
          title: 'No data available',
          description: 'No data available to current country',
        },
        coreAudience: {
          tooltip: {
            title: 'Core Audience',
            subtitle:
              'Primary audience that concentrates at least 50% of the brand’s declared volume (POS).',
            text: 'Defined using gender, age and income cohorts where the brand over‑indexes.',
          },
        },
        haloAudience: {
          tooltip: {
            title: 'Halo Audience',
            subtitle:
              'Adjacent expansion audience identified by under-indexing vs. the Brand’s Core.',
            text: 'Represents potential growth groups but is not a performance metric.',
          },
          emptyMessage: "A Halo Audience hasn't been defined for {brand}.",
        },
      },
      ParticipationBreakdown: {
        title: 'Participation Breakdown',
        tooltip: {
          title: 'Participation Breakdown',
          subtitle:
            'Shows how each cohort contributes to declared category volume, segment volume, brand volume, and competitor volume.',
          description: 'Index compares the cohort to its tier baseline.',
        },
        emptyMessage: {
          title: 'No data available',
          description: 'No data available to current country',
        },
      },
    },
    Performance: {
      CoreAudiencePerformance: {
        title: 'Core Audience Performance',
        tooltip: {
          title: 'Core Audience Performance',
          subtitle:
            'Overview of how the Brand’s Core Audience is performing across key behavioral KPIs.',
          description:
            'This page evaluates declared behavior — not sales — and compares the Brand Core Audience against the Total audience baseline to validate strategic alignment.',
        },
        emptyMessage: {
          title: 'No data available',
          description: 'No data available to current country',
        },
        kpisSummaryCards: {
          participation: {
            title: 'Participation',
            tooltip: {
              subtitle:
                'Shows the % of category occasions in which the brand was chosen by the selected audience (Core or Halo) in the past 4 weeks.',
              description:
                'Core vs LY and Brand vs LY show year‑over‑year changes in percentage points (pp).\n\nPerformance Index compares Core growth vs Total Brand growth.',
            },
          },
          occasions: {
            title: 'Occasions',
            tooltip: {
              subtitle:
                'Represents the average number of times consumers in the selected audience (Core or Halo) consumed the category in the past 7 days.',
              description:
                'Core vs LY and Brand vs LY show year‑over‑year changes.\n\nPerformance Index compares Core occasion growth vs Total Brand.',
            },
          },
          brandPower: {
            title: 'Brand Power',
            tooltip: {
              subtitle:
                'Measures brand strength within the selected audience (Core or Halo), based on Meaning, Difference and Salience (MDS).',
              description:
                'Core vs LY and Brand vs LY show year‑over‑year changes in pp.\n\nPerformance Index compares Core BP growth vs Total Brand.',
            },
          },
        },
      },
      ParticipationBreakdown: {
        title: 'Participation Breakdown',
        tooltip: {
          title: 'Participation Breakdown',
          subtitle:
            "Compares Participation for the brand's Core Audience versus the Total audience in each tier.",
          description:
            'Total refers to all consumers in the tier - not sales, penetration, or brand size.',
        },
        emptyMessage: {
          title: 'No data available',
          description: 'No data available to current country',
        },
      },
    },
    BreakdownTooltips: {
      participation: {
        headerTitle: {
          title: 'Participation Breakdown',
          subtitle:
            "Compares Participation for the brand's Core Audience versus the Total audience in each tier.",
          text: 'Total refers to all consumers in the tier - not sales, penetration, or brand size.',
        },
        beer: {
          title: 'Beer Category',
          subtitle:
            'Shows how Brand’s Core Audience performs compared to the Total Beer audience.',
          text: 'Bars represent declared behavior — not sales or penetration.',
        },
        core_co: {
          title: 'Segment',
          subtitle:
            'Shows how Brand’s Core Audience performs compared to the Total segment.',
          text: "'Total' refers to all consumers in the segment — not Brand’s own Core.",
        },
        brand: {
          title: 'Brand',
          subtitle:
            'Shows how Brand Core Audience perceives the brand versus the Total Brand audience.',
          text: '‘Total Brand’ includes all Brand consumers, not just the Core Audience.',
        },
        competitor: {
          title: 'Competitor',
          subtitle:
            "Shows how Brand’s Core Audience behavior compares against the Total Competitor's audience.",
          text: 'This reflects behavioral benchmarks — not share or sales.',
        },
      },
      occasions: {
        headerTitle: {
          title: 'Occasions Breakdown',
          subtitle:
            'Shows Occasions for the Core Audience compared to the Total audience.',
          text: 'Represents behavioral frequency - not serving size or volume.',
        },
        beer: {
          title: 'Beer Category',
          subtitle:
            'Shows how Brand Core Audience compares to the Total Beer audience in terms of consumption frequency.',
          text: 'Occasions indicate declared frequency — not volume.',
        },
        core_co: {
          title: 'Segment',
          subtitle:
            'Shows how Brand Core Audience consumes the category compared to the Total segment.',
          text: '‘Total’ refers to all consumers in this segment — not Brand Core Audience.',
        },
        brand: {
          title: 'Brand',
          subtitle:
            'Shows how Brand Core Audience perceives the brand versus the Total Brand audience.',
          text: '‘Total Brand’ includes all Brand consumers, not just the Core Audience.',
        },
        competitor: {
          title: 'Competitor',
          subtitle:
            'Shows how Brand Core Audience consumption frequency compares to the Total Competitor audience.',
          text: 'This is a behavioral benchmark — not a sales or share comparison.',
        },
      },
      brandPower: {
        headerTitle: {
          title: 'Brand Power Breakdown',
          subtitle:
            'Shows how Brand Core Audience perceives the brand compared to the Total audience in this tier.',
          text: 'Brand Power reflects declared brand perception — not sales or equity. ‘Total’ refers to all consumers in the tier.',
        },
        beer: {
          title: 'Beer Category',
          subtitle:
            'Shows how Brand Core Audience rates Brand Power versus the Total Beer audience',
          text: 'Brand Power reflects declared perception — not sales or penetration.',
        },
        core_co: {
          title: 'Segment',
          subtitle:
            'Shows how Brand Core Audience rates Brand Power compared to the Total segment.',
          text: '‘Total’ refers to all consumers in this segment — not Brand Core Audience.',
        },
        brand: {
          title: 'Brand',
          subtitle:
            'Shows how Brand Core Audience perceives the brand versus the Total Brand audience.',
          text: '‘Total Brand’ includes all Brand consumers, not just the Core Audience.',
        },
        competitor: {
          title: 'Competitor',
          subtitle:
            'Shows how Brand Core Audience perception compares to the Total Competitor audience.',
          text: 'This is a perception benchmark — not market share or sales.',
        },
      },
    },
    Empty: {
      noCountryDataTitle: 'No Audience Data Available for This Country',
      noCountryDataDescription:
        'Consumer data for {country} is not available. Try selecting a different country or resetting the filters.',
      noCountryDataNoAccessDescription:
        'Consumer data for {country} is not available.',
      returnToHome: 'Return to Home',
      resetFilters: 'Reset Filters',
      permissionRequiredTitle: 'Permission Required',
      permissionRequiredDescription:
        "Your account doesn't have access to {country} data. Reach out to your admin for requesting access, or reset your filters.",
      permissionRequiredNoOtherAccessDescription:
        "Your account doesn't have access to {country} data. Reach out to your admin for requesting access, or reset your filters.",
      dataRefreshFailedTitle: 'Data Refresh Failed',
      dataRefreshFailedDescription:
        "We couldn't load the data. This might be a temporary issue. Please try refreshing the page or come back in a few minutes.",
      refreshPage: 'Refresh Page',
      competitorWithoutData:
        'Audience attributes for {competitor} are not available. Try selecting another competitor.',
    },
    BreakdownIndexes: {
      performanceIndex: {
        title: 'Performance Index',
        tooltip: {
          title: 'Performance Index',
          text: 'Compares the audience’s YoY growth to Total Brand growth.',
        },
      },
      comparisonIndex: {
        title: 'Comparison Index',
        tooltip: {
          title: 'Comparison Index',
          text: 'Compares the audience’s metric to the selected baseline (Category, Total Brand or Competitor).',
        },
      },
    },
    BreakdownToggle: {
      showHaloAudience: 'Show Halo Audience',
    },
  },
};
