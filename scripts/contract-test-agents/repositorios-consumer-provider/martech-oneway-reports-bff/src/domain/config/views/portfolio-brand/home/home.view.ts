import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [
      {
        name: "viewtype",
      },
      {
        name: "page_filter",
      },
      {
        name: "country",
      },
      {
        name: "zone",
      },
      {
        name: "timeframe",
      },
      {
        name: "dt_end",
      },
      {
        name: "period",
      },
      {
        name: "timeperiod",
      },
    ],
  },
  components: [
    {
      id: "increase-brand-power",
      formatter: "portfolio-brand/home/home",
      datasources: [
        {
          name: "portfolio-brand_home_increase-brand-power",
        },
      ],
    },
    {
      id: "portfolio-strategy",
      formatter: "portfolio-brand/home/home",
      datasources: [
        {
          name: "portfolio-brand_home_portfolio-strategy",
        },
      ],
    },
    {
      id: "target-audiences",
      formatter: "portfolio-brand/home/home",
      datasources: [
        {
          name: "innovation_innovation_overview_strategic-innovation-pillars",
          filters: [
            {
              name: "kpi",
              defaultValue: "renovation",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
