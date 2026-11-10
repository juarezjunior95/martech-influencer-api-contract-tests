import { EnsureArrayCommand } from "../../../../../../src/infrastructure/repositories/helpers/commands/EnsureArrayCommand";

describe("EnsureArrayCommand", () => {
  const command = new EnsureArrayCommand();

  it("should return array as-is", () => {
    expect(command.execute([1, 2, 3])).toEqual([1, 2, 3]);
    expect(command.execute([])).toEqual([]);
  });

  it("should wrap non-array values", () => {
    expect(command.execute("hello")).toEqual(["hello"]);
    expect(command.execute(42)).toEqual([42]);
    expect(command.execute({ key: "value" })).toEqual([{ key: "value" }]);
  });

  it("should return empty array for null and undefined", () => {
    expect(command.execute(null)).toEqual([]);
    expect(command.execute(undefined)).toEqual([]);
  });
});
