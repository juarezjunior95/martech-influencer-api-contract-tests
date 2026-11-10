import { registerHelpers } from "../../../../../src/infrastructure/repositories/helpers";

describe("registerHelpers", () => {
  let mockExpression: any;
  let registeredFunctions: Map<string, (...args: any[]) => any>;

  beforeEach(() => {
    registeredFunctions = new Map();
    mockExpression = {
      registerFunction: jest.fn((name, impl) => {
        registeredFunctions.set(name, impl);
      }),
    };
  });

  it("should register all helper functions", () => {
    registerHelpers(mockExpression);

    const expectedFunctions = [
      "safeNumber",
      "formatValue",
      "formatPeriod",
      "formatCompactNumber",
      "formatDateToQuarter",
      "formatDateToMonth",
      "formatLyPeriod",
      "formatPercentValue",
      "formatPeriodChip",
      "formatPeriodRange",
      "getTrend",
      "getColorUpDown",
    ];

    expectedFunctions.forEach((funcName) => {
      expect(mockExpression.registerFunction).toHaveBeenCalledWith(
        funcName,
        expect.any(Function),
      );
      expect(registeredFunctions.has(funcName)).toBe(true);
    });
  });
});
