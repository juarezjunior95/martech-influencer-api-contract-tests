#!/usr/bin/env sh
# Publica pacts/ no Broker local (rode após npm test com o Broker no ar: docker compose up -d)
set -eu

BROKER_URL="${PACT_BROKER_BASE_URL:-http://localhost:9292}"
BROKER_USER="${PACT_BROKER_USERNAME:-pact}"
BROKER_PASS="${PACT_BROKER_PASSWORD:-pact}"
VERSION="${PACT_CONSUMER_VERSION:-local-$(date +%Y%m%d-%H%M%S)}"
BRANCH="${PACT_BRANCH:-main}"
PACTS_DIR="${PACTS_DIR:-./tests/contract/pacts}"

if [ ! -d "$PACTS_DIR" ] || [ -z "$(ls -A "$PACTS_DIR"/*.json 2>/dev/null)" ]; then
  echo "Nenhum pact em $PACTS_DIR. Rode antes: npm run test:pact:consumer"
  exit 1
fi

# pact-cli roda em container: localhost aponta para o container, não para o host
DOCKER_BROKER_URL="$BROKER_URL"
case "$DOCKER_BROKER_URL" in
  *localhost*) DOCKER_BROKER_URL=$(echo "$DOCKER_BROKER_URL" | sed 's/localhost/host.docker.internal/g') ;;
esac

TAG="${PACT_CONSUMER_TAG:-}"
echo "Publicando contratos em $BROKER_URL (versão: $VERSION, branch: $BRANCH${TAG:+, tag: $TAG})..."

TAG_ARGS=""
if [ -n "$TAG" ]; then
  TAG_ARGS="--tag=$TAG"
fi

docker run --rm \
  -v "$(cd "$PACTS_DIR" && pwd):/pacts:ro" \
  --add-host=host.docker.internal:host-gateway \
  pactfoundation/pact-cli:latest \
  pact-broker publish /pacts \
  --broker-base-url="$DOCKER_BROKER_URL" \
  --broker-username="$BROKER_USER" \
  --broker-password="$BROKER_PASS" \
  --consumer-app-version="$VERSION" \
  --branch="$BRANCH" \
  $TAG_ARGS

echo ""
echo "Abra o Pact Broker: ${BROKER_URL%/}"
