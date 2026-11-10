#!/bin/sh
set -e

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PACT_MOCK_PROVIDER_PORT:-3765}"
BASE_URL="http://127.0.0.1:${PORT}"

tsx scripts/mock-pact-provider-server.ts &
MOCK_PID=$!

cleanup() {
  kill "$MOCK_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

i=0
while [ "$i" -lt 30 ]; do
  if curl -sf "${BASE_URL}/_pact/health" >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 0.2
done

if ! curl -sf "${BASE_URL}/_pact/health" >/dev/null 2>&1; then
  echo "[pact:verify:mock] mock provider não subiu em ${BASE_URL}" >&2
  exit 1
fi

export PACT_MOCK_PROVIDER=true
export PROVIDER_BASE_URL="$BASE_URL"
export PROVIDER_STATES_SETUP_URL="${BASE_URL}/_pact/provider-states"
export PACT_VERIFY_FROM_BROKER=false
export PACT_BROKER_BASE_URL=

exec npm run pact:verify-provider
