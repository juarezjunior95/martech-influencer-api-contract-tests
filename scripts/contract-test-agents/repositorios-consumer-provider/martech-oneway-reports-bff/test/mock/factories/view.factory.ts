import { faker } from "@faker-js/faker";
import {
  ViewConfig,
  FilterSet,
  ComponentConfig,
  DataSourceConfig,
  DataSource,
  Filter,
} from "@domain/entities/view.entity";

/**
 * Factory for ViewConfig
 * Exemple use:
 * const config = ViewConfigFactory.create();
 * const customConfig = ViewConfigFactory.create({ version: '2.0.0' });
 */
export class ViewConfigFactory {
  static create(overrides?: Partial<ViewConfig>): ViewConfig {
    return {
      version: faker.system.semver(),
      cache: {
        enabled: faker.datatype.boolean(),
        tags: [
          `view-${faker.string.alpha(5)}`,
          `cache-${faker.string.alpha(5)}`,
        ],
      },
      components: [
        ComponentConfigFactory.create(),
        ComponentConfigFactory.create(),
      ],
      ...overrides,
    };
  }

  static createWithComponents(
    componentCount: number,
    overrides?: Partial<ViewConfig>,
  ): ViewConfig {
    return {
      ...this.create(overrides),
      components: Array.from({ length: componentCount }, () =>
        ComponentConfigFactory.create(),
      ),
    };
  }
}

/**
 * Factory for ComponentConfig
 */
export class ComponentConfigFactory {
  static create(overrides?: Partial<ComponentConfig>): ComponentConfig {
    return {
      id: faker.string.uuid(),
      formatter: faker.helpers.arrayElement([
        "default",
        "portfolio-brand",
        "example",
      ]),
      datasources: [
        DataSourceConfigFactory.create(),
        DataSourceConfigFactory.create(),
      ],
      ...overrides,
    };
  }

  static createWithDatasources(
    datasourceCount: number,
    overrides?: Partial<ComponentConfig>,
  ): ComponentConfig {
    return {
      ...this.create(overrides),
      datasources: Array.from({ length: datasourceCount }, () =>
        DataSourceConfigFactory.create(),
      ),
    };
  }
}

/**
 * Factory for DataSourceConfig
 */
export class DataSourceConfigFactory {
  static create(overrides?: Partial<DataSourceConfig>): DataSourceConfig {
    return {
      name: faker.string.alpha({ length: { min: 5, max: 15 } }),
      title: faker.string.alpha({ length: { min: 5, max: 10 } }),
      filterSet: faker.helpers.maybe(() => faker.string.alpha(8), {
        probability: 0.6,
      }),
      ...overrides,
    };
  }
}

/**
 * Factory for FilterSet
 */
export class FilterSetFactory {
  static create(overrides?: Partial<FilterSet>): FilterSet {
    return {
      name: faker.string.alpha(8),
      filters: [
        FilterFactory.create({ name: "country" }),
        FilterFactory.create({ name: "brand" }),
      ],
      ...overrides,
    };
  }

  static createWithFilters(
    filterCount: number,
    overrides?: Partial<FilterSet>,
  ): FilterSet {
    return {
      ...this.create(overrides),
      filters: Array.from({ length: filterCount }, () =>
        FilterFactory.create(),
      ),
    };
  }
}

/**
 * Factory for Filter
 */
export class FilterFactory {
  static create(overrides?: Partial<Filter>): Filter {
    return {
      name: faker.helpers.arrayElement(["country", "brand", "region"]),
      value: faker.helpers.arrayElement([
        faker.location.countryCode(),
        faker.company.name(),
        faker.location.state(),
      ]),
      ...overrides,
    };
  }
}

/**
 * Factory fore DataSource (loaded data)
 */
export class DataSourceFactory {
  static create(overrides?: Partial<DataSource>): DataSource {
    return {
      name: faker.string.alpha(10),
      data: [
        {
          id: faker.string.uuid(),
          value: faker.number.int({ min: 1, max: 10000 }),
          label: faker.commerce.productName(),
        },
        {
          id: faker.string.uuid(),
          value: faker.number.int({ min: 1, max: 10000 }),
          label: faker.commerce.productName(),
        },
      ],
      ...overrides,
    };
  }

  static createWithItems(
    itemCount: number,
    overrides?: Partial<DataSource>,
  ): DataSource {
    return {
      ...this.create(overrides),
      data: Array.from({ length: itemCount }, () => ({
        id: faker.string.uuid(),
        value: faker.number.int({ min: 1, max: 10000 }),
        label: faker.commerce.productName(),
      })),
    };
  }
}
