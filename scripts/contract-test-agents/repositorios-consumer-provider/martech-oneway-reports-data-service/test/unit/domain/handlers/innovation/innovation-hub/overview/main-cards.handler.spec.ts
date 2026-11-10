import { mainCardsHandler } from "@domain/handlers/innovation/innovation-hub/overview/main-cards.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("MainCardsHandler", () => {
  describe("handle", () => {
    it("should preserve KPI, comparator, unit, period and zone columns from lake rows", async () => {
      const mockDataset: Dataset = {
        id: "main-cards",
        data: [
          {
            KPI_NAME: "volume",
            COMPARATORS: "ac",
            DT_INI: "2026-01-01",
            DT_END: "2026-06-30",
            PERIOD_TYPE: "YTD",
            LABEL_PERIOD: "May '26 YTD",
            UNIT_OF_MEASURE: "k/hl",
            LAST_2: 14.2,
            LAST_1: 15.1,
            BU: 16.8,
            LE: 17.4,
            CURRENT: 16.5,
          },
          {
            KPI_NAME: "volume",
            COMPARATORS: "vs ly",
            LAST_2: 2.1,
            LAST_1: 1.6,
            BU: 0.8,
            LE: 3.3,
          },
          {
            KPI_NAME: "volume",
            COMPARATORS: "AFR",
            LAST_2: 4.2,
            LAST_1: 3.1,
            BU: 1.2,
            LE: 5.0,
          },
        ],
      };

      const result = await mainCardsHandler.handle([], mockDataset);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        kpi_name: "volume",
        comparators: "ac",
        dt_ini: "2026-01-01",
        dt_end: "2026-06-30",
        period_type: "YTD",
        label_period: "May '26 YTD",
        unit_of_measure: "k/hl",
        last_2: 14.2,
        last_1: 15.1,
        bu: 16.8,
        le: 17.4,
        current: 16.5,
        bar_labels: ["'24", "'25", "'26 BU", "'26 LE"],
        variationDirectionLast2: "up",
        variationDirectionLe: "up",
        variationDirectionCurrent: "up",
      });
      expect(result[1]).toMatchObject({
        comparators: "vs ly",
        last_2: 2.1,
        le: 3.3,
        variationDirectionLast2: "up",
        variationDirectionLe: "up",
      });
      expect(result[2]).toMatchObject({
        comparators: "AFR",
        last_2: 4.2,
        le: 5.0,
        variationDirectionLast2: "up",
        variationDirectionLe: "up",
      });
    });

    it("should normalize comparators and handle snake_case lake columns", async () => {
      const mockDataset: Dataset = {
        id: "main-cards",
        data: [
          {
            kpi_name: "maco margin",
            comparators: "VS BU",
            dt_end: "2026-06-30",
            last_2: -0.2,
            last_1: 0.1,
            bu: -0.1,
            le: 0.3,
          },
          {
            kpi_name: "net revenue",
            comparators: "country",
            last_2: 10,
            le: 12,
          },
          {
            kpi_name: "net revenue",
            comparators: "zone",
            last_2: 8,
            le: 9,
          },
        ],
      };

      const result = await mainCardsHandler.handle([], mockDataset);

      expect(result[0]).toMatchObject({
        comparators: "vs bu",
        variationDirectionLast2: "down",
        variationDirectionBu: "down",
        variationDirectionLe: "up",
      });
      expect(result[1].comparators).toBe("country");
      expect(result[2].comparators).toBe("zone");
    });

    it("should return empty array when dataset is missing", async () => {
      const result = await mainCardsHandler.handle([], undefined);

      expect(result).toEqual([]);
    });

    it("should return empty array when dataset has no data", async () => {
      const mockDataset: Dataset = {
        id: "main-cards",
        data: [],
      };

      const result = await mainCardsHandler.handle([], mockDataset);

      expect(result).toEqual([]);
    });
  });
});
