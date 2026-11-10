/**
 * Gera relatório HTML do backlog Pact (automatizado vs pendente).
 *
 * Uso: npm run pact:backlog-report
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

type Scenario = { id: string; title: string };
type Story = {
  sprint: string;
  jira: string;
  endpoint: string;
  specFile: string;
  scenarios: Scenario[];
};

type Manifest = {
  title: string;
  stories: Story[];
};

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "scripts/pact-backlog-manifest.json");
const REPORT_DIR = path.join(ROOT, "reports");
const REPORT_PATH = path.join(REPORT_DIR, "pact-backlog-report.html");

function loadManifest(): Manifest {
  const raw = readFileSync(MANIFEST_PATH, "utf8");
  return JSON.parse(raw) as Manifest;
}

function isScenarioAutomated(specContent: string, scenarioId: string): boolean {
  const patterns = [
    `it("${scenarioId}`,
    `it('${scenarioId}`,
    `${scenarioId} —`,
    `${scenarioId} -`,
    `/ ${scenarioId} `,
  ];
  return patterns.some((p) => specContent.includes(p));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function main() {
  const manifest = loadManifest();
  const generatedAt = new Date().toISOString();

  let total = 0;
  let automated = 0;
  const rows: string[] = [];

  for (const story of manifest.stories) {
    const specPath = path.join(ROOT, story.specFile);
    const specExists = existsSync(specPath);
    const specContent = specExists ? readFileSync(specPath, "utf8") : "";

    for (const scenario of story.scenarios) {
      total += 1;
      const done = specExists && isScenarioAutomated(specContent, scenario.id);
      if (done) automated += 1;

      rows.push(`
        <tr class="${done ? "ok" : "pending"}">
          <td>${escapeHtml(story.sprint)}</td>
          <td>${escapeHtml(story.jira)}</td>
          <td><code>${escapeHtml(story.endpoint)}</code></td>
          <td>${escapeHtml(scenario.id)}</td>
          <td>${escapeHtml(scenario.title)}</td>
          <td>${done ? "Automatizado" : "Pendente"}</td>
        </tr>`);
    }
  }

  const pending = total - automated;
  const pct = total === 0 ? 0 : Math.round((automated / total) * 100);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(manifest.title)}</title>
  <style>
    :root { font-family: system-ui, sans-serif; color: #1a1a1a; }
    body { margin: 2rem; max-width: 1100px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #555; margin-bottom: 1.5rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
    .card strong { display: block; font-size: 1.75rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { border: 1px solid #e0e0e0; padding: 0.5rem 0.65rem; text-align: left; }
    th { background: #f5f5f5; }
    tr.ok td:last-child { color: #0a7a32; font-weight: 600; }
    tr.pending td:last-child { color: #b45309; font-weight: 600; }
    code { font-size: 0.85em; }
  </style>
</head>
<body>
  <h1>${escapeHtml(manifest.title)}</h1>
  <p class="meta">Gerado em ${escapeHtml(generatedAt)}</p>
  <div class="cards">
    <div class="card"><span>Total backlog</span><strong>${total}</strong></div>
    <div class="card"><span>Automatizados</span><strong>${automated}</strong></div>
    <div class="card"><span>Pendentes</span><strong>${pending}</strong></div>
    <div class="card"><span>Cobertura</span><strong>${pct}%</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Sprint</th>
        <th>Jira</th>
        <th>Endpoint</th>
        <th>Cenário</th>
        <th>Descrição</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows.join("\n")}
    </tbody>
  </table>
</body>
</html>`;

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_PATH, html, "utf8");

  console.log(`[pact:backlog-report] ${automated}/${total} automatizados (${pct}%)`);
  console.log(`[pact:backlog-report] Relatório: ${REPORT_PATH}`);
}

main();
