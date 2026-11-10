import { ColDef } from 'ag-grid-community';

import { tableConfig } from './tableConfig';

describe('tableConfig', () => {
  it('should have portfolio column with correct width', () => {
    expect((tableConfig.portfolio as ColDef).width).toBe(180);
  });
});
