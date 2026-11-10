import { waterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/contribution/waterfall.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("WaterfallHandler", () => {
  describe("handle", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            dt_ini: "2023-01-01",
            dt_end: "2023-12-31",
            timeframe: "FY",
            bar: "Brahma Pilsen",
            ac: 1200.5,
            ac_delta: 1200.5,
            ac_vs_ly: 4.8,
            nr_weight: 0.25,
            unit_of_measure: "%",
            comp_unit_of_measure: "%",
            viewtype: "brand",
          },
        ],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);

      expect(result[0]).toMatchObject({
        dt_end: "2023-12-31",
        period: "FY",
        label_value: "Brahma Pilsen",
        image_value: expect.any(String),
        waterfall_filter: "brand",
        unit_of_measure: "%",
        comp_unit_of_measure: "%",
        ac: 1200.5,
        ac_delta: 1200.5,
        ac_vs_ly: 4.8,
        nr_weight: 0.25,
      });

      // Direction checks
      expect(result[0].ac_direction).toBe("up");
      expect(result[0].ac_delta_direction).toBe("up");
      expect(result[0].ac_vs_ly_direction).toBe("up");
      expect(result[0].nr_weight_direction).toBe("up");
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            bar: "Antarctica",
            dt_ini: "2023-04-01",
            dt_end: "2023-06-30",
            timeframe: "Q2",
            ac: -150.3,
            ac_delta: -150.3,
            ac_vs_ly: -2.5,
            nr_weight: -0.12,
            viewtype: "country",
          },
        ],
      };

      // Act
      const result = await waterfallHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);

      expect(result[0].ac_direction).toBe("down");
      expect(result[0].ac_delta_direction).toBe("down");
      expect(result[0].ac_vs_ly_direction).toBe("down");
      expect(result[0].nr_weight_direction).toBe("down");

      // Label and image
      expect(result[0].label_value).toBe("Antarctica");
      expect(result[0].image_value).toEqual(expect.any(String));
    });

    it("should handle zero variations correctly with positiveZero option", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            bar: "Brahma Pilsen",
            dt_ini: "2023-01-01",
            dt_end: "2023-03-31",
            timeframe: "Q1",
            ac: 0,
            ac_delta: 0,
            ac_vs_ly: 0,
            nr_weight: 0,
            viewtype: "brand",
          },
        ],
      };

      const result = await waterfallHandler.handle([], mockDataset);

      expect(result).toHaveLength(1);
      expect(result[0].ac_direction).toBe("up");
      expect(result[0].ac_delta_direction).toBe("up");
      expect(result[0].ac_vs_ly_direction).toBe("up");
      expect(result[0].nr_weight_direction).toBe("up");

      expect(result[0].label_value).toBe("Brahma Pilsen");
      expect(result[0].image_value).toEqual(expect.any(String));
    });

    it("should process multiple data items correctly", async () => {
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            bar: "Brahma Pilsen",
            dt_ini: "2023-01-01",
            dt_end: "2023-03-31",
            timeframe: "Q1",
            ac: 1000,
            ac_delta: 1000,
            ac_vs_ly: 3.5,
            nr_weight: 0.18,
            viewtype: "brand",
          },
          {
            bar: "Skol Pilsen",
            dt_ini: "2023-04-01",
            dt_end: "2023-06-30",
            timeframe: "Q2",
            ac: 800,
            ac_delta: 800,
            ac_vs_ly: -1.2,
            nr_weight: -0.05,
            viewtype: "brand",
          },
          {
            bar: "Antarctica Pilsen",
            dt_ini: "2023-07-01",
            dt_end: "2023-09-30",
            timeframe: "Q3",
            ac: 0,
            ac_delta: 0,
            ac_vs_ly: 0,
            nr_weight: 0,
            viewtype: "brand",
          },
        ],
      };

      const result = await waterfallHandler.handle([], mockDataset);

      expect(result).toHaveLength(3);

      expect(result[0].label_value).toBe("Brahma Pilsen");
      expect(result[1].label_value).toBe("Skol Pilsen");
      expect(result[2].label_value).toBe("Antarctica Pilsen");
    });

    it("should handle empty dataset data array", async () => {
      const mockDataset: Dataset = { id: "test-dataset", data: [] };
      const result = await waterfallHandler.handle([], mockDataset);
      expect(result).toEqual([]);
    });

    it("should return empty array if defaultDataset is not provided", async () => {
      const result = await waterfallHandler.handle([], undefined);
      expect(result).toEqual([]);
    });
  });
});
