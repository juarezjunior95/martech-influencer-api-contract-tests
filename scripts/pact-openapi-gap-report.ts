/**
 * Compara operações do OpenAPI UAT com interações do pact publicado.
 *
 * Uso: npm run pact:openapi-gap-report
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

type OpenAPISpec = {
  info?: { title?: string; version?: string };
  paths?: Record<string, Record<string, unknown>>;
};

type PactInteraction = { request?: { method?: string; path?: string } };

type PactFile = { interactions?: PactInteraction[] };

const ROOT = process.cwd();
const OPENAPI_PATH = path.join(
  ROOT,
  "docs/openapi/martech-connect-influencer-service-uat.openapi.json",
);
const PACT_PATH = path.join(
  ROOT,
  "tests/contract/pacts/connect-influencer-web-martech-connect-influencer-service.json",
);
const REPORT_DIR = path.join(ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "pact-openapi-gap.html");

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]);

function normalizePactPath(p: string): string {
  return p
    .replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "/{param}",
    )
    .replace(/\{[^}]+\}/g, "{param}");
}

function canonicalRoute(route: string): string {
  return route.replace(/\{[^}]+\}/g, "{param}");
}

function loadOpenApiOps(spec: OpenAPISpec): {
  byCanonical: Map<string, string>;
  routes: Set<string>;
} {
  const byCanonical = new Map<string, string>();
  const routes = new Set<string>();
  for (const [route, item] of Object.entries(spec.paths ?? {})) {
    routes.add(route);
    for (const method of Object.keys(item)) {
      if (!HTTP_METHODS.has(method)) continue;
      const key = `${method.toUpperCase()} ${canonicalRoute(route)}`;
      byCanonical.set(key, route);
    }
  }
  return { byCanonical, routes };
}

function loadPactOps(pact: PactFile): {
  unique: Map<string, number>;
  rawNotInOpenApi: string[];
} {
  const counts = new Map<string, number>();
  const rawNotInOpenApi: string[] = [];

  const openApi = JSON.parse(
    readFileSync(OPENAPI_PATH, "utf8"),
  ) as OpenAPISpec;
  const openRoutes = new Set(
    Object.keys(openApi.paths ?? {}).map((r) => canonicalRoute(r)),
  );

  for (const interaction of pact.interactions ?? []) {
    const method = interaction.request?.method?.toUpperCase();
    const rawPath = interaction.request?.path;
    if (!method || !rawPath) continue;
    const normPath = normalizePactPath(rawPath);
    const key = `${method} ${normPath}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);

    if (!openRoutes.has(normPath) && !openRoutes.has(canonicalRoute(rawPath))) {
      rawNotInOpenApi.push(`${method} ${rawPath}`);
    }
  }

  const unique = new Map<string, number>();
  for (const [k, v] of counts) unique.set(k, v);
  return { unique, rawNotInOpenApi: [...new Set(rawNotInOpenApi)] };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function main(): void {
  if (!existsSync(OPENAPI_PATH)) {
    throw new Error(
      `OpenAPI não encontrado: ${OPENAPI_PATH}. Rode a extração do swagger-ui-init primeiro.`,
    );
  }

  const spec = JSON.parse(readFileSync(OPENAPI_PATH, "utf8")) as OpenAPISpec;
  const pact = JSON.parse(readFileSync(PACT_PATH, "utf8")) as PactFile;

  const { byCanonical: openApiOps, routes: openApiRoutes } = loadOpenApiOps(spec);
  const { unique: pactOps, rawNotInOpenApi } = loadPactOps(pact);

  const covered: string[] = [];
  const uncovered: string[] = [];

  for (const op of [...openApiOps.keys()].sort()) {
    if (pactOps.has(op)) covered.push(op);
    else uncovered.push(op);
  }

  const pactOnly = [...pactOps.keys()]
    .filter((op) => !openApiOps.has(op))
    .sort();

  const totalInteractions = [...pactOps.values()].reduce((a, b) => a + b, 0);

  mkdirSync(REPORT_DIR, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Pact × OpenAPI (UAT)</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; max-width: 1100px; }
    h1 { font-size: 1.35rem; }
    .metrics { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1rem 0; }
    .metric { background: #f4f4f5; padding: 0.75rem 1rem; border-radius: 8px; }
    .metric strong { display: block; font-size: 1.5rem; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0 2rem; font-size: 0.9rem; }
    th, td { border: 1px solid #e4e4e7; padding: 0.4rem 0.6rem; text-align: left; }
    th { background: #fafafa; }
    tr.covered td { background: #ecfdf5; }
    tr.gap td { background: #fff7ed; }
    tr.warn td { background: #fef2f2; }
    code { font-size: 0.85em; }
  </style>
</head>
<body>
  <h1>${esc(spec.info?.title ?? "OpenAPI")} — gap Pact vs Swagger UAT</h1>
  <p>Spec: <code>${esc(path.relative(ROOT, OPENAPI_PATH))}</code> · Pact: <code>${esc(path.relative(ROOT, PACT_PATH))}</code> · ${openApiRoutes.size} paths no Swagger</p>
  <div class="metrics">
    <div class="metric"><strong>${openApiOps.size}</strong> operações no Swagger</div>
    <div class="metric"><strong>${pactOps.size}</strong> rotas únicas no Pact</div>
    <div class="metric"><strong>${totalInteractions}</strong> interações Pact</div>
    <div class="metric"><strong>${covered.length}</strong> operações com ≥1 cenário</div>
    <div class="metric"><strong>${uncovered.length}</strong> operações sem Pact</div>
  </div>

  <h2>Cobertas pelo Pact (${covered.length})</h2>
  <table>
    <thead><tr><th>Operação</th><th>Interações</th></tr></thead>
    <tbody>
      ${covered
        .map(
          (op) =>
            `<tr class="covered"><td><code>${esc(op)}</code></td><td>${pactOps.get(op)}</td></tr>`,
        )
        .join("\n")}
    </tbody>
  </table>

  <h2>Sem cenário Pact (${uncovered.length})</h2>
  <table>
    <thead><tr><th>Operação</th></tr></thead>
    <tbody>
      ${uncovered
        .map((op) => `<tr class="gap"><td><code>${esc(op)}</code></td></tr>`)
        .join("\n")}
    </tbody>
  </table>

  ${
    pactOnly.length || rawNotInOpenApi.length
      ? `<h2>Atenção: Pact fora do Swagger</h2>
  <table>
    <thead><tr><th>Operação (template)</th><th>Path literal no pact</th></tr></thead>
    <tbody>
      ${pactOnly
        .map((op) => {
          const literal = [...(pact.interactions ?? [])]
            .filter(
              (i) =>
                `${i.request?.method?.toUpperCase()} ${normalizePactPath(i.request?.path ?? "")}` ===
                op,
            )
            .map((i) => i.request?.path)[0];
          return `<tr class="warn"><td><code>${esc(op)}</code></td><td><code>${esc(literal ?? "")}</code></td></tr>`;
        })
        .join("\n")}
    </tbody>
  </table>`
      : ""
  }
</body>
</html>`;

  writeFileSync(REPORT_PATH, html, "utf8");

  console.log(`OpenAPI: ${openApiOps.size} operações`);
  console.log(`Pact: ${pactOps.size} rotas únicas, ${totalInteractions} interações`);
  console.log(`Cobertura operação: ${covered.length}/${openApiOps.size}`);
  if (pactOnly.length) {
    console.log("Pact sem rota equivalente no Swagger:");
    pactOnly.forEach((o) => console.log("  ", o));
  }
  console.log(`Relatório: ${REPORT_PATH}`);
}

main();
