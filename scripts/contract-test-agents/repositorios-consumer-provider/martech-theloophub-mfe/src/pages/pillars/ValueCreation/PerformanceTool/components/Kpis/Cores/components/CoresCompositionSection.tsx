import {
  BasicContainer,
  ComparisonLine,
  DataStateHandler,
  NewWaterfall,
} from 'components';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';
import { CORES_COMPOSITION_WATERFALL_COLORS } from 'pages/pillars/ValueCreation/PerformanceTool/constants';
import { WaterfallData } from 'pages/pillars/ValueCreation/PerformanceTool/types';

interface CoresCompositionSectionProps {
  data?: WaterfallData;
  measure?: string;
  loading: UseBffDataResponse['loading'];
  error?: UseBffDataResponse['error'];
}

const SKELETON_PROPS = {
  height: '328px',
  width: '100%',
  length: 1,
  borderRadius: 'none' as const,
};

export const CoresCompositionSection: React.FC<
  CoresCompositionSectionProps
> = ({ data, measure, loading, error }) => {
  return (
    <BasicContainer
      header={{
        title: 'CORES Composition',
        measure,
        titleSize: 'H4',
      }}
      layout={{
        border: 'small',
        borderRadius: 'large',
        shadow: 'small',
        bodyPadding: false,
        bottomSeparator: 'border',
      }}
      fullWidth
    >
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!data || !!data.empty}
        skeletonProps={SKELETON_PROPS}
      >
        <div style={{ height: '300px', width: '100%' }}>
          <NewWaterfall
            values={data?.values || []}
            labels={data?.labels || []}
            formattedData={data?.formattedData}
            specialIndexes={data?.specialIndexes}
            colors={CORES_COMPOSITION_WATERFALL_COLORS}
          />
        </div>
        {data?.comparisonLine?.data && (
          <div style={{ marginTop: 12, paddingBottom: 16 }}>
            <ComparisonLine
              data={data.comparisonLine.data}
              gridColumnsLength={data.labels.length}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </div>
        )}
      </DataStateHandler>
    </BasicContainer>
  );
};
