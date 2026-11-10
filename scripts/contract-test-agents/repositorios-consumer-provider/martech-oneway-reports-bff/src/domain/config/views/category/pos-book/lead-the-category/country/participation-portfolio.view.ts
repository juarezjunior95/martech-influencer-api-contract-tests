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
        name: "country",
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
      id: "participation-portfolio",
      formatter:
        "category/pos-book/lead-the-category/country/participation-portfolio",
      datasources: [
        {
          name: "category_pos-book_lead-the-category_country_participation-portfolio",
        },
      ],
    },
  ],
};

export default config;
