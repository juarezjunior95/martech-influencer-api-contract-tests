import { filterConfigs } from './configs';
import FilterRegistry from './FilterRegistry';
import { FilterConfig } from './types';

/**
 * Função helper para registrar um filtro
 * @param config Configuração do filtro
 */
export function registerFilter(config: FilterConfig): void {
  FilterRegistry.getInstance().register(config);
}

/**
 * Função helper para registrar múltiplos filtros de uma vez
 * @param configs Array de configurações de filtros
 */
export function registerFilters(configs: FilterConfig[]): void {
  const registry = FilterRegistry.getInstance();
  configs.forEach((config) => registry.register(config));
}

let isInitialized = false;

export function initializeFilterRegistry(): void {
  if (isInitialized) {
    console.warn('FilterRegistry already initialized');
    return;
  }

  registerFilters(filterConfigs);

  isInitialized = true;
}
