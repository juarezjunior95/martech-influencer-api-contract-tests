export class ToNumberOrUndefinedCommand {
  public readonly name = "toNumberOrUndefined";

  private static readonly NUMERIC_REGEX = /^[-+]?[0-9]*[.]?[0-9]+$/;

  execute(value: unknown): number | undefined {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string") {
      const normalized = value.trim().replace(",", ".");
      if (!ToNumberOrUndefinedCommand.NUMERIC_REGEX.test(normalized)) {
        return undefined;
      }
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }
}
