import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayMinSize } from "class-validator";

/**
 * DTO for clearing view cache by tags
 */
export class ClearCacheDto {
  @ApiProperty({
    description: "Array of cache tags to invalidate",
    example: ["products", "brands"],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one tag is required" })
  @IsString({ each: true })
  tags: string[];
}
