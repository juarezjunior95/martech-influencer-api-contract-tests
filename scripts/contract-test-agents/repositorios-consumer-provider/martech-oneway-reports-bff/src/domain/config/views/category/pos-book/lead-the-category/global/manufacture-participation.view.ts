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
        name: "price_segment",
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
      id: "manufacture-participation",
      formatter:
        "category/pos-book/lead-the-category/global/manufacture-participation",
      datasources: [
        {
          name: "category_pos-book_lead-the-category_global_manufacture-participation",
        },
      ],
    },
  ],
};

export default config;
