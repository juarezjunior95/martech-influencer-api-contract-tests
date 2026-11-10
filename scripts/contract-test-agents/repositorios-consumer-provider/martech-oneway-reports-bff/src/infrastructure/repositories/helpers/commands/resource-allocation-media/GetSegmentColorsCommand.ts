export class GetSegmentColorsCommand {
  public readonly name = "getSegmentColors";

  private static readonly SEGMENT_COLORS: Record<string, string> = {
    Megabrands: "#E5B611",
    Expansion: "#C2346A",
    Sustain: "#2F74AA",
    Tail: "#4E579F",
  };

  execute(): Record<string, string> {
    return { ...GetSegmentColorsCommand.SEGMENT_COLORS };
  }
}
