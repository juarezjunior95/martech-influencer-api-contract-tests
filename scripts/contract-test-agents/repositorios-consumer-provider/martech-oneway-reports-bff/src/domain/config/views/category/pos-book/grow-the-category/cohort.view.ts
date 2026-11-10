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
        name: "pos_kpi",
      },
      {
        name: "timeperiod",
      },
      {
        name: "dt_end",
      },
      {
        name: "viewtype",
      },
      {
        name: "country",
      },
    ],
  },
  components: [
    {
      id: "country",
      formatter: "category/pos-book/grow-the-category/cohort",
      datasources: [
        {
          name: "category_pos-book_grow-the-category_cohort",
        },
      ],
    },
  ],
};

export default config;
