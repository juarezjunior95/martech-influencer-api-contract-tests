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
        name: "dt_end",
      },
      {
        name: "page_filter",
      },
      {
        name: "viewtype",
      },
    ],
  },
  components: [
    {
      id: "big-numbers-ly",
      formatter:
        "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLyExportFormatter/powerVsLyExportFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
        },
      ],
    },
    {
      id: "big-numbers-lq",
      formatter:
        "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLqExportFormatter/powerVsLqExportFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
        },
      ],
    },
  ],
};

export default config;
