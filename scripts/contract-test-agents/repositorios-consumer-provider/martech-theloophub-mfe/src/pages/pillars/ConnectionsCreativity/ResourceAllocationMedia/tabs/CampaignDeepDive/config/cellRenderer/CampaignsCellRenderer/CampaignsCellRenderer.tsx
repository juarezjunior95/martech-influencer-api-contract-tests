import React from 'react';

import { GroupCellRendererParams } from 'ag-grid-community';
import { CustomTooltip } from 'components';
import { TableCellType } from 'components/Table/types';
import { StyledBlackTooltipContainer } from 'shared/Styles';

import { MAX_LENGTH_FOR_TOOLTIP } from '../../../constants';
import {
  StyledAgCellContent,
  StyledCampaignsContainer,
  StyledCampaignsItem,
} from './CampaignsCellRenderer.styles';

export const CampaignsCellRenderer = (
  params: GroupCellRendererParams,
): JSX.Element => {
  const field = params.colDef.field;
  const config = params.data[field + '_config'] as TableCellType;
  let finalValue: unknown = null;
  const ref = React.useRef<HTMLDivElement>(null);

  const renderCampaignItemWithTooltip = (
    item: { id: string; value: string; original_value: number },
    index: number,
  ) => {
    return (
      <CustomTooltip
        backgroundStyle="transparent"
        content={
          <StyledBlackTooltipContainer className="tooltip-text">
            {item.original_value ? '$' + item.original_value : item.value}
          </StyledBlackTooltipContainer>
        }
      >
        <StyledCampaignsItem isLast={index === config.value.length - 1}>
          {item.value}
        </StyledCampaignsItem>
      </CustomTooltip>
    );
  };

  const renderCampaignItem = (
    item: { id: any; value: string },
    index: number,
  ) => {
    return (
      <StyledCampaignsItem isLast={index === config.value.length - 1}>
        {item.value}
      </StyledCampaignsItem>
    );
  };

  if (config.value.length > 0) {
    finalValue = (
      <StyledCampaignsContainer>
        {config.value.map(
          (
            item: { id: string; value: string; original_value: number },
            index: number,
          ) => (
            <div key={item.id}>
              {String(item.value).length >= MAX_LENGTH_FOR_TOOLTIP ||
              item.original_value
                ? renderCampaignItemWithTooltip(item, index)
                : renderCampaignItem(item, index)}
            </div>
          ),
        )}
      </StyledCampaignsContainer>
    );
  }

  return (
    <StyledAgCellContent ref={ref} className="ag-cell-content">
      {finalValue}
    </StyledAgCellContent>
  );
};
