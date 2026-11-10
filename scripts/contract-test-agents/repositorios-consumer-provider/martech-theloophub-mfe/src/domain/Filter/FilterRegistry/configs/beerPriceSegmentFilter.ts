import { FilterConfig } from '../types';

export const beerPriceSegmentFilterConfig: FilterConfig = {
  key: 'beer_price_segment',
  order: 33,
  isCommon: true,
  parentKey: 'brand_filter_groupings',
  calculator: (filterData, currentDefaults) => {
    const groupingValue = currentDefaults.brand_filter_groupings;
    if (groupingValue !== 'Beer Price Segment') {
      return null;
    }

    if (filterData.beer_price_segment) {
      const defaultValue = filterData.beer_price_segment.default?.value;
      const fallbackValue = filterData.beer_price_segment.values?.[0]?.value;
      return defaultValue || fallbackValue || null;
    }

    return null;
  },

  validator: (filterData, value) => {
    if (filterData.beer_price_segment?.values) {
      const options = filterData.beer_price_segment.values;
      return options.some((opt: any) => opt.value === value);
    }

    return false;
  },

  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const groupingValue = currentValues?.brand_filter_groupings;
    if (groupingValue !== 'Beer Price Segment') {
      return null;
    }

    if (
      filterData?.beer_price_segment.values.some(
        (opt: any) => opt.value === currentValues.beer_price_segment,
      )
    ) {
      return currentValues.beer_price_segment;
    }

    return (
      filterData?.beer_price_segment.default?.value ??
      filterData?.beer_price_segment.values?.[0]?.value ??
      null
    );
  },

  dependencies: [],

  metadata: {
    displayName: 'Beer Price Segment',
    description:
      'Beer price segment classification filter, depends on brand filter groupings selection',
  },
};
