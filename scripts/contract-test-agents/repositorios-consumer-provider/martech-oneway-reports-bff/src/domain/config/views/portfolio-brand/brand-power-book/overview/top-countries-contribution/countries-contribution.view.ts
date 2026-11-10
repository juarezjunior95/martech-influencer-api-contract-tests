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
        name: "page_filter",
      },
    ],
  },
  components: [
    {
      id: "countriesContribution",
      formatter:
        "portfolio-brand/brand-power-book/overview/countries-contribution/countriesContributionFormatter",
      datasources: [
        {
          name: "portfolio-brand_brand-power-book_overview_top-countries-contribution_countries-contribution",
        },
      ],
    },
  ],
};

export default config;
