/**
 * Extrai swaggerDoc de um swagger-ui-init.js salvo do browser (Network).
 *
 * Uso: npx tsx scripts/extract-openapi-from-swagger-init.ts [entrada] [saída]
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const defaultIn = path.join(ROOT, "Swagger UI_files", "martech-uat-influencers.json");
const defaultOut = path.join(
  ROOT,
  "docs/openapi/martech-connect-influencer-service-uat.openapi.json",
);

function extractSwaggerDoc(raw: string): object {
  const key = '"swaggerDoc":';
  const start = raw.indexOf(key);
  if (start === -1) {
    if (raw.trimStart().startsWith("{")) {
      return JSON.parse(raw) as object;
    }
    throw new Error('Arquivo não contém "swaggerDoc" nem JSON OpenAPI puro.');
  }

  let i = raw.indexOf("{", start + key.length);
  let depth = 0;
  let inStr = false;
  let esc = false;
  const begin = i;
  for (; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return JSON.parse(raw.slice(begin, i)) as object;
}

const inputPath = path.resolve(ROOT, process.argv[2] ?? defaultIn);
const outputPath = path.resolve(ROOT, process.argv[3] ?? defaultOut);

const spec = extractSwaggerDoc(readFileSync(inputPath, "utf8"));
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");

const paths = (spec as { paths?: Record<string, unknown> }).paths ?? {};
let ops = 0;
for (const item of Object.values(paths)) {
  for (const k of Object.keys(item as object)) {
    if (["get", "post", "put", "patch", "delete"].includes(k)) ops++;
  }
}

console.log(`Extraído → ${outputPath}`);
console.log(`${Object.keys(paths).length} paths, ${ops} operações`);
