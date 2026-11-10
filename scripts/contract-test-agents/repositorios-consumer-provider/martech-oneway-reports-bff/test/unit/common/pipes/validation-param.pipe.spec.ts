import { ValidacaoParametrosPipe } from "@common/pipes/validation-param.pipe";
import { ArgumentMetadata, BadRequestException } from "@nestjs/common";

describe("ValidacaoParametrosPipe", () => {
  const pipe = new ValidacaoParametrosPipe();

  it("should throw BadRequestException when value is falsy", () => {
    const meta: ArgumentMetadata = {
      type: "param",
      metatype: undefined,
      data: "id",
    };
    expect(() => pipe.transform(null, meta)).toThrow(BadRequestException);
  });

  it("should return value when present", () => {
    const meta: ArgumentMetadata = {
      type: "param",
      metatype: undefined,
      data: "id",
    };
    const out = pipe.transform("value", meta);
    expect(out).toBe("value");
  });
});
