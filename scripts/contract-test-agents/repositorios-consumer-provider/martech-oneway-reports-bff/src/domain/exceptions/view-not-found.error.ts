import { NotFoundException } from "@nestjs/common";

/**
 * View Not Found Error
 * Thrown when a view configuration is not found
 */
export class ViewNotFoundError extends NotFoundException {
  constructor(viewName?: string) {
    if (viewName) {
      super(`View '${viewName}' not found`);
    } else {
      super(`View not found`);
    }

    this.name = "ViewNotFoundError";
  }
}
