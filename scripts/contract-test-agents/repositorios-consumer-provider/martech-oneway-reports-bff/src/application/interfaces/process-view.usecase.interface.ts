import {
  FilterSet,
  View,
  ProcessedViewResult,
} from "@domain/entities/view.entity";

/**
 * Process View Use Case Interface
 * Handles the processing of view components and data retrieval
 */
export interface IProcessViewUseCase {
  /**
   * Processes a view by loading its configuration and components
   * @param view - The name of the view to process
   * @param filterSets - Optional array of filter sets to apply to datasources
   * @returns Promise with the processed view data
   */
  execute(view: string, filterSets?: FilterSet[]): Promise<ProcessedViewResult>;

  /**
   * Creates a View entity from view name and filter sets
   * @param view - View name
   * @param filterSets - Optional array of filter sets
   * @returns Promise with View entity
   */
  createViewEntity(view: string, filterSets?: FilterSet[]): Promise<View>;

  /**
   * Processes a View entity and returns the processed result
   * @param viewEntity - View entity to process
   * @returns Promise with processed view data containing view name and components
   */
  processViewEntity(viewEntity: View): Promise<ProcessedViewResult>;
}
