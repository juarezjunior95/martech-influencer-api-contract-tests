import { Inject, Injectable, Logger } from "@nestjs/common";
import newrelic from "newrelic";
import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { IViewCacheRepository } from "@domain/repositories/view-cache.repository.interface";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import {
  FilterSet,
  View,
  ProcessedViewResult,
} from "@domain/entities/view.entity";

/**
 * Cached Process View Use Case
 * Decorator pattern implementation that adds caching to ProcessViewUseCase
 * Keeps the business logic separate from caching concerns
 */
@Injectable()
export class CachedProcessViewUseCase implements IProcessViewUseCase {
  private readonly logger = new Logger(CachedProcessViewUseCase.name);

  constructor(
    @Inject("IProcessViewUseCase")
    private readonly processViewUseCase: IProcessViewUseCase,
    @Inject("IViewCacheRepository")
    private readonly viewCacheRepository: IViewCacheRepository,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IEnvironmentConfigService")
    private readonly environmentConfig: EnvironmentConfigService,
  ) {}

  /**
   * @inheritDoc
   * Decorates the execute method with cache logic
   */
  async execute(
    view: string,
    filterSets?: FilterSet[],
  ): Promise<ProcessedViewResult> {
    const viewEntity = await this.processViewUseCase.createViewEntity(
      view,
      filterSets,
    );

    const cacheConfig = viewEntity.getCacheConfig();

    if (!this.environmentConfig.viewCache.enabled || !cacheConfig.enabled) {
      newrelic.addCustomAttribute("view.cache.hit", false);
      return this.processViewUseCase.processViewEntity(viewEntity);
    }

    const user = await this.userRepository.getCurrentUser();
    const cachedResult = await this.viewCacheRepository.getView(
      viewEntity,
      user,
    );

    if (cachedResult) {
      newrelic.addCustomAttribute("view.cache.hit", true);
      this.logger.log(`Cache hit for view '${view}'`);
      return cachedResult;
    }

    newrelic.addCustomAttribute("view.cache.hit", false);

    const result = await this.processViewUseCase.processViewEntity(viewEntity);

    if (this.hasComponentErrors(result)) {
      this.logger.warn(`Not caching view '${view}' due to component errors`);
      return result;
    }

    const cacheSaved = await this.viewCacheRepository.setView(
      viewEntity,
      user,
      result,
    );
    this.logger.log(
      `View '${view}' processed${cacheSaved ? " and cached" : " (cache not saved)"}`,
    );

    return result;
  }

  /**
   * Checks if the processed result has any component with error
   * @param result - Processed view result
   * @returns true if any component has an error, false otherwise
   */
  private hasComponentErrors(result: ProcessedViewResult): boolean {
    if (!result || !result.components || !Array.isArray(result.components)) {
      return false;
    }

    return result.components.some(
      (component: any) => component && component.error,
    );
  }

  /**
   * @inheritDoc
   */
  async createViewEntity(
    view: string,
    filterSets?: FilterSet[],
  ): Promise<View> {
    return this.processViewUseCase.createViewEntity(view, filterSets);
  }

  /**
   * @inheritDoc
   */
  async processViewEntity(viewEntity: View): Promise<ProcessedViewResult> {
    return this.processViewUseCase.processViewEntity(viewEntity);
  }
}
