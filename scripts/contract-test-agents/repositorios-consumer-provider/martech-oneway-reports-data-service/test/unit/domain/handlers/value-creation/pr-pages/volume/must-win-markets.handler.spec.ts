import { mustWinMarketsHandler } from "@domain/handlers/value-creation/pr-pages/volume/must-win-markets.handler";
import { Dataset } from "@domain/entities/datasource.entity";
import { formatDirection } from "@common/utils/direction.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

jest.mock("@common/utils/direction.utils", () => ({
  formatDirection: jest.fn(),
}));

jest.mock("@common/utils/images/country-image.utils", () => ({
  getCountryFlag: jest.fn(),
}));

describe("MustWinMarketsHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should map defaultDataset rows with split countries, directions, and country images", async () => {
    (formatDirection as jest.Mock)
      .mockReturnValueOnce("dir-vs-ly")
      .mockReturnValueOnce("dir-ac");
    (getCountryFlag as jest.Mock).mockImplementation(
      (country: string) => `img:${country}`,
    );

    const defaultDataset: Dataset = {
      id: "must-win-markets",
      data: [
        {
          dt_ini: "2025-01-01",
          dt_end: "2025-01-31",
          period: "Jan",
          priorities: "P1",
          countries: "ECU;BOL",
          ac: "12.5",
          ac_vs_ly: "3.2",
          comp_unit_of_measure: "%",
        },
      ],
    };

    const result = await mustWinMarketsHandler.handle([], defaultDataset);

    expect(result).toHaveLength(1);
    expect(formatDirection).toHaveBeenNthCalledWith(1, 3.2);
    expect(formatDirection).toHaveBeenNthCalledWith(2, 12.5);

    expect(getCountryFlag).toHaveBeenCalledTimes(2);
    expect(getCountryFlag).toHaveBeenCalledWith("ECU", { format: "icon" });
    expect(getCountryFlag).toHaveBeenCalledWith("BOL", { format: "icon" });

    expect(result[0]).toEqual({
      dt_ini: "2025-01-01",
      dt_end: "2025-01-31",
      period: "Jan",
      priorities: "P1",
      countries: ["ECU", "BOL"],
      countriesImages: [
        { alt: "ECU", src: "img:ECU" },
        { alt: "BOL", src: "img:BOL" },
      ],
      ac: "12.5",
      variationDirectionAc: "dir-ac",
      ac_vs_ly: "3.2",
      variationDirectionVsLy: "dir-vs-ly",
      comp_unit_of_measure: "%",
    });
  });

  it.each([
    { label: "empty string", countries: "" as string | undefined },
    { label: "undefined", countries: undefined },
    { label: "null", countries: null as unknown as string | undefined },
  ])(
    "should treat countries as a single empty segment when it is $label",
    async ({ countries }) => {
      (formatDirection as jest.Mock).mockReturnValue("neutral");
      (getCountryFlag as jest.Mock).mockReturnValue("img:empty");

      const defaultDataset: Dataset = {
        id: "must-win-markets",
        data: [
          {
            dt_ini: "2025-01-01",
            dt_end: "2025-01-31",
            period: "Jan",
            priorities: "P1",
            countries,
            ac: 0,
            ac_vs_ly: 0,
            comp_unit_of_measure: "%",
          },
        ],
      };

      const result = await mustWinMarketsHandler.handle([], defaultDataset);

      expect(result[0].countries).toEqual([""]);
      expect(result[0].countriesImages).toEqual([
        { alt: "", src: "img:empty" },
      ]);
      expect(getCountryFlag).toHaveBeenCalledWith("", { format: "icon" });
    },
  );
});
