import { ViewConfig } from "@domain/entities/view.entity";

const config: ViewConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["default"],
  },
  filters: {
    default: [
      { name: "country" },
      { name: "category" },
      { name: "time_frame" },
      { name: "dt_end" },
      { name: "dt_ini" },
    ],
  },
  components: [
    {
      id: "overtime-performance",
      formatter: "category/pos-performance-tool/overview/overtime-performance",
      datasources: [
        {
          name: "category_pos-performance-tool_overview_overtime-performance",
        },
      ],
    },
  ],
};

export default config;
