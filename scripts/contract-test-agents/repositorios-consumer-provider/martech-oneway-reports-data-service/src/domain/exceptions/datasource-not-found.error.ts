import { NotFoundException } from "@nestjs/common";

/**
 * Datasource Not Found Error
 * Thrown when a datasource configuration is not found
 */
export class DatasourceNotFoundError extends NotFoundException {
  constructor(datasourceName: string) {
    super(`Datasource '${datasourceName}' not found`);
    this.name = "DatasourceNotFoundError";
  }
}
