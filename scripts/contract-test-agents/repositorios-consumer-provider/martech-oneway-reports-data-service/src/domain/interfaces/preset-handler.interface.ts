import {
  Dataset,
  DatasetConfig,
  Filter,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";

/**
 * Handler Interface
 *
 * Handlers are the per-preset extension point. They run after the
 * generic `PresetEntity` pipeline has parsed namespaced overrides,
 * loaded any declared datasets, and expanded `CountryFilterItem`
 * references.
 *
 * Optional `datasets()` lets a handler declare its own data
 * dependencies (e.g. the brand handler returns the
 * `brand-subbrands` Databricks query). The entity merges these into
 * `config.datasets` idempotently before `loadDatasets` runs, so
 * authors of brand-driven presets don't wire SQL by hand.
 *
 * `handle()` receives the resolved preset definition, the loaded
 * datasets, and the (optional) `UserEntity`. Handlers that need
 * country-keyed permission trimming should call the entity's generic
 * `trimByCountryAccess` helper rather than re-implementing the
 * `unrestricted`/`all`/`explicit`/`deny` matrix.
 */
export interface IPresetHandler<
  TPreset extends PresetDefinition = PresetDefinition,
> {
  /**
   * Handles preset processing.
   * @param preset - The resolved preset definition (overrides
   *   already merged, country items already expanded).
   * @param datasets - Loaded datasets, including any the handler
   *   itself declared via `datasets()`.
   * @param user - Optional authenticated user for permission-aware
   *   handlers (e.g. trimming country-keyed maps).
   */
  handle(
    preset: TPreset,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse;

  /**
   * Optional. Declared `DatasetConfig`s are merged into
   * `config.datasets` (deduped by `id`) before `loadDatasets` runs.
   * Idempotent — the entity may call this more than once.
   */
  datasets?(preset: TPreset): DatasetConfig[];

  /**
   * Optional. Static filters injected by the handler before
   * `loadDatasets` runs. Use for values that are NOT supplied by the
   * request (e.g. legacy config-group constants like
   * `kpi_group_time_frame.power`) but still need to reach the SQL via
   * `:named` parameters.
   *
   * Request-supplied filters take precedence over handler-supplied
   * ones (matched by `name`), so callers can still override when
   * needed. Symmetrical to `datasets?()`.
   */
  filters?(preset: TPreset): Filter[];
}
