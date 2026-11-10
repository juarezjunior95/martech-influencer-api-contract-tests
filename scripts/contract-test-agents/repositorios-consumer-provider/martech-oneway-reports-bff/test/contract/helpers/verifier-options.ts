import fs from "fs";
import path from "path";

import { PACT_FILE_NAME } from "../constants";

export function resolveLocalPactPath(): string {
  if (process.env.PACT_LOCAL_PACT_FILE) {
    return path.resolve(process.env.PACT_LOCAL_PACT_FILE);
  }

  const siblingRepoPath = path.resolve(
    __dirname,
    "../../../../martech-theloophub-mfe/pacts",
    PACT_FILE_NAME,
  );

  if (fs.existsSync(siblingRepoPath)) {
    return siblingRepoPath;
  }

  throw new Error(
    `Pact file not found. Set PACT_LOCAL_PACT_FILE or run consumer tests in martech-theloophub-mfe first. Tried: ${siblingRepoPath}`,
  );
}

export function buildVerifierOptions(port: number) {
  const brokerUrl = process.env.PACT_BROKER_BASE_URL;

  return {
    provider: "martech-oneway-reports-bff",
    providerBaseUrl: `http://127.0.0.1:${port}`,

    ...(brokerUrl
      ? {
          pactBrokerUrl: brokerUrl,
          pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
          pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
          consumerVersionSelectors: [
            { branch: "main" },
            { branch: "develop" },
            { branch: process.env.PACT_PROVIDER_BRANCH || "local" },
            { tag: process.env.PACT_PROVIDER_TAG || "local" },
            { deployed: true },
          ],
        }
      : { pactUrls: [resolveLocalPactPath()] }),

    publishVerificationResult:
      process.env.CI === "true" || process.env.PACT_PUBLISH_RESULTS === "true",

    providerVersion:
      process.env.PACT_PROVIDER_VERSION || process.env.GIT_SHA || "local-dev",

    providerVersionBranch:
      process.env.PACT_PROVIDER_BRANCH || process.env.GIT_BRANCH || "local",

    logLevel: "warn" as const,
    timeout: 60_000,
  };
}
