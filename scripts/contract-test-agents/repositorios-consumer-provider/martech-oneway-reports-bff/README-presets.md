# Presets (RFC-003 PoC) — BFF

The BFF preset layer mirrors the view layer: it loads a BFF-side
`PresetConfig`, calls the Data-Service, optionally applies a JSONata
formatter, and caches the result in Redis with a per-user cache key.

See `arch-docs/rfc/RFC-003-develop-filter-with-country-permissions-updated.md`
for the full design; this document covers the BFF side.

## How it flows

```
GET /v1/presets/:name
  └─ PresetController
       └─ CachedProcessPresetUseCase ──► PresetCacheRepository (Redis, user-scoped)
             └─ ProcessPresetUseCase
                  ├─ PresetConfigRepository  (load dist/src/domain/config/presets/…)
                  ├─ PresetRepository ──► GET /v1/presets/:ref (Data-Service)
                  └─ PresetFormatterRepository (optional JSONata)
```

Authorization headers propagate to the Data-Service through the existing
`DataServiceClient` and `HeaderContextInterceptor`, so permission
filtering happens downstream without additional wiring.

## How to add a preset

1. Create a config file under `src/domain/config/presets/<path>.preset.ts`.
2. Point it at a Data-Service preset by name (`preset` field).
3. (Optional) Add a JSONata formatter under
   `src/infrastructure/formatters/presets/<path>.jsonata`.

### Example: `brands.preset.ts`

```ts
import { PresetConfig } from "@domain/entities/preset.entity";

const config: PresetConfig = {
  version: "1.0.0",
  cache: { enabled: true, tags: ["filters"] },
  preset: "brands",
};

export default config;
```

The `formatter` field is optional — omit it when the Data-Service
already returns the shape the FE expects (the `brands` preset emits
the legacy nested response directly). Add a JSONata formatter only
when cosmetic reshaping is required.

### Example: `example.preset.ts` (with JSONata formatter)

The `example` preset shows the formatter pipeline end-to-end. The
data-service returns a static payload:

```jsonc
{ "examples": [
    { "name": "Hello World example - 01", "version": "1.0.0", "health": "bad" },
    { "name": "Hello World example - 02", "version": "1.0.0", "health": "good" }
] }
```

The BFF config wires the formatter:

```ts
const config: PresetConfig = {
  version: "1.0.0",
  cache: { enabled: true, tags: ["filters"] },
  preset: "example",
  formatter: "presets/example", // src/infrastructure/formatters/presets/example.jsonata
};
```

`src/infrastructure/formatters/presets/example.jsonata`:

```jsonata
(
  $rank := function($entry) { $entry.health = "good" ? 0 : 1 };
  $sort($.examples, function($a, $b) { $rank($a) > $rank($b) })
)
```

The expression receives the raw data-service payload as its root, ranks
each entry (`good = 0`, anything else = `1`), and sorts ascending — so
`good` items come first. The result is returned as the BFF response
`data` field, sorted, with the wrapping `examples` key flattened away.

### Per-request overrides

Inbound query strings are parsed into a flat list of
`{ namespace, name, value }` filters and forwarded **verbatim** to the
Data-Service as `?<namespace>[<name>]=<value>`. The Data-Service merges
each namespace's keys into the matching preset config field before
running its handlers, so the BFF is otherwise unaware of which fields
each preset accepts. See the data-service [`README-presets.md`](../martech-oneway-reports-data-service/README-presets.md)
for the full URL key tables.

The cache key includes a hash of the (sorted) filter list, so distinct
override combinations get distinct cached responses.

## Cache key layout

Keys look like:

```
preset:<name>:filters:<md5>:user:<md5>
```

Differences from the view cache:

- **`user:` segment is always included** when a user is resolvable.
  Country filtering happens in the Data-Service using the caller's JWT,
  so two users with different `supportedCountries` must never see the
  same cached payload.
- Only the filters part gets hashed if no user is available (e.g. PoC
  without JWT).

## Running the PoC

```bash
npm install
npm run start:dev

# Enable preset caching (defaults to off):
export PRESET_CACHE_ENABLED=true

curl -H "Authorization: Bearer <JWT>" \
  "http://localhost:4000/v1/presets/brands"

# Per-request overrides use the legacy Drupal namespaced shape:
#   ?<filter>[<key>]=<value>
curl "http://localhost:4000/v1/presets/years?years[no_default]=true"
curl "http://localhost:4000/v1/presets/brands?brand[include_global]=false&brand[countries]=BRA,ARG&brand[flatten]=true"

# Demo preset with JSONata sort (good health first):
curl "http://localhost:4000/v1/presets/example"
```

Environment variables:

| Var                     | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `DATA_SERVICE_BASE_URL` | Data-Service URL (existing)                           |
| `PRESET_CACHE_ENABLED`  | Master switch for preset Redis cache (default `false`) |

## File map

```
src/domain/
├── config/presets/
│   ├── brands.preset.ts
│   ├── years.preset.ts
│   └── example.preset.ts                # demo preset (uses presets/example.jsonata)
├── entities/preset.entity.ts
├── exceptions/{preset-not-found,invalid-preset-config}.error.ts
└── repositories/
    ├── preset.repository.interface.ts
    ├── preset-config.repository.interface.ts
    ├── preset-cache.repository.interface.ts
    └── preset-formatter.repository.interface.ts

src/application/
├── interfaces/process-preset.usecase.interface.ts
└── usecases/
    ├── process-preset.usecase.ts
    └── cached-process-preset.usecase.ts

src/infrastructure/
├── controllers/preset.controller.ts
├── controllers/dto/preset-filter.dto.ts
├── formatters/presets/
│   └── example.jsonata                  # demo JSONata sort
├── mappers/preset-filter-dto.mapper.ts
├── modules/preset.module.ts
└── repositories/
    ├── preset-config.repository.ts
    ├── preset.repository.ts
    ├── preset-cache.repository.ts
    └── preset-formatter.repository.ts
```
