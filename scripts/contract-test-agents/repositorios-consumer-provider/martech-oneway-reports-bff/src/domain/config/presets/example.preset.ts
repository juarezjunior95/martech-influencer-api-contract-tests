import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * Demo preset — closes out the RFC-003 PoC.
 *
 * Forwards to the data-service `example` preset (a static
 * `{ examples: [...] }` payload) and runs a small JSONata transform
 * that sorts the entries so `health: "good"` always shows up first.
 * The formatter is just for demonstration; production presets should
 * only use JSONata when cosmetic reshaping is genuinely needed
 * (heavier transforms belong in the data-service handler).
 *
 * Endpoint: `GET /v1/presets/example`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    example: {
      filters: [],
    },
  },
  formatter: "presets/example",
};

export default config;
