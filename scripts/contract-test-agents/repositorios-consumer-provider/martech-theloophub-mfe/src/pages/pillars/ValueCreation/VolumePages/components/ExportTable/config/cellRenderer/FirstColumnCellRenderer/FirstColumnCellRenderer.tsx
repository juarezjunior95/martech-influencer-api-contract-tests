import { GroupCellRendererParams } from 'ag-grid-community';
import BalancedChoicesImage from 'assets/img/GrowthLevers/balanced_choices.png';
import BeyondBeerImage from 'assets/img/GrowthLevers/beyond_beer.png';
import LeadPremiumImage from 'assets/img/GrowthLevers/lead_premium.png';
import SuperiorCoreImage from 'assets/img/GrowthLevers/superior_core.png';
import { GroupedImages } from 'components';
import {
  StyledFirstColumnCellRendererImage,
  StyledSubtitle,
} from 'pages/pillars/ValueCreation/VolumePages/components/ExportTable/config/cellRenderer/FirstColumnCellRenderer/FirstColumnCellRenderer.styles';

import { TOTAL_VALUE } from '../..';

const images = {
  'Superior Core': SuperiorCoreImage,
  'Lead Premium': LeadPremiumImage,
  'Balanced Choices': BalancedChoicesImage,
  'Beyond Beer': BeyondBeerImage,
};

export const FirstColumnCellRenderer = (
  params: GroupCellRendererParams,
): JSX.Element => {
  const { value } = params;
  const colId = params.column?.getColId();

  const config = params.data?.[colId + '_config'];
  const configImage = config?.image;
  const isBeyondBeer = config?.isBeyondBeer;
  const subtitle = config?.subtitle;
  const groupedImages = config?.images;

  const image = images[value] || configImage;
  const shouldShowImage = image && TOTAL_VALUE != value;

  return (
    <div className="ag-cell-content">
      {shouldShowImage && (
        <StyledFirstColumnCellRendererImage
          isConfigImage={!!configImage}
          isBeyondBeer={isBeyondBeer}
          src={image}
          alt={value}
        />
      )}
      <span>{value}</span>
      {subtitle && (
        <StyledSubtitle>
          {subtitle.replace('(', '').replace(')', '')}
        </StyledSubtitle>
      )}
      {groupedImages?.length > 0 && <GroupedImages images={groupedImages} />}
    </div>
  );
};
