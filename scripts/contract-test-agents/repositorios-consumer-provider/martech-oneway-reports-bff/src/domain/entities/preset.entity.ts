import { CacheConfig } from "@domain/entities/view.entity";
import { PresetNotFoundError } from "@domain/exceptions/preset-not-found.error";
import { InvalidPresetConfigError } from "@domain/exceptions/invalid-preset-config.error";

/**
 * Authoring-side BFF preset config (RFC §4.5).
 *
 * Unlike views, a BFF preset does not compose multiple components: it
 * points at a single Data-Service preset name and optionally applies a
 * JSONata formatter. Cache configuration mirrors ViewConfig for
 * consistency with the existing view pipeline.
 */
export interface PresetConfig {
  version: string;
  cache?: CacheConfig;
  /**
   * Data-Service preset reference. Three shapes are accepted:
   *
   *  - `string` — single preset name (e.g. `"brands"`).
   *  - `string[]` — multiple preset names fetched in parallel and
   *    combined into an object indexed by preset name. The same query
   *    filters are forwarded to each ref.
   *  - `Record<refName, PresetRefConfig>` — multiple preset names with
   *    **per-ref** fixed filters and/or an optional JSONata formatter
   *    for that ref’s branch only. Filters are merged with query
   *    filters; query wins on `(namespace, name)` collision.
   */
  preset: string | string[] | Record<string, PresetRefConfig>;
  /**
   * Optional JSONata formatter path rooted at
   * `src/infrastructure/formatters/`.
   */
  formatter?: string;
}

/**
 * Per-ref configuration for the object form of `PresetConfig.preset`.
 * `filters` are baked into the config and forwarded to the Data-Service
 * call for that specific ref only. The `namespace` of each fixed filter
 * is implicit — it always equals the ref key in the parent
 * `PresetConfig.preset` map and is injected at resolution time by
 * {@link Preset.getFiltersFor}. Authors therefore declare only
 * `{ name, value }` here.
 *
 * `formatter` runs on `{ [refName]: branchPayload }` after merge so
 * JSONata that expects a single top-level key (e.g. name normalization)
 * matches the standalone preset shape without touching sibling refs.
 */
export interface PresetRefConfig {
  filters?: FixedPresetFilter[];
  formatter?: string;
}

/**
 * Authoring-side filter for {@link PresetRefConfig.filters}. The
 * namespace is omitted because it is always the parent ref key.
 */
export type FixedPresetFilter = Omit<PresetFilter, "namespace">;

/**
 * Represents a single filter with name and value for presets.
 *
 * `namespace` mirrors the outer key in the legacy Drupal query shape
 * (`<namespace>[<name>]=<value>`). It defaults to `"filter"` when
 * absent so existing callers that emit the camelCase `?filter[...]`
 * shape keep working. Request-scoped filters (parsed from the query
 * string) carry their own namespace; fixed filters declared in
 * `PresetRefConfig` inherit it from the parent ref key.
 */
export interface PresetFilter {
  namespace?: string;
  name: string;
  value: string | number | boolean;
}

export interface PresetProps {
  name: string;
  config: PresetConfig;
  filters?: PresetFilter[];
}

/**
 * Raw Data-Service preset payload. The BFF treats this as opaque JSON and
 * only applies a JSONata transform when a formatter is configured.
 */
export type PresetData = Record<string, unknown>;

/**
 * The user-facing processed response.
 */
export interface ProcessedPresetResult {
  name: string;
  data: PresetData;
}

export class Preset {
  private readonly name: string;
  private readonly config: PresetConfig;
  private readonly filters: PresetFilter[];

  private constructor(props: PresetProps) {
    this.validateConfig(props.config);
    this.name = props.name;
    this.config = props.config;
    this.filters = props.filters ?? [];
  }

  static create(props: PresetProps): Preset {
    return new Preset(props);
  }

  getName(): string {
    return this.name;
  }

  getPresetRefs(): string[] {
    const ref = this.config.preset;
    if (typeof ref === "string") {
      return [ref];
    }
    if (Array.isArray(ref)) {
      return [...ref];
    }
    return Object.keys(ref);
  }

  /**
   * Resolve the effective filter list for a specific ref.
   *
   *   - `string` / `string[]` form: returns the full request-scoped
   *     filter list (current behaviour).
   *   - Object form: merges the ref's fixed filters with the
   *     request-scoped filters. Request filters override fixed ones
   *     when they share the same `(namespace, name)` pair.
   */
  getFiltersFor(ref: string): PresetFilter[] {
    const cfg = this.config.preset;
    if (typeof cfg === "string" || Array.isArray(cfg)) {
      return this.filters;
    }

    const fixedRaw = cfg[ref]?.filters ?? [];
    if (fixedRaw.length === 0) {
      return this.filters;
    }

    // Fixed filters inherit their namespace from the ref key.
    const fixed: PresetFilter[] = fixedRaw.map((f) => ({
      namespace: ref,
      name: f.name,
      value: f.value,
    }));

    const keyOf = (f: PresetFilter): string =>
      `${f.namespace ?? "filter"}::${f.name}`;
    const overridden = new Set(this.filters.map(keyOf));
    const fixedKept = fixed.filter((f) => !overridden.has(keyOf(f)));
    return [...fixedKept, ...this.filters];
  }

  getFormatter(): string | undefined {
    return this.config.formatter;
  }

  /**
   * JSONata path for a single ref when `preset` is the object/Record form.
   * Undefined for string or string[] presets, or when the ref omits `formatter`.
   */
  getRefFormatter(ref: string): string | undefined {
    const cfg = this.config.preset;
    if (typeof cfg === "string" || Array.isArray(cfg)) {
      return undefined;
    }
    return cfg[ref]?.formatter;
  }

  getFilters(): PresetFilter[] {
    return this.filters;
  }

  getSortedFilters(): PresetFilter[] {
    return [...this.filters].sort((a, b) => {
      const nsA = (a.namespace || "filter").toLowerCase();
      const nsB = (b.namespace || "filter").toLowerCase();
      if (nsA !== nsB) {
        return nsA < nsB ? -1 : 1;
      }
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  }

  getCacheConfig(): CacheConfig {
    if (!this.config.cache) {
      return { enabled: true, tags: [] };
    }
    return {
      enabled: this.config.cache.enabled ?? true,
      tags: this.config.cache.tags ?? [],
    };
  }

  private validateConfig(config: PresetConfig): void {
    if (!config) {
      throw new PresetNotFoundError();
    }
    if (!config.version) {
      throw new InvalidPresetConfigError(
        "Preset configuration version is required",
      );
    }
    const ref = config.preset;
    const isValidRef = (() => {
      if (ref && typeof ref === "object") {
        const keys = Object.keys(ref);
        return keys.length > 0 && keys.every((k) => k.length > 0);
      }
      return false;
    })();
    if (!isValidRef) {
      throw new InvalidPresetConfigError(
        "Preset configuration must have a `preset` reference (string, non-empty string[], or non-empty Record<string, PresetRefConfig>)",
      );
    }
  }
}
