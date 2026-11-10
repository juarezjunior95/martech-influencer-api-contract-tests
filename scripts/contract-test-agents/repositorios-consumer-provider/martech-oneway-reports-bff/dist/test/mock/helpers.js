"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockViewConfigRepository = mockViewConfigRepository;
exports.mockDataRepository = mockDataRepository;
exports.mockFormatterRepository = mockFormatterRepository;
exports.mockViewCacheRepository = mockViewCacheRepository;
exports.mockUserRepository = mockUserRepository;
exports.createPromiseAllSpy = createPromiseAllSpy;
exports.throwError = throwError;
exports.delay = delay;
exports.createCompleteViewConfigMock = createCompleteViewConfigMock;
exports.createMultipleDatasources = createMultipleDatasources;
exports.validateProcessedViewResult = validateProcessedViewResult;
exports.logTestStep = logTestStep;
const view_factory_1 = require("./factories/view.factory");
function mockViewConfigRepository() {
    return {
        getByName: jest.fn(),
    };
}
function mockDataRepository() {
    return {
        getData: jest.fn().mockResolvedValue(view_factory_1.DataSourceFactory.create({
            name: "default-datasource",
        })),
    };
}
function mockFormatterRepository() {
    return {
        format: jest.fn().mockResolvedValue({
            formatted: true,
            timestamp: new Date().toISOString(),
        }),
    };
}
function mockViewCacheRepository() {
    return {
        getView: jest.fn(),
        setView: jest.fn(),
        invalidateByTags: jest.fn(),
    };
}
function mockUserRepository() {
    return {
        getCurrentUser: jest.fn().mockResolvedValue({
            id: "user-123",
            email: "test@example.com",
        }),
    };
}
function createPromiseAllSpy() {
    const spy = jest.spyOn(Promise, "all");
    return {
        spy,
        restore: () => spy.mockRestore(),
        callCount: () => spy.mock.calls.length,
    };
}
function throwError(message) {
    return () => {
        throw new Error(message);
    };
}
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function createCompleteViewConfigMock() {
    return {
        getByName: jest.fn().mockResolvedValue(view_factory_1.ViewConfigFactory.create()),
        getAll: jest
            .fn()
            .mockResolvedValue([view_factory_1.ViewConfigFactory.create({ components: [] })]),
        exists: jest.fn().mockResolvedValue(true),
    };
}
function createMultipleDatasources(count) {
    return Array.from({ length: count }, (_, i) => view_factory_1.DataSourceFactory.create({ name: `datasource-${i + 1}` }));
}
function validateProcessedViewResult(result) {
    expect(result).toHaveProperty("view");
    expect(result).toHaveProperty("components");
    expect(Array.isArray(result.components)).toBe(true);
    result.components.forEach((component) => {
        expect(component).toHaveProperty("id");
        expect(component.hasOwnProperty("data") || component.hasOwnProperty("error")).toBe(true);
    });
}
function logTestStep(step, details) {
    if (process.env.DEBUG_TESTS) {
        console.log(`✓ ${step}`, details ? JSON.stringify(details, null, 2) : "");
    }
}
//# sourceMappingURL=helpers.js.map