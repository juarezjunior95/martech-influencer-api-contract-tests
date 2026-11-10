import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprPnlBrandsSlidesData } from './useVolumePprPnlBrandsSlidesData';

const mockUseBffData = jest.fn();
const mockSplit = jest.fn((_pnlBrands: unknown) => ({
  first: { header: [], rows: [] },
  second: { header: [], rows: [] },
}));
const mockOmit = jest.fn((t: { header: unknown[]; rows: unknown[] }) => t);

jest.mock('hooks', () => ({
  useBffData: (props: unknown) => mockUseBffData(props),
}));

jest.mock('pages/components/ValueCreation', () => ({
  splitPnlBrandsTable: (pnlBrands: unknown) => mockSplit(pnlBrands),
  omitSecondPnlRowGroup: (t: { header: unknown[]; rows: unknown[] }) =>
    mockOmit(t),
}));

describe('useVolumePprPnlBrandsSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('exposes sectionLoading from P&L BFF request', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });

    const { result } = renderHook(() => useVolumePprPnlBrandsSlidesData());

    expect(result.current.sectionLoading).toBe(true);
  });
});
