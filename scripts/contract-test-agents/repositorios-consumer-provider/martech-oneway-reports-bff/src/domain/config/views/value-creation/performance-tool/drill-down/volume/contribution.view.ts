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
        name: "dt_end",
      },
      {
        name: "dt_ini",
      },
      {
        name: "country",
      },
      {
        name: "viewtype",
      },
      {
        name: "zone",
      },
      {
        name: "portfolio",
      },
      {
        name: "segment",
      },
      {
        name: "brand",
      },
      {
        name: "page_filter",
      },
      {
        name: "timeframe",
      },
      {
        name: "kpi",
      },
    ],
  },
  components: [
    {
      id: "contribution",
      formatter:
        "value-creation/performance-tool/drill-down/finance/contribution-waterfall",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_finance_contribution",
          title: "large",
          filters: [
            {
              name: "max_ranked",
              defaultValue: 15,
            },
            {
              name: "kpi",
              defaultValue: "volume",
            },
          ],
        },
        {
          name: "value-creation_performance-tool_drill-down_finance_contribution",
          title: "small",
          filters: [
            {
              name: "max_ranked",
              defaultValue: 10,
            },
            {
              name: "kpi",
              defaultValue: "volume",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
