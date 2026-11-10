import type { BigNumberData } from 'components/BigNumber/types';

import type { OvertimePerformanceData } from '../components/OvertimePerformance/OvertimePerformance';

interface BffBigNumber {
  value: string | number;
  measure?: string;
  direction?: 'up' | 'down';
  color?: string;
}

interface BffBigNumberDataItem {
  bigNumber?: BffBigNumber;
  comparison?: BigNumberData['comparison'];
  secondaryInfo?: BigNumberData['secondaryInfo'];
}

interface BffOvertimePerformanceItem {
  title: string;
  kpiKey: string;
  dataTestId: string;
  data: BffBigNumberDataItem[];
  emptyStateMessage?: string | null;
}

function mapDirectionToTrend(
  direction?: string,
): 'positive' | 'negative' | undefined {
  if (direction === 'up') return 'positive';
  if (direction === 'down') return 'negative';
  return undefined;
}

export function mapBigNumbersResponse(
  items: BffOvertimePerformanceItem[],
): OvertimePerformanceData {
  return items.map((item) => ({
    title: item.title,
    kpiKey: item.kpiKey as OvertimePerformanceData[number]['kpiKey'],
    dataTestId: item.dataTestId,
    emptyStateMessage: item.emptyStateMessage ?? undefined,
    data: item.data.map((dataItem) => ({
      ...dataItem,
      bigNumber: dataItem.bigNumber
        ? {
            value: dataItem.bigNumber.value,
            measure: dataItem.bigNumber.measure,
            trend: mapDirectionToTrend(dataItem.bigNumber.direction),
            color: dataItem.bigNumber.color,
          }
        : undefined,
    })),
  }));
}
