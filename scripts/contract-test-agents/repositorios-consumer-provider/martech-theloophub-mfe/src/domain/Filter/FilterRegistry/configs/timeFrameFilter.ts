import { FilterConfig } from '../types';

export const timeFrameFilterConfig: FilterConfig = {
  key: 'time_frame',
  order: 10,
  isCommon: true,
  calculator: (filterData) => {
    const timeFrameDefault = filterData.time_frame?.default?.end;

    if (timeFrameDefault) {
      return new Date(timeFrameDefault).getFullYear();
    }

    return null;
  },
  validator: (filterData, value) => {
    return filterData?.time_frame?.values?.end.startsWith(String(value));
  },
  metadata: {
    displayName: 'Time Frame',
    description: 'Time period filter',
  },
};
