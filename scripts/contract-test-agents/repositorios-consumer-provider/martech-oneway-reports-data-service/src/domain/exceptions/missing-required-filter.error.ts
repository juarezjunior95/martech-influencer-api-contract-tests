import { BadRequestException } from "@nestjs/common";

/**
 * Missing Required Filter Error
 * Thrown when a required filter is missing from the datasource
 */
export class MissingRequiredFilterError extends BadRequestException {
  constructor(filterName: string, datasourceName: string) {
    super(
      `Required filter '${filterName}' is missing for datasource '${datasourceName}'`,
    );
    this.name = "MissingRequiredFilterError";
  }
}
