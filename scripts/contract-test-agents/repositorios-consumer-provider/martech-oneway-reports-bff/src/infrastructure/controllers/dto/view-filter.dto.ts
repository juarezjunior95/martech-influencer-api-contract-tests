import { IsOptional, IsObject } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO for dynamic view filters with 2-level nesting
 * Captures query parameters like filter[xxx] and filter[xxx][yyy]
 * Supports patterns like:
 * - filter[country]=BRA
 * - filter[filterGroup][country]=ARG
 * - filter[filterGroup][brand]=Corona
 */
export class ViewFilterDto {
  @ApiPropertyOptional({
    description: "Dynamic view filter object with nested keys",
    example: {
      country: "BRA",
      filterGroup: {
        region: "south",
        period: "2024",
      },
    },
  })
  @IsOptional()
  @IsObject()
  filter?: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [nestedKey: string]: string | number | boolean;
        };
  };
}
