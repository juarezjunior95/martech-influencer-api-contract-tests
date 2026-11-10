import { PresetConfig } from "@domain/entities/preset.entity";
import { zonesHandler } from "@domain/config/presets/zones/zones.handler";
import { ZonesFilterItem } from "@domain/config/presets/zones/zones.types";

/**
 * `zone` preset — exposes the central `zonesRegistry` as a flat list
 * of selectable zones for client-side filters.
 *
 * Endpoint: `GET /v1/presets/zone`.
 *
 * The handler builds a `{ values: [...] }` payload entirely from the
 * registry; no Databricks dataset is declared. Page-level overrides
 * are wired through the entity's generic `?ns[name]=value` pipeline:
 *
 *   - `?zone[scope]=AFR,EUR`         restrict to specific zones (no ABI).
 *   - `?zone[scope]=ABI,AFR,EUR`     include the synthetic Global row.
 *
 * Permission trimming uses the user's JWT zone scopes; users in
 * `deny` mode get an empty list.
 */
const zones: ZonesFilterItem = {
  type: "zones",
};

const zonesPreset = { zones };

const config: PresetConfig<typeof zonesPreset> = {
  version: "1.0.0",
  handler: zonesHandler,
  preset: zonesPreset,
};

export default config;
