import { useMemo } from 'react';

import { FilterForm } from 'models';

import {
  commercialResultsLineBarChartMock_monthlyView,
  commercialResultsLineBarChartMock_volumeOvertime,
} from '../../__mocks__/LineBarChart';
import { UseLineBarChartData } from '../../types';

export const useLineBarChartData = ({
  formatMessage,
  applied,
}: {
  formatMessage: (descriptor: { id: string }) => string;
  applied: FilterForm;
}): UseLineBarChartData => {
  const title = useMemo(() => {
    return formatMessage({
      id: 'ValueCreation.CommercialResults.performance.lineBarChart.title',
    });
  }, [formatMessage]);
  const subtitle = useMemo(() => {
    return {
      prefix: formatMessage({
        id: 'ValueCreation.CommercialResults.performance.lineBarChart.subtitlePrefix',
      }),
      value: (applied?.brand as string) || 'Brahma',
    };
  }, [formatMessage, applied]);
  const data = useMemo(() => {
    if (applied.periods === 'YTD') {
      return commercialResultsLineBarChartMock_volumeOvertime as any;
    }
    return commercialResultsLineBarChartMock_monthlyView as any;
  }, [applied]);
  return {
    data,
    title,
    loading: false,
    error: null,
    showLineDataLabels: true,
    subtitle,
  };
};
