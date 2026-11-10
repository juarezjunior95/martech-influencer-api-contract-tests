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
        name: "period_type",
      },
      {
        name: "waterfall_filter",
      },
      {
        name: "country",
      },
      {
        name: "zone",
      },
      {
        name: "brand",
      },
    ],
  },
  components: [
    {
      id: "contribution",
      formatter:
        "value-creation/performance-tool/drill-down/non-finance/market-share/waterfall",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_non-finance_market-share_waterfall",
          title: "large",
          filters: [
            {
              name: "max_ranked",
              defaultValue: 15,
            },
          ],
        },
        {
          name: "value-creation_performance-tool_drill-down_non-finance_market-share_waterfall",
          title: "small",
          filters: [
            {
              name: "max_ranked",
              defaultValue: 10,
            },
          ],
        },
      ],
    },
  ],
};

export default config;
