import { validate } from "class-validator";
import { ViewParamsDto } from "@infrastructure/controllers/dto/view.dto";

describe("ViewParamsDto", () => {
  it("valid dto passes validation", async () => {
    const dto = new ViewParamsDto();
    dto.view = "home";

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("missing view fails validation", async () => {
    const dto = new ViewParamsDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const err = errors.find((e) => e.property === "view");
    expect(err).toBeDefined();
    expect(err!.constraints).toBeDefined();
    expect(Object.keys(err!.constraints!).length).toBeGreaterThan(0);
  });

  it("empty view fails IsNotEmpty validation", async () => {
    const dto = new ViewParamsDto();
    dto.view = "";

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const err = errors.find((e) => e.property === "view");
    expect(err).toBeDefined();
    expect(err!.constraints).toHaveProperty("isNotEmpty");
  });

  it("non-string view fails IsString validation", async () => {
    const dto = new ViewParamsDto();
    (dto as any).view = 123;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const err = errors.find((e) => e.property === "view");
    expect(err).toBeDefined();
    expect(err!.constraints).toHaveProperty("isString");
  });
});
