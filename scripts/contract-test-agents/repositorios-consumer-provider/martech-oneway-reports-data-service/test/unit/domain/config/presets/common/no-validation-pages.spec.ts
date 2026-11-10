import {
  NO_VALIDATION_PAGES,
  pageAllowsAllOptions,
} from "@domain/config/presets/common/no-validation-pages";

describe("no-validation-pages", () => {
  it.each(NO_VALIDATION_PAGES)("returns true for %s", (page) => {
    expect(pageAllowsAllOptions(page)).toBe(true);
  });

  it("returns false when page is invalid", () => {
    expect(pageAllowsAllOptions("invalid_page")).toBe(false);
    expect(pageAllowsAllOptions(undefined)).toBe(false);
    expect(pageAllowsAllOptions("")).toBe(false);
  });
});
