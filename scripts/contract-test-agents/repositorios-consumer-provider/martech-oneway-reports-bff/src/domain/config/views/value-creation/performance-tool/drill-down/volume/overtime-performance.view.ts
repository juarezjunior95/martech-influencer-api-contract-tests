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
        name: "kpi",
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
        "value-creation/performance-tool/drill-down/finance/volume/big-numbers",
      datasources: [
        {
          name: "value-creation_performance-tool_drill-down_finance_volume_overtime-performance",
          filters: [
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
