import { UnprocessableEntityException } from "@nestjs/common";
import { InvalidViewConfigError } from "@domain/exceptions/invalid-view-config.error";
import { HttpException } from "@nestjs/common";

describe("InvalidViewConfigError", () => {
  it("should extend UnprocessableEntityException and set name/message/status", () => {
    const message = "Invalid config: missing components";
    const err = new InvalidViewConfigError(message);

    expect(err).toBeInstanceOf(InvalidViewConfigError);
    expect(err).toBeInstanceOf(UnprocessableEntityException);
    expect(err).toBeInstanceOf(Error);

    // name override in constructor
    expect(err.name).toBe("InvalidViewConfigError");

    // message preserved
    expect(err.message).toContain(message);

    // UnprocessableEntityException exposes status via getStatus()  - 422 is Unprocessable Entity
    expect((err as HttpException).getStatus()).toBe(422);
  });

  it("should have a stack and string representation includes the name", () => {
    const err = new InvalidViewConfigError("another message");
    expect(typeof err.stack).toBe("string");
    const str = err.toString();
    expect(str).toContain("InvalidViewConfigError");
  });
});
