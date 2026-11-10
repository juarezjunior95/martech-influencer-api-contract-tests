const PERFORMANCE_COLORS: Record<string, string> = {
  positive: "#007800",
  negative: "#A20A0A",
};

const FALLBACK_COLOR = "#5C5C5C";

export class GetPerformanceColorCommand {
  public readonly name = "getPerformanceColor";

  execute(performance: string | null | undefined): string {
    if (!performance) return FALLBACK_COLOR;
    return PERFORMANCE_COLORS[performance] ?? FALLBACK_COLOR;
  }
}
