import { performanceToolByOverTimeTrendsHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/overtime-trends/overtime-trends.handler";

import { Dataset } from "@domain/entities/datasource.entity";
import { formatDirection } from "@common/utils/direction.utils";

// --- MOCKS ---
jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: jest.fn(),
}));

describe("OvertimeTrendsByGranularityHandler (Jest)", () => {
  const mockDataset: Dataset = {
    id: "overtime-trends-test",
    data: [
      {
        PERIOD: "2024 Q1",
        COUNTRY_ISO_CODE_3: "ABI",
        SEGMENT: "N/A",
        UNIT_OF_MEASURE: "%",
        COMP_UNIT_OF_MEASURE: "%",
        AC: 52.9,
        AC_VS_LY: -0.5,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call formatDirection for AC and AC_VS_LY", async () => {
    (formatDirection as jest.Mock).mockReturnValue("down");

    const result = await performanceToolByOverTimeTrendsHandler.handle(
      [mockDataset],
      mockDataset,
    );

    expect(formatDirection).toHaveBeenCalledTimes(2);
    expect(formatDirection).toHaveBeenCalledWith(52.9);
    expect(formatDirection).toHaveBeenCalledWith(-0.5);
    expect(result).toHaveLength(1);
  });

  it("should return transformed values correctly", async () => {
    (formatDirection as jest.Mock).mockReturnValue("down");

    const result = await performanceToolByOverTimeTrendsHandler.handle(
      [mockDataset],
      mockDataset,
    );

    expect(result[0]).toEqual({
      period: "2024 Q1",
      year: 2024,
      quarter: "Q1",
      country_iso_code_3: "ABI",
      segment: "N/A",
      unit_of_measure: "%",
      comp_unit_of_measure: "%",
      ac: 52.9,
      variation_direction_ac: "down",
      ac_vs_ly: -0.5,
      variation_direction_ly: "down",
    });
  });

  it("should handle null values correctly", async () => {
    const datasetWithNulls: Dataset = {
      id: "overtime-trends-test-null",
      data: [
        {
          PERIOD: null,
          COUNTRY_ISO_CODE_3: null,
          SEGMENT: null,
          UNIT_OF_MEASURE: null,
          AC: null,
          AC_VS_LY: null,
        },
      ],
    };

    (formatDirection as jest.Mock).mockReturnValue("neutral");

    const result = await performanceToolByOverTimeTrendsHandler.handle(
      [datasetWithNulls],
      datasetWithNulls,
    );

    expect(result[0]).toEqual({
      period: null,
      year: null,
      quarter: null,
      country_iso_code_3: null,
      segment: null,
      unit_of_measure: null,
      comp_unit_of_measure: null,
      ac: null,
      variation_direction_ac: "neutral",
      ac_vs_ly: null,
      variation_direction_ly: "neutral",
    });
  });

  it("should process using defaultDataset when datasets is empty", async () => {
    (formatDirection as jest.Mock).mockReturnValue("down");

    const result = await performanceToolByOverTimeTrendsHandler.handle(
      [],
      mockDataset,
    );

    expect(result).toHaveLength(1);
    expect(result[0].period).toBe("2024 Q1");
  });

  it("should return empty array when defaultDataset is not provided", async () => {
    const result = await performanceToolByOverTimeTrendsHandler.handle([]);

    expect(result).toEqual([]);
  });
});
