/**
 * Static configuration group — port of the legacy Drupal "config bag"
 * concept (e.g. `kpi_group_time_frame`).
 *
 * A config group is a single TS file under `src/domain/config/config-groups/`
 * that exports a `{ name, config }` object as its default export. Presets
 * import it directly to seed values (year bounds, default segments, ...);
 * there is no runtime registry or string lookup.
 *
 * Naming convention:
 *   - `name` mirrors the legacy Drupal group name verbatim (snake_case).
 *   - Sub-keys inside `config` also keep their legacy snake_case for
 *     parity with the Drupal source (`cat_health_start_year`, ...).
 */
export interface ConfigGroup<TConfig extends object> {
  name: string;
  config: TConfig;
}
