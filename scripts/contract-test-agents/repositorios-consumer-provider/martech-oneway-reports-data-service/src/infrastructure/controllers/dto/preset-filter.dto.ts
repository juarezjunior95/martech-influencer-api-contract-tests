/**
 * DTO for preset query filters (legacy Drupal namespacing).
 *
 * Accepts the legacy outer-key shape:
 *   `?<namespace>[<name>]=<value>&<namespace>[<name>]=<value>...`
 *
 * Examples:
 *   - `?years[no_default]=true`
 *   - `?brand[include_global]=false&brand[countries]=BRA,ARG`
 *
 * Express v5 `extended` query parser (configured in `main.ts`) parses
 * this directly into nested objects, so the DTO is a passthrough
 * container indexed by namespace. Validation is intentionally loose:
 * each preset's handler decides which namespaces and keys it accepts.
 */
export class PresetFilterDto {
  [namespace: string]:
    | Record<string, string | number | boolean>
    | string
    | undefined;
}
