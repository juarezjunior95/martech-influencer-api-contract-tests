#!/usr/bin/env sh
# Consumer T2720 isolado → pact com 1 interação → publish no Broker → verify UAT → publica resultado.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PACT_SLICE_DIR="tests/contract/pacts/t2720-only"
PACT_SLICE_FILE="${PACT_SLICE_DIR}/connect-influencer-web-martech-connect-influencer-service.json"
CONSUMER_VERSION="${PACT_CONSUMER_VERSION:-t2720-$(date +%Y%m%d-%H%M%S)}"
CONSUMER_TAG="${PACT_CONSUMER_TAG:-t2720-isolated}"
PROVIDER_VERSION="${PROVIDER_VERSION:-t2720-verify-$(date +%Y%m%d-%H%M%S)}"
BROKER_URL="${PACT_BROKER_BASE_URL:-http://localhost:9292}"

echo "==> 1/4 Consumer: somente MARTGNM-T2720"
npx vitest run tests/contract/consumer/submitter.campaigns.pact.spec.ts -t "T2720"

echo "==> 2/4 Extrair interação partnerBreakdown=byStage"
npx tsx scripts/extract-pact-interaction.ts \
  "partnerBreakdown=byStage" \
  "$PACT_SLICE_FILE"

echo "==> 3/4 Publicar pact (1 interação) no Broker — versão ${CONSUMER_VERSION}"
PACTS_DIR="./${PACT_SLICE_DIR}" \
  PACT_CONSUMER_VERSION="$CONSUMER_VERSION" \
  PACT_CONSUMER_TAG="$CONSUMER_TAG" \
  PACT_BRANCH="${PACT_BRANCH:-main}" \
  PACT_BROKER_BASE_URL="$BROKER_URL" \
  npm run pact:publish

echo "==> 4/4 Provider verify UAT (tag ${CONSUMER_TAG}) + publicar resultado no Broker"
PACT_VERIFY_FROM_BROKER=true \
  PACT_CONSUMER_TAG="$CONSUMER_TAG" \
  PACT_BROKER_BASE_URL="$BROKER_URL" \
  PUBLISH_VERIFICATION_RESULT=true \
  PROVIDER_VERSION="$PROVIDER_VERSION" \
  npm run pact:verify-provider

echo ""
echo "Concluído."
echo "  Consumer version: ${CONSUMER_VERSION}"
echo "  Provider version (verify): ${PROVIDER_VERSION}"
echo "  Broker: ${BROKER_URL%/}"
