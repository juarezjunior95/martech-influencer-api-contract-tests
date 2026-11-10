import { DataSourceFilterDtoMapper } from "@infrastructure/mappers/datasource-filter-dto.mapper";
import { DataSourceFilterDto } from "@infrastructure/controllers/dto/datasource-filter.dto";

describe("DataSourceFilterDtoMapper", () => {
  describe("toFilters", () => {
    it("should return empty array when filter property is undefined", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {};

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when filter property is null", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: null as any,
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when filter is an empty object", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {},
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should convert single string filter to Filter array", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          country: "BRA",
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "country",
        value: "BRA",
      });
    });

    it("should convert single number filter to Filter array", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          year: 2023,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "year",
        value: 2023,
      });
    });

    it("should convert single boolean filter to Filter array", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          active: true,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "active",
        value: true,
      });
    });

    it("should convert multiple filters with different types to Filter array", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          country: "BRA",
          brand: "Corona",
          year: 2023,
          active: true,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(4);
      expect(result).toEqual(
        expect.arrayContaining([
          { name: "country", value: "BRA" },
          { name: "brand", value: "Corona" },
          { name: "year", value: 2023 },
          { name: "active", value: true },
        ]),
      );
    });

    it("should handle filters with special characters in keys", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          "filter-key": "value",
          filter_key: "another-value",
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          { name: "filter-key", value: "value" },
          { name: "filter_key", value: "another-value" },
        ]),
      );
    });

    it("should handle zero as a valid number value", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          count: 0,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "count",
        value: 0,
      });
    });

    it("should handle empty string as a valid value", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          search: "",
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "search",
        value: "",
      });
    });

    it("should handle false as a valid boolean value", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          enabled: false,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "enabled",
        value: false,
      });
    });

    it("should preserve the order of filters from the input object", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          first: "1",
          second: "2",
          third: "3",
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(3);
      // Note: Object.entries preserves insertion order in modern JavaScript
      expect(result[0].name).toBe("first");
      expect(result[1].name).toBe("second");
      expect(result[2].name).toBe("third");
    });

    it("should handle mixed case filter keys", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          Country: "USA",
          BRAND: "Budweiser",
          YeAr: 2024,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          { name: "Country", value: "USA" },
          { name: "BRAND", value: "Budweiser" },
          { name: "YeAr", value: 2024 },
        ]),
      );
    });

    it("should handle filters with numeric string values", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          zipCode: "12345",
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "zipCode",
        value: "12345",
      });
      expect(typeof result[0].value).toBe("string");
    });

    it("should handle filters with negative numbers", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          temperature: -10,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "temperature",
        value: -10,
      });
    });

    it("should handle filters with decimal numbers", () => {
      // Arrange
      const filterDto: DataSourceFilterDto = {
        filter: {
          price: 99.99,
        },
      };

      // Act
      const result = DataSourceFilterDtoMapper.toFilters(filterDto);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "price",
        value: 99.99,
      });
    });
  });
});
