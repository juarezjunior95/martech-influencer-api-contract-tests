import { GetSegmentColorsCommand } from "../../../../../../../src/infrastructure/repositories/helpers/commands/resource-allocation-media/GetSegmentColorsCommand";

describe("GetSegmentColorsCommand", () => {
  const command = new GetSegmentColorsCommand();

  it("should return segment colors for all segments", () => {
    const result = command.execute();

    expect(result.Megabrands).toBe("#E5B611");
    expect(result.Expansion).toBe("#C2346A");
    expect(result.Sustain).toBe("#2F74AA");
    expect(result.Tail).toBe("#4E579F");
  });

  it("should return 4 segment entries", () => {
    expect(Object.keys(command.execute())).toHaveLength(4);
  });

  it("should return a new object on each call", () => {
    const first = command.execute();
    const second = command.execute();
    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });
});
