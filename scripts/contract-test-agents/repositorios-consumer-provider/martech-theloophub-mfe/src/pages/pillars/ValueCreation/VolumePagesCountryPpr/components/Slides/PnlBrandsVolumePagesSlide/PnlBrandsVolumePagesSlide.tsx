import React from 'react';

import { PnlBrands } from 'pages/components/PnlTable';

import { PNL_BRANDS_VOLUME_PAGES_EXPORT_TABLE_CONFIG } from './config';
import { StyledPnlBrandsVolumePagesSlideRoot } from './PnlBrandsVolumePagesSlide.styles';
import type { PnlBrandsVolumePagesSlideProps } from './types';

export const PnlBrandsVolumePagesSlide: React.FC<
  PnlBrandsVolumePagesSlideProps
> = ({ data, loading, pageFilterPageName, dataTestId }) => (
  <StyledPnlBrandsVolumePagesSlideRoot>
    <PnlBrands
      data={data}
      loading={loading}
      pageFilterPageName={pageFilterPageName}
      dataTestId={dataTestId}
      rowHeight={36}
      tableConfigs={PNL_BRANDS_VOLUME_PAGES_EXPORT_TABLE_CONFIG}
    />
  </StyledPnlBrandsVolumePagesSlideRoot>
);
