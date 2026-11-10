import React from 'react';

import { Legend, Skeleton } from 'components';
import { Legend as LegendType } from 'pages/pillars/PortfolioBrand/BrandPowerBook/types';

interface PowerLegendProps {
  loading: boolean;
  data: LegendType[];
  dataTestId?: string;
}

export const PowerLegend: React.FC<PowerLegendProps> = ({
  loading,
  data,
  dataTestId,
}) => {
  return loading ? (
    <div style={{ margin: '16px 0' }}>
      <Skeleton
        dataTestId={dataTestId ? `${dataTestId}-power-legend` : undefined}
        width="124px"
        height="28px"
        length={2}
        borderRadius="small"
      />
    </div>
  ) : (
    <Legend
      dataTestId={dataTestId ? `${dataTestId}-power-legend` : undefined}
      caption={Object.values(data || []).map((item) => ({
        ...item,
        captionType: 'extended-bar',
      }))}
      legendPosition="left"
      font="heading"
    />
  );
};
