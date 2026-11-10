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
        name: "zone",
      },
      {
        name: "viewtype",
      },
      {
        name: "brand",
      },
      {
        name: "sub_brand",
      },
      {
        name: "sub_brand_comp",
      },
      {
        name: "dt_end",
      },
    ],
  },
  components: [
    {
      id: "imagery",
      formatter: "portfolio-brand/brand-analysis/brand-power/imagery",
      datasources: [
        {
          name: "portfolio-brand_brand-analysis_brand-power_imagery_per-year-qtr",
          filters: [
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "sub_brand_comp",
              defaultValue: "All",
            },
          ],
        },
        {
          name: "portfolio-brand_brand-analysis_brand-power_imagery_per-year",
          filters: [
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "sub_brand_comp",
              defaultValue: "All",
            },
          ],
        },
        {
          name: "portfolio-brand_brand-analysis_brand-power_imagery_per-year-full",
          filters: [
            {
              name: "sub_brand",
              defaultValue: "All",
            },
            {
              name: "sub_brand_comp",
              defaultValue: "All",
            },
          ],
        },
      ],
    },
  ],
};

export default config;
