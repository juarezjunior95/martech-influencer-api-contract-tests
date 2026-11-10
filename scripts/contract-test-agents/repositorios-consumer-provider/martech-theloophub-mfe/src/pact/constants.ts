import path from 'path';

export const PACT_CONSUMER_NAME = 'martech-theloophub-mfe';
export const PACT_PROVIDER_NAME = 'martech-oneway-reports-bff';
export const PACTS_DIR = path.resolve(process.cwd(), 'pacts');
export const PACT_FILE_NAME = `${PACT_CONSUMER_NAME}-${PACT_PROVIDER_NAME}.json`;
