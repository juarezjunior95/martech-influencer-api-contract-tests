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
        name: "year",
      },
      {
        name: "category",
      },
    ],
  },
  components: [
    {
      id: "category-health_overview",
      formatter: "category/category-health/overview",
      datasources: [
        {
          name: "category_category-health_overview",
        },
      ],
    },
  ],
};

export default config;
