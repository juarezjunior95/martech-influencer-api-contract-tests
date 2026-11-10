import { volumeWaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';

import { StyledCommercialResultsContent } from '../../CommercialResults.styles';
import { useKpiDrillDownData } from '../../hooks/useKpiDrillDownData/useKpiDrillDownData';
import { BigNumbersSection } from '../Sections/BigNumbersSection/BigNumbersSection';
import { LineBarChartsSection } from '../Sections/Charts/LineBarChartSection/LineBarChartSection';
import { WaterfallSection } from '../Sections/Charts/WaterfallSection/WaterfallSection';
import { ExploreFurtherSection } from '../Sections/ExploreFurtherSection/ExploreFurtherSection';
import { PerformanceSection } from '../Sections/PerformanceSection';

const SKELETON_PROPS = {
  height: '112px',
  width: '336px',
  length: 3,
  borderRadius: 'medium' as const,
};

interface KpiDrillDownProps {
  onFilterChange: (key: string, value: string) => void;
}

export const KpiDrillDown: React.FC<KpiDrillDownProps> = () => {
  const {
    bigNumbersData,
    waterfallData,
    performanceInfo,
    config,
    lineBarChartData,
  } = useKpiDrillDownData();

  return (
    <StyledCommercialResultsContent>
      <BigNumbersSection data={bigNumbersData} skeletonProps={SKELETON_PROPS} />
      <PerformanceSection
        title={performanceInfo.performanceSection}
        tooltip={performanceInfo.tooltip}
      >
        <WaterfallSection
          config={volumeWaterfallConfig}
          measure={config.measure}
          data={waterfallData}
        />
        <LineBarChartsSection
          lineBarChartData={lineBarChartData}
          skeletonProps={SKELETON_PROPS}
          measure={config.measure}
        />
      </PerformanceSection>
      <ExploreFurtherSection />
    </StyledCommercialResultsContent>
  );
};
