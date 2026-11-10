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
        name: "growth_lever",
      },
      {
        name: "page_filter",
      },
      {
        name: "brand",
      },
      {
        name: "sub_brand",
      },
      {
        name: "zone",
      },
      {
        name: "country",
      },
      {
        name: "waterfall_filter",
      },
    ],
  },
  components: [
    {
      id: "overtime-performance",
      formatter:
        "value-creation/performance-tool/drill-down/finance/net-revenue/big-numbers",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-performance",
          filters: [
            {
              name: "kpi",
              defaultValue: "nr",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
