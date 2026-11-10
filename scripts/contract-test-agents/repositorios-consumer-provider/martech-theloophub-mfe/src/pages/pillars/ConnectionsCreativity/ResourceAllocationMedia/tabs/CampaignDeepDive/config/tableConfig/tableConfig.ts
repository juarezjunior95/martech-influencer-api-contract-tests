import { ColumnDefsConfig } from 'components';

import { BrandCellRenderer } from '../cellRenderer/BrandCellRenderer/BrandCellRenderer';
import { CampaignsCellRenderer } from '../cellRenderer/CampaignsCellRenderer/CampaignsCellRenderer';

const createColumnConfig = (headerClass?: string, minWidth?: number) => ({
  headerClass: headerClass,
  minWidth: minWidth,
});

const createColumnConfigCellRenderer = (
  headerClass?: string,
  minWidth?: number,
  cellRenderer?: (params: any) => any,
) => ({
  headerClass: headerClass,
  minWidth: minWidth,
  cellRenderer: (params: any) => cellRenderer(params),
});

export const configs: ColumnDefsConfig = {
  Gantt: {
    headerTooltip:
      'Here you can find the duration of the campaign and the performance in terms of Qualified Weeks On Air',
    headerGroupComponentParams: {
      tooltip: true,
    },
  },

  brand: createColumnConfigCellRenderer(null, 96, BrandCellRenderer),
  campaign_qwoa: createColumnConfigCellRenderer(
    null,
    84,
    CampaignsCellRenderer,
  ),
  campaign_woa: createColumnConfigCellRenderer(null, 84, CampaignsCellRenderer),
  campaign_$: createColumnConfigCellRenderer(null, 120, CampaignsCellRenderer),
  tt_qwoa: createColumnConfigCellRenderer(null, 84, CampaignsCellRenderer),
  campaign: createColumnConfigCellRenderer(null, 150, CampaignsCellRenderer),
  gantt: createColumnConfig(null, 577),
};
