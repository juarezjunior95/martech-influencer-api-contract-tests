import * as fs from "fs";
import * as path from "path";

const SQL_ROOT = path.join(
  process.cwd(),
  "src/infrastructure/sql/databricks/value-creation/pr-pages/volume-beer-adj",
);

const EXPECTED_SQL_FILES = [
  "big-numbers.sql",
  "line-chart.sql",
  "growth-levers.sql",
  "portfolio.sql",
  "must-win-markets.sql",
  "div-by-brands.sql",
  "brands-by-segments/bar-chart.sql",
  "brands-by-segments/top-15-countries.sql",
  "segments-gb/div-by-brands.sql",
  "segments-gb/table.sql",
  "global/table/priorities.sql",
];

describe("PR Pages volume-beer-adj SQL assets", () => {
  it.each(EXPECTED_SQL_FILES)("should exist on disk: %s", (relativePath) => {
    const fullPath = path.join(SQL_ROOT, relativePath);
    expect(fs.existsSync(fullPath)).toBe(true);
    const content = fs.readFileSync(fullPath, "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("should have exactly the expected set of SQL files (no drift)", () => {
    const collect = (dir: string, prefix = ""): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const out: string[] = [];
      for (const e of entries) {
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) {
          out.push(...collect(path.join(dir, e.name), rel));
        } else if (e.name.endsWith(".sql")) {
          out.push(rel);
        }
      }
      return out.sort();
    };

    const onDisk = collect(SQL_ROOT).sort();
    const expected = [...EXPECTED_SQL_FILES].sort();
    expect(onDisk).toEqual(expected);
  });
});
