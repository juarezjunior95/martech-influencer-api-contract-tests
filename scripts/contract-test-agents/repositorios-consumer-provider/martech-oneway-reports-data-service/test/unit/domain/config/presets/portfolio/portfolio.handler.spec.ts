import {
  portfolioHandler,
  PortfolioPresetValue,
} from "@domain/config/presets/portfolio/portfolio.handler";

describe("portfolioHandler", () => {
  it("emits the base portfolio list when options are omitted", () => {
    const result = portfolioHandler.handle({ portfolio: {} });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.enabled).toBe(true);
    expect(portfolio.values).toEqual([
      { value: "Megabrands", label: "Megabrands", full: "" },
      { value: "Expansion", label: "Expansion", full: "" },
      { value: "Sustain", label: "Sustain", full: "" },
      { value: "Tail", label: "Tail", full: "" },
      { value: "NAB", label: "Non-Alcohol Beer", full: "" },
    ]);
    expect(portfolio.default).toEqual({
      value: "Megabrands",
      label: "Megabrands",
      full: "",
    });
  });

  it("prepends ALL / All when includeAll=true", () => {
    const result = portfolioHandler.handle({
      portfolio: { includeAll: true },
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.values[0]).toEqual({
      value: "ALL",
      label: "All",
      full: "",
    });
    expect(portfolio.values).toHaveLength(6);
    expect(portfolio.default).toEqual({
      value: "ALL",
      label: "All",
      full: "",
    });
  });

  it("removes NAB when ignoreNab=true", () => {
    const result = portfolioHandler.handle({
      portfolio: { ignoreNab: true },
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.values.map((v) => v.value)).toEqual([
      "Megabrands",
      "Expansion",
      "Sustain",
      "Tail",
    ]);
    expect(portfolio.default.value).toBe("Megabrands");
  });

  it("applies includeAll then ignoreNab", () => {
    const result = portfolioHandler.handle({
      portfolio: { includeAll: true, ignoreNab: true },
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.values.map((v) => v.value)).toEqual([
      "ALL",
      "Megabrands",
      "Expansion",
      "Sustain",
      "Tail",
    ]);
    expect(portfolio.default.value).toBe("ALL");
  });

  it("collapses default when noDefault=true", () => {
    const result = portfolioHandler.handle({
      portfolio: { noDefault: true },
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });

  it("accepts noDefault as a stringified boolean from query strings", () => {
    const result = portfolioHandler.handle({
      portfolio: { noDefault: "true" } as unknown as Record<string, unknown>,
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });

  it("supports includeAll alongside noDefault", () => {
    const result = portfolioHandler.handle({
      portfolio: { includeAll: true, noDefault: true },
    });
    const portfolio = result.portfolio as PortfolioPresetValue;

    expect(portfolio.values[0].value).toBe("ALL");
    expect(portfolio.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });
});
