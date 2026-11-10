import { PactV3 } from '@pact-foundation/pact';

import { PACT_CONSUMER_NAME, PACT_PROVIDER_NAME, PACTS_DIR } from './constants';

export function createPact(): PactV3 {
  return new PactV3({
    consumer: PACT_CONSUMER_NAME,
    provider: PACT_PROVIDER_NAME,
    dir: PACTS_DIR,
    logLevel: 'warn',
  });
}
