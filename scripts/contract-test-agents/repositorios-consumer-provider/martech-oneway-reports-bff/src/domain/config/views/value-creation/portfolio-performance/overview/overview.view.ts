import { ViewConfig } from "@domain/entities/view.entity";

const filters = [
  {
    name: "dt_end",
  },
  {
    name: "dt_ini",
  },
  {
    name: "country",
  },
  {
    name: "zone",
  },
  {
    name: "viewtype",
  },
];

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [...filters, { name: "period" }],
    finance: [...filters, { name: "period" }],
    market_share: filters,
    power: filters,
    pos: filters,
  },
  components: [
    {
      id: "portfolioPerformance",
      formatter:
        "value-creation/portfolio-performance/overview/portfolioPerformanceFormatter",
      datasources: [
        {
          name: "value-creation_portfolio-performance_overview_portfolio-performance_portfolio-performance",
          filterSet: "power",
        },
        {
          name: "value-creation_portfolio-performance_overview_portfolio-performance_brands",
          filterSet: "power",
        },
      ],
    },
  ],
};

export default config;
