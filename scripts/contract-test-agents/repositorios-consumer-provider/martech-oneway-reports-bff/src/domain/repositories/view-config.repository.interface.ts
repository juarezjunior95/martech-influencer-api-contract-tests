import { ViewConfig } from "@domain/entities/view.entity";

/**
 * View Config Repository Interface
 * Manages view configuration access
 */
export interface IViewConfigRepository {
  /**
   * Retrieves view configuration by name
   * @param viewName - Name of the view
   * @returns Promise with the view configuration or null if not found
   */
  getByName(viewName: string): Promise<ViewConfig | null>;
}
