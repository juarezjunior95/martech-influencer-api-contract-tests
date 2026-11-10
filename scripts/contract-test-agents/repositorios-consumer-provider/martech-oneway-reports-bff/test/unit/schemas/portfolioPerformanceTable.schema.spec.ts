import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  portfolioTableHeaderChildSchema,
  portfolioTableHeaderSchema,
  brandItemSchema,
  portfolioTableCellValueSchema,
  portfolioTableRowSchema,
  portfolioTableSectionSchema,
  portfolioPerformanceTableDataSchema,
} from "@infrastructure/schema/components/portfolioPerformanceTable.schema";

describe("PortfolioPerformanceTable Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("portfolioTableHeaderChildSchema", () => {
    it("should validate header child with id and title", () => {
      const data = {
        id: "volume_growth_contr",
        title: "Growth Contrib.",
      };
      const validate = ajv.compile(portfolioTableHeaderChildSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without id", () => {
      const data = {
        title: "Growth Contrib.",
      };
      const validate = ajv.compile(portfolioTableHeaderChildSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without title", () => {
      const data = {
        id: "volume_growth_contr",
      };
      const validate = ajv.compile(portfolioTableHeaderChildSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("portfolioTableHeaderSchema", () => {
    it("should validate simple header", () => {
      const data = {
        id: "portfolio",
        title: "Portfolio",
      };
      const validate = ajv.compile(portfolioTableHeaderSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate header with subtitle and dateEndStorageKey", () => {
      const data = {
        title: "Volume",
        subtitle: "Oct'25",
        dateEndStorageKey: "volume_date_end",
      };
      const validate = ajv.compile(portfolioTableHeaderSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate header with children", () => {
      const data = {
        title: "Volume",
        subtitle: "Oct'25",
        dateEndStorageKey: "volume_date_end",
        children: [
          {
            id: "volume_growth_contr",
            title: "Growth Contrib.",
          },
          {
            id: "volume_weight",
            title: "Weight",
          },
        ],
      };
      const validate = ajv.compile(portfolioTableHeaderSchema);
      expect(validate(data)).toBe(true);
    });

    it("should allow empty object", () => {
      const validate = ajv.compile(portfolioTableHeaderSchema);
      expect(validate({})).toBe(true);
    });
  });

  describe("brandItemSchema", () => {
    it("should validate brand with required name", () => {
      const data = {
        name: "Michelob ultra",
      };
      const validate = ajv.compile(brandItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate brand with all properties", () => {
      const data = {
        src: "https://example.com/michelob.png",
        name: "Michelob ultra",
        variation: 4.8,
        variationMeasure: "%",
        variationDirection: "up",
        country: "ABI",
      };
      const validate = ajv.compile(brandItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate variationDirection enum values", () => {
      const validate = ajv.compile(brandItemSchema);
      const directions = ["up", "down", "neutral"];

      directions.forEach((dir) => {
        const data = {
          name: "Test Brand",
          variationDirection: dir,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid variationDirection", () => {
      const data = {
        name: "Test Brand",
        variationDirection: "invalid",
      };
      const validate = ajv.compile(brandItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without name", () => {
      const data = {
        src: "https://example.com/image.png",
      };
      const validate = ajv.compile(brandItemSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("portfolioTableCellValueSchema", () => {
    it("should validate cell with string value", () => {
      const data = {
        value: "Megabrands",
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with number value", () => {
      const data = {
        value: 57.8,
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with unitMeasure and variationDirection", () => {
      const data = {
        value: -0.6,
        unitMeasure: "%",
        variationDirection: "#a30a0a",
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with style properties", () => {
      const data = {
        value: "Total",
        marginBottom: true,
        radiusRight: true,
        radiusTop: true,
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with brands array", () => {
      const data = {
        value: "_brands",
        brands: [
          {
            name: "Michelob ultra",
            variation: 4.8,
            variationDirection: "up",
          },
        ],
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate variationDirection hex color", () => {
      const validate = ajv.compile(portfolioTableCellValueSchema);
      const colors = ["#a30a0a", "#00810d", "#FFFFFF"];

      colors.forEach((color) => {
        const data = {
          value: 5,
          variationDirection: color,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid hex color", () => {
      const data = {
        value: 5,
        variationDirection: "red",
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without value", () => {
      const data = {
        unitMeasure: "%",
      };
      const validate = ajv.compile(portfolioTableCellValueSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("portfolioTableRowSchema", () => {
    it("should validate empty row array", () => {
      const validate = ajv.compile(portfolioTableRowSchema);
      expect(validate([])).toBe(true);
    });

    it("should validate row with cells", () => {
      const data = [
        {
          portfolio: {
            value: "Megabrands",
            marginBottom: true,
          },
        },
        {
          volume_growth_contr: {
            value: 57.8,
            unitMeasure: "%",
          },
        },
      ];
      const validate = ajv.compile(portfolioTableRowSchema);
      expect(validate(data)).toBe(true);
    });
  });

  describe("portfolioTableSectionSchema", () => {
    it("should validate complete section", () => {
      const data = {
        header: [
          {
            id: "portfolio",
            title: "Portfolio",
          },
        ],
        rows: [
          [
            {
              portfolio: {
                value: "Megabrands",
                marginBottom: true,
              },
            },
          ],
        ],
      };
      const validate = ajv.compile(portfolioTableSectionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate section with nested headers", () => {
      const data = {
        header: [
          {
            title: "Volume",
            subtitle: "Oct'25",
            dateEndStorageKey: "volume_date_end",
            children: [
              {
                id: "volume_growth_contr",
                title: "Growth Contrib.",
              },
            ],
          },
        ],
        rows: [
          [
            {
              volume_growth_contr: {
                value: 57.8,
                unitMeasure: "%",
              },
            },
          ],
        ],
      };
      const validate = ajv.compile(portfolioTableSectionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without header", () => {
      const data = {
        rows: [],
      };
      const validate = ajv.compile(portfolioTableSectionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without rows", () => {
      const data = {
        header: [{ id: "test", title: "Test" }],
      };
      const validate = ajv.compile(portfolioTableSectionSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("portfolioPerformanceTableDataSchema", () => {
    it("should validate complete table with multiple sections", () => {
      const data = {
        Portfolio: {
          header: [{ id: "portfolio", title: "Portfolio" }],
          rows: [[{ portfolio: { value: "Megabrands" } }]],
        },
        Volume: {
          header: [
            {
              title: "Volume",
              subtitle: "Oct'25",
              children: [{ id: "volume_weight", title: "Weight" }],
            },
          ],
          rows: [[{ volume_weight: { value: 59.5, unitMeasure: "%" } }]],
        },
        "Net Revenue": {
          header: [
            {
              title: "Net Revenue",
              children: [{ id: "net_revenue_vs_ly", title: "vs LY" }],
            },
          ],
          rows: [
            [
              {
                net_revenue_vs_ly: {
                  value: 4.5,
                  unitMeasure: "%",
                  variationDirection: "#00810d",
                },
              },
            ],
          ],
        },
      };
      const validate = ajv.compile(portfolioPerformanceTableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate Brands section with brand items", () => {
      const data = {
        Brands: {
          header: [
            {
              title: "Brands",
              children: [{ id: "brands_vol_og_vs_ly", title: "Vol OG Vs LY" }],
            },
          ],
          rows: [
            [
              {
                brands_vol_og_vs_ly: {
                  value: "_brands",
                  brands: [
                    {
                      name: "Michelob ultra",
                      src: "https://example.com/michelob.png",
                      variation: 4.8,
                      variationMeasure: "%",
                      variationDirection: "up",
                      country: "ABI",
                    },
                  ],
                },
              },
            ],
          ],
        },
      };
      const validate = ajv.compile(portfolioPerformanceTableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should allow empty object", () => {
      const validate = ajv.compile(portfolioPerformanceTableDataSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate with only some sections", () => {
      const data = {
        Portfolio: {
          header: [{ id: "portfolio", title: "Portfolio" }],
          rows: [],
        },
      };
      const validate = ajv.compile(portfolioPerformanceTableDataSchema);
      expect(validate(data)).toBe(true);
    });
  });
});
