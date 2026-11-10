export const OPTIMIZELY_PROJECT_NAME = 'oneway-reports';

export const featureToggles = {
  developmentViewer: 'development_viewer',
  groupAViewer: 'group_a_viewer',
  groupBViewer: 'group_b_viewer',
  aiChat: {
    id: 'ai_chat',
    domain_dropdown: 'ai_chat_domain_dropdown',
  },
  pillar: {
    category: {
      id: 'menu_category',
      category_home_content: 'category_home_content',
      home: {
        aiSummary: {
          growTheCategory: 'ai_summary_category_home_grow',
          leadTheCategory: 'ai_summary_category_home_lead',
        },
      },
      submenus: {
        posPbi: { id: 'submenu_pos_pbi' },
        posBook: {
          id: 'submenu_pos',
          disableUsa: 'disable_usa_in_pos_book',
          usaAlert: 'usa_alert_on_pos_book',
          tab: {
            growCategory: {
              id: 'tab_pos_grow_the_category',
              aiSummary: 'ai_summary_pos_book_grow_the_category',
            },
            leadCategory: {
              id: 'tab_pos_lead_the_category',
              sections: {
                manufactureLead: 'section_manufacture_lead_the_category',
                brandParticipation:
                  'section_brand_participation_lead_the_category',
              },
              aiSummary: 'ai_summary_pos_book_lead_the_category',
            },
          },
        },
        categoryHealth: {
          id: 'submenu_category_health',
          tab: {
            overview: {
              id: 'tab_category_health_overview',
              sections: {
                countriesViewTable:
                  'section_category_health_overview_countries_view_table',
                categoriesViewTable:
                  'section_category_health_overview_categories_view_table',
              },
            },
          },
        },
      },
    },
    consumer: {
      id: 'menu_consumer',
      consumer_home_content: 'consumer_home_content',
      home: {
        aiSummary: {
          abiLovers: 'ai_summary_consumer_home_abi_lovers',
          increaseParticipation: 'ai_summary_consumer_home_participation',
        },
      },
      submenus: {
        audienceTargeting: {
          id: 'submenu_audience_targeting',
          tabs: {
            performance: 'tab_audience_targeting_performance',
            definition: 'tab_audience_targeting_definition',
          },
        },
      },
    },
    portfolioBrand: {
      id: 'menu_portfolio_brand',
      portfolio_brand_home_content: 'portfolio_brand_home_content',
      home: {
        aiSummary: {
          increaseBrandPower: 'ai_summary_portfolio_brand_home',
        },
      },
      submenus: {
        portfolioPerformance: {
          id: 'submenu_portfolio_performance',
          aiSummary: 'ai_summary_portfolio_performance_overview',
        },
        brandAnalysis: {
          id: 'submenu_brand_analysis',
          tab: {
            overview: {
              aiSummary: 'ai_summary_brand_analysis_overview',
            },
            brandPower: { id: 'tab_brand_analysis_brand_power' },
            volumeMarketShare: {
              id: 'tab_brand_analysis_volume_market_share',
              sections: {
                pos: 'section_brand_analysis_pos',
              },
            },
            netRevenue: {
              id: 'tab_brand_analysis_net_revenue',
              sections: {
                cpi: 'section_brand_analysis_net_revenue_cpi',
              },
            },
          },
        },
        brandPower: { id: 'submenu_brand_power' },
        brandPowerBook: {
          id: 'submenu_brand_power_book',
          aiSummary: 'ai_summary_brand_power_book_overview',
        },
        brandPowerBookExport: { id: 'submenu_brand_power_book_export' },
        pnl: {
          id: 'submenu_country_brand_and_portfolio_pl',
        },
        beyondBeerControlTower: { id: 'submenu_beyond_beer_control_tower' },
        nonAlcBeerControlTower: { id: 'submenu_non_alc_beer_control_tower' },
      },
    },
    innovation: {
      id: 'menu_innovation',
      innovation_home_content: 'innovation_home_content',
      innovation_home_new_page_experience: 'innovation_transition_home',
      home: {
        aiSummary: {
          volume: 'ai_summary_innovation_home_volume',
          nr: 'ai_summary_innovation_home_nr',
        },
      },
      submenus: {
        innovation: {
          id: 'submenu_innovation',
          tab: {
            overview: {
              id: 'tab_innovation_overview',
              sections: {
                totalInnovation: 'section_innovation_overview_total_innovation',
              },
              aiSummary: 'ai_summary_innovation_overview',
            },
            performanceAndBreakdown: {
              id: 'tab_innovation_performance_and_breakdown',
            },
          },
        },
        innovationHub: { id: 'submenu_innovation_hub' },
      },
    },
    connectionsAndCreativity: {
      id: 'menu_connections_and_creativity',
      connections_creativity_home_content:
        'connections_creativity_home_content',
      submenus: {
        resourceAllocationMedia: {
          id: 'submenu_resource_allocation_media',
          tab: {
            overview: {
              id: 'tab_resource_allocation_media_overview',
              aiSummary: 'ai_summary_resource_allocation_overview',
              sections: {
                breakdownTable:
                  'section_resource_allocation_media_overview_breakdown_table',
                breakdownCharts:
                  'section_resource_allocation_media_overview_breakdown_charts',
                ranking: 'section_resource_allocation_media_overview_ranking',
              },
            },
            resourceAllocation: {
              id: 'tab_resource_allocation_media_resource_allocation',
            },
            investmentBreakdown: {
              id: 'tab_resource_allocation_media_investment_breakdown',
            },
            mediaDrilldoown: {
              id: 'tab_resource_allocation_media_media_drilldoown',
            },
            campaignDeepDive: {
              id: 'tab_resource_allocation_media_campaign_deep_dive',
            },
          },
        },
      },
    },
    tradeExecution: {
      id: 'menu_trade_execution',
      trade_execution_home_content: 'trade_execution_home_content',
      home: {
        aiSummary: {
          total: 'ai_summary_trade_execution_home_total',
          megabrands: 'ai_summary_trade_execution_home_megabrands',
        },
      },
      submenus: {
        beesDistribution: {
          id: 'submenu_bees-distribution',
          tab: {
            overview: {
              id: 'tab_bees_distribution_overview',
              aiSummary: 'ai_summary_bees_distribution_overview',
            },
          },
        },
      },
    },
    valueCreation: {
      id: 'menu_value_creation',
      value_creation_home_content: 'value_creation_home_content',
      deepDive: {
        volume: 'value_creation_home_deep_dive_volume',
        netRevenue: 'value_creation_home_deep_dive_net_revenue',
        cores: 'value_creation_home_deep_dive_cores',
        marketShare: 'value_creation_home_deep_dive_market_share',
        brandPower: 'value_creation_home_deep_dive_brand_power',
      },
      home: {
        aiSummary: {
          sustainableGrowthOverview: 'ai_summary_value_creation_home',
        },
      },
      submenus: {
        commercialResults: {
          id: 'submenu_commercial_results',
        },
        growthLeague: {
          id: 'submenu_growth_league',
          tab: {
            overview: { id: 'tab_growth_league_overview' },
            rank: {
              id: 'tab_growth_league_rank',
            },
          },
        },
        volumePages: {
          id: 'submenu_volume_page',
          filters: {
            productScope: 'product_scope_filter',
          },
          tab: {
            global: {
              aiSummary: 'ai_summary_volume_pages_global',
            },
          },
        },
        nrPages: {
          id: 'submenu_net_revenue_page',
        },
        market_sharePages: {
          id: 'submenu_market_share_page',
        },
        volumePagesCountryPpr: {
          id: 'submenu_volume_pages_country_ppr',
        },
        performanceTool: {
          id: 'submenu_performance_tool',
          aiSummary: {
            brandPower: 'ai_summary_performance_tool_brand_power',
            cores: 'ai_summary_performance_tool_cores',
            marketShare: 'ai_summary_performance_tool_market_share',
            netRevenue: 'ai_summary_performance_tool_net_revenue',
            volume: 'ai_summary_performance_tool_volume',
          },
        },
      },
    },
    refreshSource: {
      id: 'refresh_source',
    },
    bugReport: {
      id: 'bug_report',
    },
  },
} as const;
