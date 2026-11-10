import path from "node:path";
import { Pact } from "@pact-foundation/pact";

export const PROVIDER = "martech-connect-influencer-service";
export const CONSUMER = "connect-influencer-web";

export const PACTS_DIR = path.resolve(process.cwd(), "tests/contract/pacts");

export function createPact(_logSuffix: string) {
  return new Pact({
    consumer: CONSUMER,
    provider: PROVIDER,
    dir: PACTS_DIR,
    logLevel: "warn",
  });
}
