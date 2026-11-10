import { FormatPeriodChipCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/FormatPeriodChipCommand";

describe("FormatPeriodChipCommand", () => {
  const command = new FormatPeriodChipCommand();

  it("uses a range plus suffix for YTD and L3M monthly chips", () => {
    expect(
      command.execute(
        "2026-01-01T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
        "YTD",
      ),
    ).toBe("Jan-Mar'26 YTD");
    expect(
      command.execute(
        "2026-01-01T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
        "L3M",
      ),
    ).toBe("Jan-Mar'26 L3M");
  });

  it("uses a single month plus suffix for MTD", () => {
    expect(
      command.execute(
        "2026-03-01T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
        "MTD",
      ),
    ).toBe("Mar'26 MTD");
  });

  it("uses quarter labels for Brand Power chips", () => {
    expect(
      command.execute(
        "2026-01-01T00:00:00.000Z",
        "2026-03-31T00:00:00.000Z",
        "LQ",
        true,
      ),
    ).toBe("Q1'26 LQ");
  });
});
