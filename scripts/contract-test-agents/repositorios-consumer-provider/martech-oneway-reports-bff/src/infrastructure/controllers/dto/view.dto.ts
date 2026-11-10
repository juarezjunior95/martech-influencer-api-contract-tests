import { IsString, IsNotEmpty } from "@nestjs/class-validator";

export class ViewParamsDto {
  @IsString()
  @IsNotEmpty()
  view: string;
}
