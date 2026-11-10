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
      id: "participation-ranking",
      formatter:
        "category/pos-book/lead-the-category/global/participation-ranking",
      datasources: [
        {
          name: "category_pos-book_lead-the-category_global_participation-ranking",
        },
      ],
    },
  ],
};

export default config;
