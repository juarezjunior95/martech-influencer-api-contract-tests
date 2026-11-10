import path from "node:path";
import { readFileSync, existsSync } from "node:fs";
import type { VerifierOptions } from "@pact-foundation/pact";

export const PROVIDER_NAME = "martech-connect-influencer-service";
export const CONSUMER_NAME = "connect-influencer-web";

export const DEFAULT_PACT_FILE = path.resolve(
  process.cwd(),
  "tests/contract/pacts/connect-influencer-web-martech-connect-influencer-service.json",
);

export const DEFAULT_PROVIDER_BASE_URL =
  "https://services.martech.uat.mybees-platform.dev/api/martech-connect-influencer-service";

/** Carrega variáveis de um arquivo .env simples (sem dependência extra). */
export function loadEnvFile(envPath = path.resolve(process.cwd(), ".env")): void {
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function buildVerifierOptions(): VerifierOptions {
  const providerBaseUrl = (
    process.env.PROVIDER_BASE_URL ?? DEFAULT_PROVIDER_BASE_URL
  ).replace(/\/$/, "");

  const useMockProvider = process.env.PACT_MOCK_PROVIDER === "true";
  const brokerUrl = useMockProvider
    ? undefined
    : process.env.PACT_BROKER_BASE_URL?.replace(/\/$/, "");
  const verifyFromBroker =
    !useMockProvider && process.env.PACT_VERIFY_FROM_BROKER === "true";

  const pactFile = process.env.PACT_FILE ?? DEFAULT_PACT_FILE;
  if (!verifyFromBroker && !existsSync(pactFile)) {
    throw new Error(
      `Pact não encontrado em ${pactFile}. Rode antes: npm run test:pact:consumer`,
    );
  }

  const options: VerifierOptions = {
    provider: PROVIDER_NAME,
    providerBaseUrl,
    logLevel: (process.env.PACT_LOG_LEVEL as VerifierOptions["logLevel"]) ?? "info",
    timeout: Number(process.env.PACT_VERIFY_TIMEOUT_MS ?? 30_000),
    disableSslVerification: process.env.PACT_DISABLE_SSL_VERIFICATION === "true",
    failIfNoPactsFound: true,
  };

  if (process.env.PROVIDER_STATES_SETUP_URL) {
    options.providerStatesSetupUrl = process.env.PROVIDER_STATES_SETUP_URL;
    options.providerStatesSetupBody = true;
  }

  if (process.env.PUBLISH_VERIFICATION_RESULT === "true") {
    options.publishVerificationResult = true;
    options.providerVersion =
      process.env.PROVIDER_VERSION ?? `local-${new Date().toISOString().slice(0, 10)}`;
    if (process.env.CI_BUILD_URL) {
      options.buildUrl = process.env.CI_BUILD_URL;
    }
  }

  if (brokerUrl) {
    options.pactBrokerUrl = brokerUrl;
    const token = process.env.PACT_BROKER_TOKEN;
    const username = process.env.PACT_BROKER_USERNAME;
    const password = process.env.PACT_BROKER_PASSWORD;

    if (token) {
      options.pactBrokerToken = token;
    } else if (username && password) {
      options.pactBrokerUsername = username;
      options.pactBrokerPassword = password;
    }
  }

  if (verifyFromBroker && brokerUrl) {
    const tag = process.env.PACT_CONSUMER_TAG?.trim();
    options.consumerVersionSelectors = tag
      ? [{ consumer: CONSUMER_NAME, tag }]
      : [{ consumer: CONSUMER_NAME, latest: true }];
  } else {
    options.pactUrls = [pactFile];
  }

  return options;
}
