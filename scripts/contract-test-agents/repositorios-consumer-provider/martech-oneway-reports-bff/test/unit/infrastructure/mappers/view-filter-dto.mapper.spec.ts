import { ViewFilterDtoMapper } from "@infrastructure/mappers/view-filter-dto.mapper";
import { ViewFilterDto } from "@infrastructure/controllers/dto/view-filter.dto";

describe("ViewFilterDtoMapper", () => {
  describe("toFilterSets", () => {
    it("should return empty array when filterDto.filter is undefined", () => {
      const filterDto: ViewFilterDto = { filter: undefined };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toEqual([]);
    });

    it("should return empty array when filterDto.filter is null", () => {
      const filterDto: ViewFilterDto = { filter: null };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toEqual([]);
    });

    it("should return empty array when filterDto.filter is empty object", () => {
      const filterDto: ViewFilterDto = { filter: {} };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toEqual([]);
    });

    it("should create FilterSet with nested object values (hasSet = true)", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          filterGroup: {
            filter1: "value1",
            filter2: "value2",
          },
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("filterGroup");
      expect(result[0].filters).toHaveLength(2);
      expect(result[0].filters[0]).toEqual({
        name: "filter1",
        value: "value1",
      });
      expect(result[0].filters[1]).toEqual({
        name: "filter2",
        value: "value2",
      });
    });

    it("should add simple values to default filter set (hasSet = false)", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          country: "US",
          status: "active",
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("");
      expect(result[0].filters).toHaveLength(2);
      expect(result[0].filters).toContainEqual({
        name: "country",
        value: "US",
      });
      expect(result[0].filters).toContainEqual({
        name: "status",
        value: "active",
      });
    });

    it("should handle numeric and boolean values in simple filters", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          count: 42,
          enabled: true,
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(1);
      expect(result[0].filters).toContainEqual({ name: "count", value: 42 });
      expect(result[0].filters).toContainEqual({
        name: "enabled",
        value: true,
      });
    });

    it("should mix nested objects (hasSet) and simple values in same filter object", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          country: "US",
          filterGroup: {
            priority: "high",
            department: "sales",
          },
          status: "active",
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(2);

      // Find the FilterSet with name 'filterGroup'
      const filterSetResult = result.find((fs) => fs.name === "filterGroup");
      expect(filterSetResult).toBeDefined();
      expect(filterSetResult!.filters).toHaveLength(2);
      expect(filterSetResult!.filters).toContainEqual({
        name: "priority",
        value: "high",
      });
      expect(filterSetResult!.filters).toContainEqual({
        name: "department",
        value: "sales",
      });

      // Find the default FilterSet (empty name)
      const defaultResult = result.find((fs) => fs.name === "");
      expect(defaultResult).toBeDefined();
      expect(defaultResult!.filters).toHaveLength(2);
      expect(defaultResult!.filters).toContainEqual({
        name: "country",
        value: "US",
      });
      expect(defaultResult!.filters).toContainEqual({
        name: "status",
        value: "active",
      });
    });

    it("should handle nested object with null value as object (hasSet = true)", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          group: {
            key1: "val1",
          },
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("group");
    });

    it("should only add default FilterSet if defaultFilterSet has items (covers line 34)", () => {
      // Test case where we have only nested objects, no simple filters
      const filterDto: ViewFilterDto = {
        filter: {
          filterGroup1: {
            nested1: "value1",
          },
          filterGroup2: {
            nested2: "value2",
          },
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(2);
      // Should NOT have a default FilterSet since defaultFilterSet is empty
      const defaultFilterSet = result.find((fs) => fs.name === "");
      expect(defaultFilterSet).toBeUndefined();
    });

    it("should handle mixed nested objects with primitives and objects", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          region: "EMEA",
          priority: "medium",
          categories: {
            cat1: "tech",
            cat2: "ops",
          },
          enabled: true,
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);

      // Should have 2 FilterSets: one for 'categories' and one default
      expect(result).toHaveLength(2);

      const categoriesSet = result.find((fs) => fs.name === "categories");
      expect(categoriesSet).toBeDefined();
      expect(categoriesSet!.filters).toHaveLength(2);

      const defaultSet = result.find((fs) => fs.name === "");
      expect(defaultSet).toBeDefined();
      expect(defaultSet!.filters).toHaveLength(3); // region, priority, enabled
    });

    it("should handle empty nested object as having set (hasSet = true)", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          emptyGroup: {},
          simpleValue: "value",
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(2);

      const emptyGroup = result.find((fs) => fs.name === "emptyGroup");
      expect(emptyGroup).toBeDefined();
      expect(emptyGroup!.filters).toHaveLength(0);

      const defaultSet = result.find((fs) => fs.name === "");
      expect(defaultSet).toBeDefined();
      expect(defaultSet!.filters).toHaveLength(1);
    });

    it("should process multiple FilterSets with different types of values", () => {
      const filterDto: ViewFilterDto = {
        filter: {
          stringGroup: {
            str1: "text",
            str2: "more text",
          },
          numberGroup: {
            num1: 10,
            num2: 20,
          },
          boolGroup: {
            flag1: true,
            flag2: false,
          },
        },
      };
      const result = ViewFilterDtoMapper.toFilterSets(filterDto);
      expect(result).toHaveLength(3);

      const stringGroup = result.find((fs) => fs.name === "stringGroup");
      expect(stringGroup!.filters.length).toBe(2);

      const numberGroup = result.find((fs) => fs.name === "numberGroup");
      expect(numberGroup!.filters.length).toBe(2);

      const boolGroup = result.find((fs) => fs.name === "boolGroup");
      expect(boolGroup!.filters.length).toBe(2);
    });
  });
});
