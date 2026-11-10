import * as fs from "fs";
import * as path from "path";

const SQL_PATH = path.join(
  process.cwd(),
  "src/infrastructure/sql/databricks/value-creation/pr-pages/volume/top-bottom-brands.sql",
);

describe("PR Pages volume top-bottom-brands SQL", () => {
  let content: string;

  beforeAll(() => {
    content = fs.readFileSync(SQL_PATH, "utf8");
  });

  it("should exist on disk with content", () => {
    expect(fs.existsSync(SQL_PATH)).toBe(true);
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("should parameterize product scope via reporttype", () => {
    expect(content).toContain(":reporttype");
    expect(content).toMatch(
      /case when :reporttype = 'TOTAL' then true else product_type in \("BEER", "ADJ"\) end/i,
    );
  });

  it("should keep Superior Core filter without Global Brands exclusion", () => {
    const superiorCoreLine = content
      .split("\n")
      .find((line) => line.includes("WHEN 'Superior Core' THEN"));

    expect(superiorCoreLine).toBeDefined();
    expect(superiorCoreLine).not.toContain("is_global_brand");
  });

  it("should consolidate Global Brands for Lead Premium and All growth levers", () => {
    expect(content).toContain(
      ":growth_lever in ('Lead Premium', 'All') and mv.country_iso_code_3_global_brands = 'ABI'",
    );
  });
});
