import { loadBrandAnalysisFormatter } from "../helpers";

describe("Portfolio Brand Brand Analysis Brand Power BIP formatter", () => {
  const formatter = loadBrandAnalysisFormatter("brand-power/bip.jsonata");

  it("should return ABI table payload without competitor columns", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Beats",
            sub_brand: "Beats",
          },
          {
            level_1: "ABI",
            level_4: "Brazilian way",
            value: -4.9,
            comp_value: -0.3,
            raw_brand: "Beats",
            sub_brand: "Beats",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header).toHaveLength(2);
    expect(result.header[0]).toEqual({
      title: "Questions",
      icon: "kpi",
      id: "questions",
    });
    expect(result.header[1]).toEqual({
      title: "BIP",
      id: "bip",
      children: null,
    });
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][0]).toEqual({
      bip: { value: 3.4 },
      questions: { value: "Adds energy to your social occasion" },
    });
  });

  it("should normalize datasource object into array when source is not an array", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": {
          level_1: "ABI",
          level_4: "Adds energy to your social occasion",
          value: 3.4,
          comp_value: -0.4,
          raw_brand: "Beats",
        },
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1]).toEqual({
      title: "BIP",
      id: "bip",
      children: null,
    });
    expect(result.rows[0][0]).toEqual({
      bip: { value: 3.4 },
      questions: { value: "Adds energy to your social occasion" },
    });
  });

  it("should return competitor table payload with brand and comp columns", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Beats",
            brand_image: "https://img/beats.png",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
          {
            level_1: "ABI",
            level_4: "Brazilian way",
            value: -4.9,
            comp_value: -0.3,
            raw_brand: "Beats",
            brand_image: "https://img/beats.png",
          },
          {
            level_1: "COMP",
            level_4: "Brazilian way",
            value: -2.2,
            comp_value: 0.4,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children).toEqual([
      {
        brandImage: true,
        id: "brand",
        title: "https://img/beats.png",
      },
      {
        id: "comp",
        title: "Amstel",
        brandImg: true,
      },
    ]);
    expect(result.rows[0][0]).toEqual({
      questions: { value: "Adds energy to your social occasion" },
      comp: { value: 0.3 },
      brand: { value: 3.4 },
    });
  });

  it("should read ABI image from BRAND_IMAGE (uppercase)", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
            brand_image: "https://img/brahma-uppercase.png",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "https://img/brahma-uppercase.png",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should read ABI image from nested brand.imageSquare", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            question: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
            brand: {
              imageSquare: "https://img/brahma-square.png",
            },
          },
          {
            level_1: "COMP",
            question: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "https://img/brahma-square.png",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should read ABI image from nested brand.imageTable", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            question: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
            brand: {
              imageTable: "https://img/brahma-table.png",
            },
          },
          {
            level_1: "COMP",
            question: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "https://img/brahma-table.png",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should fallback safely when brand is not an object", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
            brand: "invalid-brand-object",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "Brahma",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should fallback to ABI brand name when image is missing", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "Brahma",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should fallback to ABI SUB_BRAND when RAW_BRAND is missing and image is missing", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            sub_brand: "Brahma Duplo Malte",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "Brahma Duplo Malte",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel",
      brandImg: true,
    });
  });

  it("should fallback to competitor SUB_BRAND when competitor RAW_BRAND is missing", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            sub_brand: "Amstel Lager",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children[0]).toEqual({
      brandImage: true,
      id: "brand",
      title: "Brahma",
    });
    expect(result.header[1].children[1]).toEqual({
      id: "comp",
      title: "Amstel Lager",
      brandImg: true,
    });
  });

  it("should fallback to SUB_BRAND when brand_name is N/A or ALL with extra spaces", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            brand_ownership: "ABI",
            question: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            brand_name: " N/A ",
            sub_brand: "Brahma Duplo Malte",
          },
          {
            brand_ownership: "COMP",
            question: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            brand_name: " ALL ",
            sub_brand: "Amstel Lager",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children).toEqual([
      {
        brandImage: true,
        id: "brand",
        title: "Brahma Duplo Malte",
      },
      {
        id: "comp",
        title: "Amstel Lager",
        brandImg: true,
      },
    ]);
  });

  it("should return '-' for comp when competitor row is missing", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Beats",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
          {
            level_1: "ABI",
            level_4: "Brazilian way",
            value: -4.9,
            comp_value: -0.3,
            raw_brand: "Beats",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.rows[0][1]).toEqual({
      questions: { value: "Brazilian way" },
      comp: { value: "-" },
      brand: { value: -4.9 },
    });
  });

  it("should return empty=true when datasource is empty", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should ignore non-object datasource items and return empty=true when no valid rows remain", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": ["invalid-item"],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should discard items without question fields and return empty=true when all are invalid", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            level_1: "ABI",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Brahma",
          },
          {
            level_1: "COMP",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result).toEqual({ empty: true });
  });

  it("should process valid rows even when datasource has non-object items", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          42,
          {
            level_1: "ABI",
            level_4: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            raw_brand: "Beats",
            brand_image: "https://img/beats.png",
          },
          {
            level_1: "COMP",
            level_4: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            raw_brand: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children).toEqual([
      {
        brandImage: true,
        id: "brand",
        title: "https://img/beats.png",
      },
      {
        id: "comp",
        title: "Amstel",
        brandImg: true,
      },
    ]);
    expect(result.rows[0][0]).toEqual({
      questions: { value: "Adds energy to your social occasion" },
      comp: { value: 0.3 },
      brand: { value: 3.4 },
    });
  });

  it("should fallback to legacy datasource key", async () => {
    const result: any = await formatter.evaluate({
      datasources: {
        "portfolio-brand_brand-analysis_brand-power_bip_st": [
          {
            brand_ownership: "ABI",
            question: "Adds energy to your social occasion",
            value: 3.4,
            comp_value: -0.4,
            brand_name: "Beats",
            brand_image: "https://img/beats.png",
          },
          {
            brand_ownership: "COMP",
            question: "Adds energy to your social occasion",
            value: 1.9,
            comp_value: 0.3,
            brand_name: "Amstel",
          },
        ],
      },
    });

    expect(result.empty).toBeUndefined();
    expect(result.header[1].children).toEqual([
      {
        brandImage: true,
        id: "brand",
        title: "https://img/beats.png",
      },
      {
        id: "comp",
        title: "Amstel",
        brandImg: true,
      },
    ]);
    expect(result.rows[0][0]).toEqual({
      questions: { value: "Adds energy to your social occasion" },
      comp: { value: 0.3 },
      brand: { value: 3.4 },
    });
  });
});
