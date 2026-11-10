import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

export class ImagesBrandQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(["table", "square"])
  @Transform(({ value }) =>
    value === undefined || value === "" ? "square" : value,
  )
  format: "table" | "square" = "square";

  @IsOptional()
  @IsString()
  brand_family?: string;
}
