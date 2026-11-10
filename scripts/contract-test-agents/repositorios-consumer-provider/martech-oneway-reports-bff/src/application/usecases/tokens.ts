/**
 * Dependency-injection tokens for the preset use-case decorator stack.
 *
 * Both classes implement the same `IProcessPresetUseCase` interface, so a
 * compile-time `Symbol` token avoids the silent typo risk inherent to
 * string-based tokens (e.g. `@Inject("ICachedProcessPresetUseCase")`).
 */
export const PROCESS_PRESET_USE_CASE = Symbol("IProcessPresetUseCase");
export const CACHED_PROCESS_PRESET_USE_CASE = Symbol(
  "ICachedProcessPresetUseCase",
);
