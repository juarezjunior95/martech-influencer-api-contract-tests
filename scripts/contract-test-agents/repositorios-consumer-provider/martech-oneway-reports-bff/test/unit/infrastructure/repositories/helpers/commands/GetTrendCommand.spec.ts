import { GetTrendCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/GetTrendCommand";

describe("GetTrendCommand", () => {
  const command = new GetTrendCommand();

  it("should return positive when value is null, undefined or zero", () => {
    expect(command.execute(null, "up")).toBe("positive");
    expect(command.execute(null, "down")).toBe("positive");
    expect(command.execute(undefined, "up")).toBe("positive");
    expect(command.execute(0, "down")).toBe("positive");
    expect(command.execute(0, "up")).toBe("positive");
  });

  it("should return positive when direction is up and value is non-zero", () => {
    expect(command.execute(5.2, "up")).toBe("positive");
    expect(command.execute(-3.1, "up")).toBe("positive");
  });

  it("should return negative when direction is not up and value is non-zero", () => {
    expect(command.execute(5.2, "down")).toBe("negative");
    expect(command.execute(-3.1, "down")).toBe("negative");
    expect(command.execute(1, "")).toBe("negative");
    expect(command.execute(1, null)).toBe("negative");
  });

  it("should treat direction case-insensitively", () => {
    expect(command.execute(1, "UP")).toBe("positive");
    expect(command.execute(1, "Up")).toBe("positive");
    expect(command.execute(1, "DOWN")).toBe("negative");
  });
});
