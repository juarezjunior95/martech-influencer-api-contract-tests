/**
 * Backlog de endpoints: automatizado (Pact) × pendente (OpenAPI UAT).
 *
 * Uso: npm run pact:endpoint-backlog
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

type OpenAPISpec = {
  info?: { title?: string; version?: string };
  paths?: Record<
    string,
    Record<
      string,
      { tags?: string[]; operationId?: string; summary?: string }
    >
  >;
};

type ManifestStory = {
  sprint: string;
  jira: string;
  endpoint: string;
  specFile: string;
  scenarios: { id: string; title: string }[];
};

type Manifest = { title: string; stories: ManifestStory[] };

type PactFile = {
  interactions?: { request?: { method?: string; path?: string } }[];
};

const ROOT = process.cwd();
const OPENAPI_PATH = path.join(
  ROOT,
  "docs/openapi/martech-connect-influencer-service-uat.openapi.json",
);
const MANIFEST_PATH = path.join(ROOT, "scripts/pact-backlog-manifest.json");
const PACT_PATH = path.join(
  ROOT,
  "tests/contract/pacts/connect-influencer-web-martech-connect-influencer-service.json",
);
const JSON_OUT = path.join(ROOT, "scripts/pact-endpoint-backlog.json");
const MD_OUT = path.join(ROOT, "docs/pact-endpoint-backlog.md");
const HTML_OUT = path.join(ROOT, "reports/pact-endpoint-backlog.html");

const HTTP = new Set(["get", "post", "put", "patch", "delete"]);

function canonicalRoute(route: string): string {
  return route
    .replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "/{param}",
    )
    .replace(/\{[^}]+\}/g, "{param}");
}

function opKey(method: string, route: string): string {
  return `${method.toUpperCase()} ${canonicalRoute(route)}`;
}

function suggestPriority(tag: string, route: string, method: string): string {
  const m = method.toLowerCase();
  if (tag === "Health") return "P4";
  if (tag === "omnichannel") return "P3";
  if (route.includes("creatoriq") || (route.includes("/brands") && m === "patch"))
    return "P3";
  if (tag === "partner-approval") return "P2";
  if (tag === "campaigns" && m === "get" && !route.includes("{")) return "P1";
  if (tag === "users" && m === "get") return "P1";
  if (tag === "partners" && m === "get") return "P1";
  if (tag === "users" || tag === "campaigns") return "P2";
  if (["markets", "megaplatforms", "platforms", "zones", "role-titles", "partner-types", "partner-activation-intentions", "brands"].includes(tag))
    return "P3";
  if (tag === "partner-brand-safety") return "P2";
  return "P3";
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function main(): void {
  const spec = JSON.parse(readFileSync(OPENAPI_PATH, "utf8")) as OpenAPISpec;
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
  const pact = JSON.parse(readFileSync(PACT_PATH, "utf8")) as PactFile;

  const pactCounts = new Map<string, number>();
  const pactLiterals = new Map<string, string>();
  for (const i of pact.interactions ?? []) {
    const method = i.request?.method?.toUpperCase();
    const p = i.request?.path;
    if (!method || !p) continue;
    const key = opKey(method, p);
    pactCounts.set(key, (pactCounts.get(key) ?? 0) + 1);
    pactLiterals.set(key, p);
  }

  const automatedKeys = new Set<string>();
  const automated = manifest.stories.map((story) => {
    const [method, ...rest] = story.endpoint.split(" ");
    const route = rest.join(" ");
    const key = opKey(method, route);
    automatedKeys.add(key);
    return {
      status: "done" as const,
      sprint: story.sprint,
      jira: story.jira,
      operation: story.endpoint,
      canonical: key,
      specFile: story.specFile,
      scenarioCount: story.scenarios.length,
      scenarioIds: story.scenarios.map((s) => s.id),
      pactInteractions: pactCounts.get(key) ?? story.scenarios.length,
    };
  });

  // Pact paths not in manifest (e.g. extra GET jobs without queued)
  const pactOnly: { operation: string; interactions: number; note: string }[] =
    [];
  for (const [key, count] of pactCounts) {
    if (automatedKeys.has(key)) continue;
    const sample = pact.interactions?.find((i) => {
      const method = i.request?.method?.toUpperCase();
      const p = i.request?.path;
      return method && p && opKey(method, p) === key;
    });
    const literal = sample?.request?.path ?? key;
    const method = sample?.request?.method?.toUpperCase() ?? "GET";
    pactOnly.push({
      operation: `${method} ${literal}`,
      interactions: count,
      note: "Mesmo endpoint do manifest (UUID no path) ou rota extra — revisar se mantém",
    });
  }

  const pending: {
    operation: string;
    path: string;
    method: string;
    tag: string;
    operationId?: string;
    summary?: string;
    priority: string;
  }[] = [];

  const allOps: string[] = [];
  for (const [route, methods] of Object.entries(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (!HTTP.has(method)) continue;
      const key = opKey(method, route);
      allOps.push(key);
      const tag = op.tags?.[0] ?? "untagged";
      if (automatedKeys.has(key)) continue;
      pending.push({
        operation: `${method.toUpperCase()} ${route}`,
        path: route,
        method: method.toUpperCase(),
        tag,
        operationId: op.operationId,
        summary: op.summary,
        priority: suggestPriority(tag, route, method),
      });
    }
  }

  pending.sort(
    (a, b) =>
      a.priority.localeCompare(b.priority) ||
      a.tag.localeCompare(b.tag) ||
      a.operation.localeCompare(b.operation),
  );

  const byTagPending: Record<string, typeof pending> = {};
  for (const item of pending) {
    if (!byTagPending[item.tag]) byTagPending[item.tag] = [];
    byTagPending[item.tag].push(item);
  }

  const backlog = {
    generatedAt: new Date().toISOString(),
    api: {
      title: spec.info?.title,
      version: spec.info?.version,
      openapiPath: path.relative(ROOT, OPENAPI_PATH),
    },
    summary: {
      swaggerOperations: allOps.length,
      automatedEndpoints: automated.length,
      automatedInteractions: [...pactCounts.values()].reduce((a, b) => a + b, 0),
      pendingOperations: pending.length,
      coveragePercent: Math.round((automatedKeys.size / allOps.length) * 1000) / 10,
    },
    automated,
    pactOnlyOutsideManifest: pactOnly,
    pendingByPriority: {
      P1: pending.filter((p) => p.priority === "P1"),
      P2: pending.filter((p) => p.priority === "P2"),
      P3: pending.filter((p) => p.priority === "P3"),
      P4: pending.filter((p) => p.priority === "P4"),
    },
    pendingByTag: byTagPending,
    priorityLegend: {
      P1: "Alta — telas principais do portal (listagens/filtros usados com fluxos já automatizados)",
      P2: "Média — fluxos de aprovação, writes adicionais, brand-safety restante",
      P3: "Baixa — cadastros admin, sync CreatorIQ, omnichannel",
      P4: "Opcional — health checks (geralmente fora do consumer Pact)",
    },
  };

  writeFileSync(JSON_OUT, `${JSON.stringify(backlog, null, 2)}\n`, "utf8");

  const md: string[] = [
    `# Backlog Pact — Martech Connect Influencer (UAT Swagger)`,
    ``,
    `Gerado em: ${backlog.generatedAt}`,
    ``,
    `| Métrica | Valor |`,
    `|--------|-------|`,
    `| Operações no Swagger | ${backlog.summary.swaggerOperations} |`,
    `| Endpoints com spec consumer | ${backlog.summary.automatedEndpoints} |`,
    `| Interações no pact | ${backlog.summary.automatedInteractions} |`,
    `| Operações pendentes | ${backlog.summary.pendingOperations} |`,
    `| Cobertura (endpoints) | ${backlog.summary.coveragePercent}% |`,
    ``,
    `Spec: [\`${backlog.api.openapiPath}\`](openapi/martech-connect-influencer-service-uat.openapi.json)`,
    ``,
    `## Feito (automatizado)`,
    ``,
    `| Sprint | Jira | Endpoint | Cenários | Spec |`,
    `|--------|------|----------|----------|------|`,
    ...automated.map(
      (a) =>
        `| ${a.sprint} | ${a.jira} | \`${a.operation}\` | ${a.scenarioCount} (${a.pactInteractions} interações) | \`${path.basename(a.specFile)}\` |`,
    ),
  ];

  if (pactOnly.length) {
    md.push(``, `### Ajustes / fora do manifest`, ``);
    for (const p of pactOnly) {
      md.push(
        `- **${p.interactions}×** \`${p.operation}\` — ${p.note}`,
      );
    }
  }

  md.push(
    ``,
    `## Pendente (por prioridade sugerida)`,
    ``,
    `> P1–P4 é sugestão para o portal consumer; ajuste conforme roadmap de produto.`,
    ``,
  );

  for (const prio of ["P1", "P2", "P3", "P4"] as const) {
    const items = backlog.pendingByPriority[prio];
    if (!items.length) continue;
    md.push(`### ${prio} — ${backlog.priorityLegend[prio]}`, ``);
    md.push(`| Tag | Operação |`, `|-----|----------|`);
    for (const item of items) {
      md.push(`| ${item.tag} | \`${item.operation}\` |`);
    }
    md.push(``);
  }

  md.push(`## Pendente (por tag Swagger)`, ``);
  for (const tag of Object.keys(byTagPending).sort()) {
    const items = byTagPending[tag];
    md.push(`### ${tag} (${items.length} pendentes)`, ``);
    for (const item of items) {
      md.push(`- [ ] \`${item.operation}\` (${item.priority})`);
    }
    md.push(``);
  }

  md.push(
    `---`,
    `Regenerar: \`npm run pact:endpoint-backlog\``,
  );

  mkdirSync(path.dirname(MD_OUT), { recursive: true });
  writeFileSync(MD_OUT, md.join("\n"), "utf8");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Backlog endpoints Pact</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; max-width: 1200px; }
    h1 { font-size: 1.4rem; }
    h2 { margin-top: 2rem; font-size: 1.1rem; }
    .metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
    .metric { background: #f4f4f5; padding: 0.6rem 1rem; border-radius: 8px; }
    .metric strong { font-size: 1.4rem; display: block; }
    table { border-collapse: collapse; width: 100%; font-size: 0.88rem; margin: 0.5rem 0 1.5rem; }
    th, td { border: 1px solid #e4e4e7; padding: 0.35rem 0.5rem; text-align: left; vertical-align: top; }
    th { background: #fafafa; }
    tr.done td { background: #ecfdf5; }
    tr.p1 td { background: #fff7ed; }
    tr.p2 td { background: #fefce8; }
    .prio { font-weight: 600; width: 2.5rem; }
    code { font-size: 0.85em; }
    .note { color: #71717a; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>${esc(spec.info?.title ?? "API")} — backlog Pact (feito × falta)</h1>
  <p class="note">Atualizado: ${esc(backlog.generatedAt)} · Cobertura ${backlog.summary.coveragePercent}% (${automated.length}/${allOps.length} operações)</p>
  <div class="metrics">
    <div class="metric"><strong>${automated.length}</strong> com consumer spec</div>
    <div class="metric"><strong>${backlog.summary.automatedInteractions}</strong> interações pact</div>
    <div class="metric"><strong>${pending.length}</strong> pendentes</div>
  </div>

  <h2>✅ Já automatizado (${automated.length})</h2>
  <table>
    <thead><tr><th>Sprint</th><th>Jira</th><th>Endpoint</th><th>Cenários</th><th>Spec</th></tr></thead>
    <tbody>
      ${automated
        .map(
          (a) =>
            `<tr class="done"><td>${esc(a.sprint)}</td><td>${esc(a.jira)}</td><td><code>${esc(a.operation)}</code></td><td>${a.scenarioCount}</td><td><code>${esc(path.basename(a.specFile))}</code></td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  ${
    pactOnly.length
      ? `<h2>⚠️ Pact extra (revisar)</h2><ul>${pactOnly
          .map(
            (p) =>
              `<li><code>${esc(p.operation)}</code> (${p.interactions} interações) — ${esc(p.note)}</li>`,
          )
          .join("")}</ul>`
      : ""
  }

  <h2>📋 Pendente (${pending.length})</h2>
  <table>
    <thead><tr><th></th><th>Tag</th><th>Operação</th></tr></thead>
    <tbody>
      ${pending
        .map(
          (p) =>
            `<tr class="${p.priority.toLowerCase()}"><td class="prio">${esc(p.priority)}</td><td>${esc(p.tag)}</td><td><code>${esc(p.operation)}</code></td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>`;

  mkdirSync(path.dirname(HTML_OUT), { recursive: true });
  writeFileSync(HTML_OUT, html, "utf8");

  console.log("Backlog JSON:", JSON_OUT);
  console.log("Backlog MD:  ", MD_OUT);
  console.log("Backlog HTML:", HTML_OUT);
  console.log(
    `Resumo: ${automated.length} feitos, ${pending.length} pendentes, ${backlog.summary.coveragePercent}% cobertura`,
  );
}

main();
