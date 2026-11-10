export class SafeNumberCommand {
  public readonly name = "safeNumber";

  execute(value: number | string | null | undefined): number {
    const num =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : NaN;
    return !isNaN(num) ? num : 0;
  }
}
