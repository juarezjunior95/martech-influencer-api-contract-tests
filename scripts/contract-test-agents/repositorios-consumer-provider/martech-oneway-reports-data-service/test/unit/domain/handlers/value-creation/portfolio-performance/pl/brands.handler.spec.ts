import { brandsHandler } from "@domain/handlers/value-creation/portfolio-performance/pl/brands.handler";
import { Dataset } from "@domain/entities/datasource.entity";

import { formatDirection } from "@common/utils/direction.utils";
import { isReverseDirection, getKpiTitle } from "@common/utils/portfolio.utils";

// --- MOCKS ---
jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: jest.fn(),
}));

jest.mock("@common/utils/portfolio.utils", () => ({
  isReverseDirection: jest.fn(),
  getKpiTitle: jest.fn(),
}));

describe("BrandsHandler (Jest)", () => {
  const mockDataset: Dataset = {
    id: "brands-test",
    data: [
      {
        KPI_NAME: "volume_growth",
        SEGMENT: "Premium",
        RAW_BRAND: "BrandX",
        AC: 100,
        AC_VS_LY: -10,
        DT_INI: "2025-01-01",
        DT_END: "2025-01-31",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call isReverseDirection and formatDirection correctly", async () => {
    (isReverseDirection as jest.Mock).mockReturnValue(false);
    (formatDirection as jest.Mock).mockReturnValue("up");
    (getKpiTitle as jest.Mock).mockReturnValue("Volume Growth");

    const result = await brandsHandler.handle([mockDataset], mockDataset);

    expect(isReverseDirection).toHaveBeenCalledWith("volume_growth");
    expect(formatDirection).toHaveBeenCalledTimes(2); // AC + AC_VS_LY
    expect(result).toHaveLength(1);
  });

  it("should return transformed values correctly", async () => {
    (isReverseDirection as jest.Mock).mockReturnValue(true);
    (formatDirection as jest.Mock).mockReturnValueOnce("down"); // AC
    (formatDirection as jest.Mock).mockReturnValueOnce("up"); // AC_VS_LY

    (getKpiTitle as jest.Mock).mockReturnValue("Volume Growth");

    const result = await brandsHandler.handle([mockDataset], mockDataset);

    expect(result[0]).toEqual({
      kpi_name: "volume_growth",
      subtitle: "Volume Growth",
      segment: "Premium",
      brand: "BrandX",
      ac: 100,
      ac_direction: "down",
      ac_vs_ly: -10,
      ac_vs_ly_direction: "up",
      dt_ini: "2025-01-01",
      dt_end: "2025-01-31",
    });
  });

  it("should handle null fields correctly", async () => {
    const datasetNulls: Dataset = {
      id: "brands-test-null",
      data: [
        {
          KPI_NAME: "test",
          SEGMENT: null,
          RAW_BRAND: null,
          AC: null,
          AC_VS_LY: null,
          DT_INI: null,
          DT_END: null,
        },
      ],
    };

    (isReverseDirection as jest.Mock).mockReturnValue(false);
    (formatDirection as jest.Mock).mockReturnValue("neutral");
    (getKpiTitle as jest.Mock).mockReturnValue("Test Title");

    const result = await brandsHandler.handle([datasetNulls], datasetNulls);

    expect(result[0]).toEqual({
      kpi_name: "test",
      subtitle: "Test Title",
      segment: null,
      brand: null,
      ac: null,
      ac_direction: "neutral",
      ac_vs_ly: null,
      ac_vs_ly_direction: "neutral",
      dt_ini: null,
      dt_end: null,
    });
  });

  it("should process using defaultDataset when datasets is empty", async () => {
    const result = await brandsHandler.handle([], mockDataset);

    expect(result.length).toBe(1);
    expect(result[0].kpi_name).toBe("volume_growth");
  });

  it("should throw an error if defaultDataset is not provided", async () => {
    await expect(brandsHandler.handle([])).rejects.toBeTruthy();
  });
});
