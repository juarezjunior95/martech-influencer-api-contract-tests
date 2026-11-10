/**
 * Provider verification — replay do contrato contra a API real (UAT/SIT).
 *
 * Uso local (pact em tests/contract/pacts/):
 *   cp .env.example .env   # preencha PROVIDER_TOKEN
 *   npm run pact:verify-provider
 *
 * Uso via Pact Broker (contrato já publicado):
 *   PACT_BROKER_BASE_URL=http://localhost:9292 npm run pact:verify-provider
 *
 * Publicar resultado no Broker após verify:
 *   PUBLISH_VERIFICATION_RESULT=true PROVIDER_VERSION=1.0.0 npm run pact:verify-provider
 */
import type { VerifierOptions } from "@pact-foundation/pact";
import { Verifier } from "@pact-foundation/pact";
import { buildVerifierOptions, loadEnvFile } from "./verify-provider-config";
import { createProviderStateHandlers } from "./provider-state-handlers";

type RequestFilter = (
  req: { headers: Record<string, string | string[] | undefined> },
  _res: unknown,
  next: () => void,
) => void;

const PACT_M2M_READ_TOKEN = "pact-m2m-read-token";
const PACT_M2M_WRITE_TOKEN = "pact-m2m-write-token";
const PACT_WRONG_SCOPE_TOKEN = "pact-wrong-scope-token";
const PACT_ADMIN_TOKEN = "pact-admin-token";
const PACT_SUBMITTER_TOKEN = "pact-submitter-token";

function readAuthorizationHeader(
  headers: Record<string, string | string[] | undefined>,
): string | undefined {
  const value = headers.authorization ?? headers.Authorization;
  if (Array.isArray(value)) return value[0];
  return value;
}

function extractBearerToken(authorization: string): string | undefined {
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function resolveProviderToken(pactStubToken: string): string | undefined {
  if (pactStubToken === PACT_M2M_READ_TOKEN) {
    return (
      process.env.M2M_TOKEN_BRAND_SAFETY_READ ?? process.env.PROVIDER_TOKEN
    );
  }

  if (pactStubToken === PACT_M2M_WRITE_TOKEN) {
    return (
      process.env.M2M_TOKEN_BRAND_SAFETY_WRITE ??
      process.env.M2M_TOKEN_BRAND_SAFETY_READ ??
      process.env.PROVIDER_TOKEN
    );
  }

  if (pactStubToken === PACT_WRONG_SCOPE_TOKEN) {
    return (
      process.env.PROVIDER_TOKEN_WRONG_SCOPE ?? process.env.PROVIDER_TOKEN
    );
  }

  if (pactStubToken === PACT_ADMIN_TOKEN) {
    return process.env.ADMIN_JWT ?? process.env.PROVIDER_TOKEN;
  }

  if (pactStubToken === PACT_SUBMITTER_TOKEN) {
    return process.env.PROVIDER_TOKEN;
  }

  if (pactStubToken === "test-token") {
    return process.env.PROVIDER_TOKEN;
  }

  return process.env.PROVIDER_TOKEN;
}

function createAuthRequestFilter(): RequestFilter {
  return (req, _res, next) => {
    const authorization = readAuthorizationHeader(req.headers);
    if (!authorization) return next();

    const pactStubToken = extractBearerToken(authorization);
    if (!pactStubToken) return next();

    const realToken = resolveProviderToken(pactStubToken);
    if (!realToken) return next();

    req.headers.authorization = `Bearer ${realToken}`;
    delete req.headers.Authorization;
    next();
  };
}

async function main() {
  loadEnvFile();

  if (!process.env.PROVIDER_TOKEN) {
    console.warn(
      "[pact:verify] AVISO: PROVIDER_TOKEN não definido — cenários 200 autenticados podem falhar com 401.",
    );
  }

  if (!process.env.M2M_TOKEN_BRAND_SAFETY_READ) {
    console.warn(
      "[pact:verify] AVISO: M2M_TOKEN_BRAND_SAFETY_READ não definido — brand-safety usará PROVIDER_TOKEN como fallback.",
    );
  }

  if (!process.env.PROVIDER_TOKEN_WRONG_SCOPE) {
    console.warn(
      "[pact:verify] AVISO: PROVIDER_TOKEN_WRONG_SCOPE não definido — cenário de scope errado usará PROVIDER_TOKEN (pode passar indevidamente).",
    );
  }

  if (!process.env.PROVIDER_STATES_SETUP_URL) {
    console.warn(
      "[pact:verify] AVISO: PROVIDER_STATES_SETUP_URL não definido — states rodam como no-op.",
    );
  }

  const verifierOptions = buildVerifierOptions();

  const useMockProvider = process.env.PACT_MOCK_PROVIDER === "true";

  const verifier = new Verifier({
    ...verifierOptions,
    stateHandlers: createProviderStateHandlers(),
    requestFilter: useMockProvider ? undefined : createAuthRequestFilter(),
    validateSSL: useMockProvider
      ? false
      : process.env.PACT_DISABLE_SSL_VERIFICATION !== "true",
  });

  if (useMockProvider) {
    console.log(
      "[pact:verify] PACT_MOCK_PROVIDER=true — JWT stub do pact (sem troca por .env)",
    );
  }

  console.log("[pact:verify] Iniciando provider verification...");
  console.log(`  Provider: ${verifierOptions.provider}`);
  console.log(`  Base URL: ${verifierOptions.providerBaseUrl}`);
  console.log(
    `  Fonte: ${verifierOptions.pactBrokerUrl ? `Broker ${verifierOptions.pactBrokerUrl}` : verifierOptions.pactUrls?.[0]}`,
  );

  const output = await verifier.verifyProvider();
  console.log("\n[pact:verify] Verificação concluída com sucesso.");
  if (output) console.log(output);
}

main().catch((err) => {
  console.error("\n[pact:verify] Falha na verificação do provider:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
