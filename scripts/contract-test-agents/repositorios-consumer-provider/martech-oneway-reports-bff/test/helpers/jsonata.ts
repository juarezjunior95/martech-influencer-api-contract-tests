import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../src/infrastructure/repositories/helpers";

/**
 * Loads a JSONata file, compiles it, registers helpers, and returns the compiled expression.
 * @param relativePath - Path relative to project root (e.g. "src/infrastructure/formatters/.../file.jsonata")
 */
export function loadCompiledJsonata(relativePath: string) {
  const jsonataPath = path.join(process.cwd(), relativePath);
  const expression = fs.readFileSync(jsonataPath, "utf8");
  const compiledExpression = jsonata(expression);
  registerHelpers(compiledExpression);
  return compiledExpression;
}
