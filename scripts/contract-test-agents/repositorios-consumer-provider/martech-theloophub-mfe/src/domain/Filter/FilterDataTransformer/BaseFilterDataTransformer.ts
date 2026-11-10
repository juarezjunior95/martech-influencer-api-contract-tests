import type { FilterDataStructure } from 'models/Filters';

export interface FilterOption {
  value: string;
  label: string;
  zone?: string;
  image_url?: string;
  image_variants?: Record<string, string | null | undefined>;
}

export interface FlatFilterField {
  values: FilterOption[] | Record<string, FilterOption[]>;
  default: FilterOption | null;
  enabled: boolean;
}

/**
 * Base class for filter data transformers.
 * Subclasses implement toFlat() to convert domain-specific data into a flat filter structure.
 * transform() is defined in the base and delegates to toFlat().
 * Static transform() and isNewFormat() are defined by each concrete implementation.
 */
export abstract class BaseFilterDataTransformer<TData = unknown> {
  /**
   * Returns the flat filter structure as FilterDataStructure.
   * Subclasses use this from their static transform() after instantiating.
   */
  public transform(): FilterDataStructure {
    return this.toFlat();
  }

  public abstract toFlat(): FilterDataStructure;
}
