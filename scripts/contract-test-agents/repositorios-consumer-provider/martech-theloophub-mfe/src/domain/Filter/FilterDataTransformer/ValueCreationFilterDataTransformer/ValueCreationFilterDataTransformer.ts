import type {
  DefaultOptions,
  FilterDataStructure,
  Option,
} from 'models/Filters';

import { BaseFilterDataTransformer } from '../BaseFilterDataTransformer';

export interface ValueCreationCountryOption extends Option {
  growth_levers?: {
    value: string;
    label: string;
    disabled: boolean;
  }[];
}

export interface ValueCreationCountryField {
  values: Record<string, ValueCreationCountryOption[]>;
  default: ValueCreationCountryOption;
  enabled: boolean;
}

export interface ValueCreationData {
  zones: DefaultOptions;
  country: ValueCreationCountryField;
  periods: DefaultOptions;
}

export interface ValueCreationApiData extends FilterDataStructure {
  value_creation: ValueCreationData;
}

export class ValueCreationFilterDataTransformer extends BaseFilterDataTransformer<ValueCreationApiData> {
  private readonly data: ValueCreationApiData;

  constructor(data: ValueCreationApiData) {
    super();
    this.data = data;
  }

  static transform(data: unknown): FilterDataStructure {
    if (!this.isNewFormat(data)) {
      return {};
    }

    const mapper = new ValueCreationFilterDataTransformer(
      data as ValueCreationApiData,
    );
    return mapper.transform();
  }

  static isNewFormat(data: unknown): boolean {
    return data !== null && typeof data === 'object';
  }

  toFlat(): ValueCreationData & FilterDataStructure {
    const { zones, country, periods } = this.data.value_creation;
    delete this.data.value_creation;

    return {
      ...this.data,
      zones: zones,
      country: country,
      periods: periods,
    };
  }
}
