import { countriesContributionHandler } from "@domain/handlers/portfolio-brand/brand-power-book/overview/top-countries-contribution/countries-contribution.handler";
import { Dataset } from "@domain/entities/datasource.entity";

describe("CountriesContributionHandler", () => {
  describe("handler", () => {
    it("should process dataset data correctly with all fields", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            AC: "850.5",
            LY: "780.0",
            AC_VS_LY: "9.0",
            AC_VS_LY_POND: "15.5",
            NR_CONTRIBUTION: "35.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ac_vs_ly_pond: "15.5",
        country: "BRA",
        absolute_power_subtitle: expect.stringMatching(/^\[(Q4'23|FY'23)\]$/),
        ac: "850.5",
        ly: "780.0",
        comparison_subtitle: expect.stringMatching(/^\[(Q4'22|FY'22)\]$/),
        ac_vs_ly: "9.0",
        nr_contribution_subtitle: expect.stringMatching(/^\[(Q4'23|FY'23)\]$/),
        nr_contribution: "35.2",
        variation_direction_comparison: "up",
      });
      expect(result[0].country_flag).toContain("BRA.png");
    });

    it("should handle negative variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "USA",
            AC: "720.0",
            LY: "750.0",
            AC_VS_LY: "-4.0",
            AC_VS_LY_POND: "-8.5",
            NR_CONTRIBUTION: "28.5",
            DT_INI: "2023-07-01",
            DT_END: "2023-09-30",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].variation_direction_comparison).toBe("down");
      expect(result[0].ac_vs_ly).toBe("-4.0");
      expect(result[0].country_flag).toContain("USA.png");
    });

    it("should format labels correctly with brackets and without vs prefix", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "MEX",
            AC: "550.0",
            LY: "550.0",
            AC_VS_LY: "0",
            AC_VS_LY_POND: "0",
            NR_CONTRIBUTION: "22.0",
            DT_INI: "2023-01-01",
            DT_END: "2023-03-31",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result[0].absolute_power_subtitle).toMatch(/^\[(Q1'23|FY'23)\]$/);
      expect(result[0].comparison_subtitle).toMatch(/^\[(Q1'22|FY'22)\]$/);
      expect(result[0].nr_contribution_subtitle).toMatch(/^\[(Q1'23|FY'23)\]$/);
      expect(result[0].comparison_subtitle).not.toContain("vs ");
    });

    it("should handle zero variations correctly", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "ARG",
            AC: "320.0",
            LY: "320.0",
            AC_VS_LY: "0",
            AC_VS_LY_POND: "0",
            NR_CONTRIBUTION: "12.5",
            DT_INI: "2023-04-01",
            DT_END: "2023-06-30",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result[0].variation_direction_comparison).toBe("down");
      expect(result[0].country_flag).toContain("ARG.png");
    });

    it("should process multiple countries", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "BRA",
            AC: "850.5",
            LY: "780.0",
            AC_VS_LY: "9.0",
            AC_VS_LY_POND: "15.5",
            NR_CONTRIBUTION: "35.2",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            COUNTRY_ISO_CODE_3: "USA",
            AC: "720.0",
            LY: "750.0",
            AC_VS_LY: "-4.0",
            AC_VS_LY_POND: "-8.5",
            NR_CONTRIBUTION: "28.5",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
          {
            COUNTRY_ISO_CODE_3: "MEX",
            AC: "550.0",
            LY: "520.0",
            AC_VS_LY: "5.8",
            AC_VS_LY_POND: "9.2",
            NR_CONTRIBUTION: "22.0",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].country).toBe("BRA");
      expect(result[0].country_flag).toContain("BRA.png");
      expect(result[1].country).toBe("USA");
      expect(result[1].country_flag).toContain("USA.png");
      expect(result[2].country).toBe("MEX");
      expect(result[2].country_flag).toContain("MEX.png");
    });

    it("should handle countries with unknown flag", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [
          {
            COUNTRY_ISO_CODE_3: "XXX",
            AC: "100.0",
            LY: "95.0",
            AC_VS_LY: "5.3",
            AC_VS_LY_POND: "2.5",
            NR_CONTRIBUTION: "4.0",
            DT_INI: "2023-10-01",
            DT_END: "2023-12-31",
          },
        ],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].country).toBe("XXX");
      expect(result[0].country_flag).toContain("no-flag.png");
    });

    it("should handle empty dataset data array", async () => {
      // Arrange
      const mockDataset: Dataset = {
        id: "test-dataset",
        data: [],
      };

      // Act
      const result = await countriesContributionHandler.handle([], mockDataset);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
