export class EnsureArrayCommand {
  public readonly name = "ensureArray";

  execute(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  }
}
