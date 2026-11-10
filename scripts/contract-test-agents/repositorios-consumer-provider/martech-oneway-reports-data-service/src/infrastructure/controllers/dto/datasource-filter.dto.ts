import { IsOptional, IsObject } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for dynamic datasource filters with single level
 * Captures query parameters like filter[xxx]
 * Supports patterns like:
 * - filter[country]=BRA
 * - filter[brand]=Corona
 */
export class DataSourceFilterDto {
  @ApiPropertyOptional({
    description: "Dynamic datasource filter object with single level keys",
    example: {
      country: "BRA",
      brand: "Corona",
    },
  })
  @IsOptional()
  @IsObject()
  filter?: {
    [key: string]: string | number | boolean;
  };
}
