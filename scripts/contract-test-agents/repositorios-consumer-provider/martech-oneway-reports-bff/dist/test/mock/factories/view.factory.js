"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceFactory = exports.FilterFactory = exports.FilterSetFactory = exports.DataSourceConfigFactory = exports.ComponentConfigFactory = exports.ViewConfigFactory = void 0;
const faker_1 = require("@faker-js/faker");
class ViewConfigFactory {
    static create(overrides) {
        return {
            version: faker_1.faker.system.semver(),
            cache: {
                enabled: faker_1.faker.datatype.boolean(),
                tags: [
                    `view-${faker_1.faker.string.alpha(5)}`,
                    `cache-${faker_1.faker.string.alpha(5)}`,
                ],
            },
            components: [
                ComponentConfigFactory.create(),
                ComponentConfigFactory.create(),
            ],
            ...overrides,
        };
    }
    static createWithComponents(componentCount, overrides) {
        return {
            ...this.create(overrides),
            components: Array.from({ length: componentCount }, () => ComponentConfigFactory.create()),
        };
    }
}
exports.ViewConfigFactory = ViewConfigFactory;
class ComponentConfigFactory {
    static create(overrides) {
        return {
            id: faker_1.faker.string.uuid(),
            formatter: faker_1.faker.helpers.arrayElement([
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
    static createWithDatasources(datasourceCount, overrides) {
        return {
            ...this.create(overrides),
            datasources: Array.from({ length: datasourceCount }, () => DataSourceConfigFactory.create()),
        };
    }
}
exports.ComponentConfigFactory = ComponentConfigFactory;
class DataSourceConfigFactory {
    static create(overrides) {
        return {
            name: faker_1.faker.string.alpha({ length: { min: 5, max: 15 } }),
            title: faker_1.faker.string.alpha({ length: { min: 5, max: 10 } }),
            filterSet: faker_1.faker.helpers.maybe(() => faker_1.faker.string.alpha(8), {
                probability: 0.6,
            }),
            ...overrides,
        };
    }
}
exports.DataSourceConfigFactory = DataSourceConfigFactory;
class FilterSetFactory {
    static create(overrides) {
        return {
            name: faker_1.faker.string.alpha(8),
            filters: [
                FilterFactory.create({ name: "country" }),
                FilterFactory.create({ name: "brand" }),
            ],
            ...overrides,
        };
    }
    static createWithFilters(filterCount, overrides) {
        return {
            ...this.create(overrides),
            filters: Array.from({ length: filterCount }, () => FilterFactory.create()),
        };
    }
}
exports.FilterSetFactory = FilterSetFactory;
class FilterFactory {
    static create(overrides) {
        return {
            name: faker_1.faker.helpers.arrayElement(["country", "brand", "region"]),
            value: faker_1.faker.helpers.arrayElement([
                faker_1.faker.location.countryCode(),
                faker_1.faker.company.name(),
                faker_1.faker.location.state(),
            ]),
            ...overrides,
        };
    }
}
exports.FilterFactory = FilterFactory;
class DataSourceFactory {
    static create(overrides) {
        return {
            name: faker_1.faker.string.alpha(10),
            data: [
                {
                    id: faker_1.faker.string.uuid(),
                    value: faker_1.faker.number.int({ min: 1, max: 10000 }),
                    label: faker_1.faker.commerce.productName(),
                },
                {
                    id: faker_1.faker.string.uuid(),
                    value: faker_1.faker.number.int({ min: 1, max: 10000 }),
                    label: faker_1.faker.commerce.productName(),
                },
            ],
            ...overrides,
        };
    }
    static createWithItems(itemCount, overrides) {
        return {
            ...this.create(overrides),
            data: Array.from({ length: itemCount }, () => ({
                id: faker_1.faker.string.uuid(),
                value: faker_1.faker.number.int({ min: 1, max: 10000 }),
                label: faker_1.faker.commerce.productName(),
            })),
        };
    }
}
exports.DataSourceFactory = DataSourceFactory;
//# sourceMappingURL=view.factory.js.map