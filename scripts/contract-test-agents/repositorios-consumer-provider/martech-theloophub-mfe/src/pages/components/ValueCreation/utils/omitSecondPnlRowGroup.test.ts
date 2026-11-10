import type { TableDataType } from 'components/Table/types';

import { omitSecondPnlRowGroup } from './omitSecondPnlRowGroup';

describe('omitSecondPnlRowGroup', () => {
  it('removes rows at index 1', () => {
    const data: TableDataType = {
      header: [],
      rows: [
        [{ a: { value: 1 } }],
        [{ b: { value: 2 } }],
        [{ c: { value: 3 } }],
      ],
    };

    const result = omitSecondPnlRowGroup(data);

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual([{ a: { value: 1 } }]);
    expect(result.rows[1]).toEqual([{ c: { value: 3 } }]);
  });

  it('returns same reference when rows missing', () => {
    const data = { header: [], rows: [] } as TableDataType;
    expect(omitSecondPnlRowGroup(data)).toBe(data);
  });
});
