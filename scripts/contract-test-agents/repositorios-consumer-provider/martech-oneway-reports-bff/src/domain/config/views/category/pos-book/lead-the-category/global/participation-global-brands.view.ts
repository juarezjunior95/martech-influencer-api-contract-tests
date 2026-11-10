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
        name: "cohort",
      },
      {
        name: "timeperiod",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "participation-global-brands",
      formatter:
        "category/pos-book/lead-the-category/global/participation-global-brands",
      datasources: [
        {
          name: "category_pos-book_lead-the-category_global_participation-global-brands",
        },
      ],
    },
  ],
};

export default config;
