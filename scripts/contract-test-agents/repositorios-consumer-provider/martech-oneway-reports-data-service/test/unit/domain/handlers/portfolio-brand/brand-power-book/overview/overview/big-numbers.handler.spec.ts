import { bigNumbersHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/overview/big-numbers.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("BigNumbersHandler", () => {
  describe("handle", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "100.5",
            AC_VS_LY: "5.2",
            AC_VS_LQ: "3.1",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await bigNumbersHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "100.5",
        variation_vs_ly: "5.2",
        variation_vs_lq: "3.1",
        variation_direction_vs_ly: "up",
        variation_direction_vs_lq: "up",
        label_refresh: expect.stringMatching(/^(Q4'23|FY'23)$/),
        label_vs_lq: "vs FY'23",
        label_vs_ly: expect.stringMatching(/^vs (Q4'22|FY'22)$/),
      });
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "80.3",
            AC_VS_LY: "-2.5",
            AC_VS_LQ: "-1.8",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await bigNumbersHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: "80.3",
        variation_vs_ly: "-2.5",
        variation_vs_lq: "-1.8",
        variation_direction_vs_ly: "down",
        variation_direction_vs_lq: "down",
        label_refresh: expect.stringMatching(/^(Q3'23|FY'23)$/),
        label_vs_lq: expect.stringMatching(/^vs (Q2'23|FY'23)$/),
        label_vs_ly: expect.stringMatching(/^vs (Q3'22|FY'22)$/),
      });
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "50.0",
            AC_VS_LY: "0",
            AC_VS_LQ: "0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
          },
        ],
      };

      // Act
      const result = await bigNumbersHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_vs_ly).toBe("down");
      expect(result[0].variation_direction_vs_lq).toBe("down");
    });

    it("should process multiple data items", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            AC: "100.5",
            AC_VS_LY: "5.2",
            AC_VS_LQ: "3.1",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            AC: "90.3",
            AC_VS_LY: "-1.5",
            AC_VS_LQ: "2.0",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await bigNumbersHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe("100.5");
      expect(result[1].value).toBe("90.3");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await bigNumbersHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
