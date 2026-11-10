/**
 * Extrai uma interação do pact consolidado para verificação/publicação isolada.
 *
 * Uso:
 *   npx tsx scripts/extract-pact-interaction.ts "partnerBreakdown=byStage" \
 *     tests/contract/pacts/out/connect-influencer-web-martech-connect-influencer-service.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const descriptionIncludes = process.argv[2];
const outFile = process.argv[3];

if (!descriptionIncludes || !outFile) {
  console.error(
    "Uso: tsx scripts/extract-pact-interaction.ts <trecho-da-description> <arquivo-saida.json>",
  );
  process.exit(1);
}

const source = path.resolve(
  process.cwd(),
  "tests/contract/pacts/connect-influencer-web-martech-connect-influencer-service.json",
);

type PactDoc = {
  consumer: { name: string };
  provider: { name: string };
  interactions: Array<{ description: string }>;
  metadata?: Record<string, unknown>;
};

const pact = JSON.parse(readFileSync(source, "utf8")) as PactDoc;
const interaction = pact.interactions.find((i) =>
  i.description.includes(descriptionIncludes),
);

if (!interaction) {
  console.error(
    `Nenhuma interação contendo "${descriptionIncludes}" em ${source}`,
  );
  process.exit(1);
}

const slice: PactDoc = {
  consumer: pact.consumer,
  provider: pact.provider,
  interactions: [interaction],
  metadata: pact.metadata,
};

mkdirSync(path.dirname(path.resolve(process.cwd(), outFile)), { recursive: true });
writeFileSync(path.resolve(process.cwd(), outFile), `${JSON.stringify(slice, null, 2)}\n`);
console.log(`[extract-pact] 1 interação → ${outFile}`);
console.log(`[extract-pact] ${interaction.description}`);
