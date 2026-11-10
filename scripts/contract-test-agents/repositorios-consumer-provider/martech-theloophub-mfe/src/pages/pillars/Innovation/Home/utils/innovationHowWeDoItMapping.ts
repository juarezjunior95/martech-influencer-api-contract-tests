import type { BigNumberSparkLineCardData } from 'pages/components';

import type { HowWeDoItSection } from '../components/HowWeDoItCard/types';

export function howWeDoItSectionToSparkLineCardData(
  section: HowWeDoItSection | null,
): BigNumberSparkLineCardData | null {
  if (!section?.bigNumberData?.length) {
    return null;
  }

  return {
    chartTitle: section.title,
    chartPeriod: section.period,
    measure: section.measure,
    bigNumberData: [...section.bigNumberData],
    chartLineData: [...(section.chartLineData ?? [])],
  };
}
