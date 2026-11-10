import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

export class ImagesCountryQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(["icon", "waving"])
  @Transform(({ value }) =>
    value === undefined || value === "" ? "icon" : value,
  )
  format: "icon" | "waving" = "icon";
}
