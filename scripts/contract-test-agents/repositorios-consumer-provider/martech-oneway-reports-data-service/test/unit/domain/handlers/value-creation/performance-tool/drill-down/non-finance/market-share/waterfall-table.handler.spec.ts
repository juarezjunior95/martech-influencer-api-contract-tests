import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { marketShareWaterfallTableHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.handler";

describe("marketShareWaterfallTableHandler", () => {
  it("removes the last 4 characters from raw_brand", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [{ raw_brand: "Corona ABI", ac: 10 }],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).not.toBeInstanceOf(KpiEntity);
    expect(result[0].raw_brand).toBe("Corona");
    expect(result[0].ac).toBe(10);
  });

  it("supports uppercase RAW_BRAND keys from SQL rows", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [{ RAW_BRAND: "Brahma BRA", ac: 10 }],
    });

    expect(result[0].raw_brand).toBe("Brahma");
    expect(result[0].RAW_BRAND).toBe("Brahma");
  });

  it("removes the last 4 characters from labels", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [{ labels: "Corona ABI", ac: 10 }],
    });

    expect(result[0].labels).toBe("Corona");
    expect(result[0].LABELS).toBe("Corona");
  });

  it("supports uppercase LABELS keys from SQL rows", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [{ LABELS: "Brahma BRA", ac: 10 }],
    });

    expect(result[0].labels).toBe("Brahma");
    expect(result[0].LABELS).toBe("Brahma");
  });

  it("normalizes raw_brand and labels in the same row", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        {
          raw_brand: "Corona ABI",
          labels: "Corona ABI",
          ac: 10,
        },
      ],
    });

    expect(result[0].raw_brand).toBe("Corona");
    expect(result[0].labels).toBe("Corona");
  });

  it("does not strip labels without a country suffix pattern", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        { labels: "YTD'26", raw_brand: "", ac: 53.2 },
        { labels: "Budweiser", raw_brand: "Budweiser", ac: 12.1 },
        { labels: "Brand ab", raw_brand: "Brand ab", ac: 5 },
      ],
    });

    expect(result[0].labels).toBe("YTD'26");
    expect(result[1].labels).toBe("Budweiser");
    expect(result[1].raw_brand).toBe("Budweiser");
    expect(result[2].labels).toBe("Brand ab");
    expect(result[2].raw_brand).toBe("Brand ab");
  });

  it("returns an empty array when the dataset is missing", async () => {
    await expect(
      marketShareWaterfallTableHandler.handle([], undefined),
    ).resolves.toEqual([]);
  });

  it("sets ABI global logo on summary rows when country filter is Global", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        {
          labels: "FY'25",
          raw_brand: "",
          country_iso_code_3: "ABI",
          filter_waterfall_filter: "brand",
          filter_country: "ABI",
        },
        {
          labels: "Brahma",
          raw_brand: "Brahma",
          country_iso_code_3: "BRA",
          filter_waterfall_filter: "brand",
          filter_country: "ABI",
        },
        {
          labels: "FY'26",
          raw_brand: "",
          country_iso_code_3: "ABI",
          filter_waterfall_filter: "brand",
          filter_country: "ABI",
        },
      ],
    });

    expect(result[0].image_value).toBe(getCountryFlag("ABI"));
    expect(result[1].image_value).toBe(
      getBrandImage("Brahma", { format: "square" }),
    );
    expect(result[2].image_value).toBe(getCountryFlag("ABI"));
    expect(result[1].badge_value).toBe(getCountryFlag("BRA"));
  });

  it("forces ABI logo on FY summary rows even when country_iso_code_3 is the period label", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        {
          labels: "FY'25",
          raw_brand: "",
          country_iso_code_3: "FY'25",
          filter_period_type: "FY",
          filter_waterfall_filter: "country",
          filter_country: "ABI",
        },
        {
          labels: "USA",
          country_iso_code_3: "USA",
          filter_period_type: "FY",
          filter_waterfall_filter: "country",
          filter_country: "ABI",
        },
        {
          labels: "FY'26",
          raw_brand: "",
          country_iso_code_3: "FY'26",
          filter_period_type: "FY",
          filter_waterfall_filter: "country",
          filter_country: "ABI",
        },
      ],
    });

    expect(result[0].image_value).toBe(getCountryFlag("ABI"));
    expect(result[2].image_value).toBe(getCountryFlag("ABI"));
  });

  it("clears images for beer price segment breakdown rows but keeps summary logo", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        {
          labels: "FY'25",
          country_iso_code_3: "ABI",
          filter_waterfall_filter: "beer_price_segment",
          filter_country: "ABI",
        },
        {
          labels: "Core",
          country_iso_code_3: "ABI",
          filter_waterfall_filter: "beer_price_segment",
          filter_country: "ABI",
        },
        {
          labels: "FY'26",
          country_iso_code_3: "ABI",
          filter_waterfall_filter: "beer_price_segment",
          filter_country: "ABI",
        },
      ],
    });

    expect(result[0].image_value).toBe(getCountryFlag("ABI"));
    expect(result[1].image_value).toBe("");
    expect(result[2].image_value).toBe(getCountryFlag("ABI"));
  });

  it("resolves sub-brand images from labels for breakdown rows", async () => {
    const result = await marketShareWaterfallTableHandler.handle([], {
      id: "non-finance-market-share-waterfall-table",
      data: [
        {
          labels: "YTD'25",
          raw_brand: "Brahma",
          country_iso_code_3: "BRA",
          filter_waterfall_filter: "sub_brand",
          filter_brand: "Brahma",
          filter_country: "BRA",
        },
        {
          labels: "Brahma Duplo Malte",
          raw_brand: "",
          country_iso_code_3: "",
          filter_waterfall_filter: "sub_brand",
          filter_brand: "Brahma",
          filter_country: "BRA",
        },
        {
          labels: "YTD'26",
          raw_brand: "Brahma",
          country_iso_code_3: "BRA",
          filter_waterfall_filter: "sub_brand",
          filter_brand: "Brahma",
          filter_country: "BRA",
        },
      ],
    });

    expect(result[0].image_value).toBe(getCountryFlag("BRA"));
    expect(result[1].raw_brand).toBe("Brahma Duplo Malte");
    expect(result[1].image_value).toBe(
      getBrandImage("Brahma Duplo Malte", {
        format: "square",
        brand_family: "Brahma",
      }),
    );
    expect(result[2].image_value).toBe(getCountryFlag("BRA"));
  });
});
