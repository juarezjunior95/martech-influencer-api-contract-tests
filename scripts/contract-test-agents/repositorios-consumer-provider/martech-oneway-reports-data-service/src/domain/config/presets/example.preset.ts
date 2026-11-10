import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * Demo preset — closes out the RFC-003 PoC.
 *
 * It returns a static array of two "Hello World" entries to demonstrate:
 *   1. The flat-file layout (no folder, no handler, no types) for trivial
 *      presets (the folder layout in `brands/` / `years/` is reserved for
 *      filters that need their own handler/types/defaults).
 *   2. JSONata formatting on the BFF side: the BFF preset for the same
 *      name applies a sort-by-health JSONata so the FE always sees the
 *      "good" entry first.
 *
 * Endpoint (data-service): `GET /v1/presets/example`.
 *
 * The response is wrapped in an `examples` key because every data-service
 * preset response is a flat keyed object (`PresetResponse`). The BFF
 * formatter reads `$.examples` and unwraps it to a top-level array.
 */
const examplePreset = {
  examples: [
    {
      name: "Hello World example - 01",
      version: "1.0.0",
      health: "bad",
    },
    {
      name: "Hello World example - 02",
      version: "1.0.0",
      health: "good",
    },
  ],
};

const config: PresetConfig<typeof examplePreset> = {
  version: "1.0.0",
  preset: examplePreset,
};

export default config;
