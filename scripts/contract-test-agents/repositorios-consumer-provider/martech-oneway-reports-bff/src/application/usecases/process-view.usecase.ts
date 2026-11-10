import { Inject, Injectable, Logger } from "@nestjs/common";
import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { IViewConfigRepository } from "@domain/repositories/view-config.repository.interface";
import { IDataRepository } from "@domain/repositories/datasource.repository.interface";
import { IFormatterRepository } from "@domain/repositories/formatter.repository.interface";
import {
  View,
  DataSource,
  ComponentConfig,
  DataSourceConfig,
  ProcessedComponent,
  ProcessedViewResult,
  FilterSet,
} from "@domain/entities/view.entity";

@Injectable()
export class ProcessViewUseCase implements IProcessViewUseCase {
  private readonly logger = new Logger(ProcessViewUseCase.name);

  constructor(
    @Inject("IViewConfigRepository")
    private readonly viewConfigRepository: IViewConfigRepository,
    @Inject("IDataRepository")
    private readonly dataRepository: IDataRepository,
    @Inject("IFormatterRepository")
    private readonly formatterRepository: IFormatterRepository,
  ) {}

  /**
   * @inheritDoc
   */
  async execute(
    view: string,
    filterSets?: FilterSet[],
  ): Promise<ProcessedViewResult> {
    const viewEntity = await this.createViewEntity(view, filterSets);
    return this.processViewEntity(viewEntity);
  }

  /**
   * Creates a View entity from view name and filter sets
   * @param view - View name
   * @param filterSets - Optional array of filter sets
   * @returns Promise with View entity
   */
  async createViewEntity(
    view: string,
    filterSets?: FilterSet[],
  ): Promise<View> {
    const config = await this.viewConfigRepository.getByName(view);
    return View.create({ view, config, filterSets });
  }

  /**
   * Processes a View entity and returns the processed result
   * @param viewEntity - View entity to process
   * @returns Promise with processed view data containing view name and components
   */
  async processViewEntity(viewEntity: View): Promise<ProcessedViewResult> {
    const viewName = viewEntity.getView();

    const processedComponents = await this.processComponents(viewEntity);

    const componentCount = processedComponents.length;
    const errorCount = processedComponents.filter((c: any) => c.error).length;

    this.logger.log(
      `View '${viewName}' processed: ${componentCount} components (${errorCount} errors)`,
    );

    return {
      view: viewName,
      components: processedComponents,
    };
  }

  /**
   * Processes all components for a given view entity.
   * Uses getComponentsToProcess() to determine which components to process.
   * All components are processed in parallel for optimal performance.
   * If a component fails, it returns an error object but continues processing other components.
   *
   * @param viewEntity - The view entity
   * @returns Promise with array of processed components
   */
  private async processComponents(
    viewEntity: View,
  ): Promise<ProcessedComponent[]> {
    return Promise.all(
      viewEntity.getComponentsToProcess().map(async (componentConfig) => {
        try {
          const data = await this.processComponentData(
            componentConfig,
            viewEntity,
          );

          return ProcessedComponent.create({
            id: componentConfig.id,
            data,
          });
        } catch (error) {
          this.logger.error(
            `Failed to process component '${componentConfig.id}' of view '${viewEntity.getView()}': ${error.message}`,
          );

          return ProcessedComponent.create({
            id: componentConfig.id,
            error: error.response?.data?.message || error.message,
          });
        }
      }),
    );
  }

  /**
   * Processes component data by loading data from datasources and applying formatter.
   * Executes the complete data processing pipeline for a single component.
   *
   * @param componentConfig - The component configuration to process
   * @param viewEntity - The view entity
   * @returns Promise with the processed component data
   */
  private async processComponentData(
    componentConfig: ComponentConfig,
    viewEntity: View,
  ): Promise<any> {
    // Step 1: Load data from all datasources
    const componentDatasourcesData = await this.loadComponentDatasources(
      componentConfig,
      viewEntity,
    );

    // Step 2: Apply formatter to the loaded data
    const data = await this.applyComponentFormatter(
      componentConfig,
      componentDatasourcesData,
    );

    return data;
  }

  /**
   * Loads data from all datasources for a given component.
   *
   * @param componentConfig - The component configuration to process
   * @param viewEntity - The view entity
   * @returns Promise with array of loaded data
   */
  private async loadComponentDatasources(
    componentConfig: ComponentConfig,
    viewEntity: View,
  ): Promise<DataSource[]> {
    return Promise.all(
      componentConfig.datasources.map(
        async (datasourceConfig: DataSourceConfig) => {
          const filters = viewEntity.getFiltersForDatasource(datasourceConfig);
          const data = await this.dataRepository.getData(
            datasourceConfig.name,
            filters,
          );
          data.title = datasourceConfig.title;
          return data;
        },
      ),
    );
  }

  /**
   * Applies a formatter to the loaded data.
   *
   * @param componentConfig - The component configuration
   * @param componentDatasourcesData - The data from all datasources for a component
   * @returns Promise with the formatted data
   */
  private async applyComponentFormatter(
    componentConfig: ComponentConfig,
    componentDatasourcesData: DataSource[],
  ): Promise<any> {
    return this.formatterRepository.format(
      componentConfig.formatter,
      componentDatasourcesData,
    );
  }
}
