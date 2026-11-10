import React from 'react';

import { render, screen } from '@testing-library/react';
import type { TableDataType } from 'components/Table/types';
import { PnlBrands } from 'pages/components/PnlTable';

import { PNL_BRANDS_VOLUME_PAGES_EXPORT_TABLE_CONFIG } from './config';
import { PnlBrandsVolumePagesSlide } from './PnlBrandsVolumePagesSlide';

jest.mock('pages/components/PnlTable', () => ({
  PnlBrands: jest.fn(
    ({ dataTestId, loading }: { dataTestId?: string; loading: boolean }) => (
      <div data-testid={dataTestId}>
        <span data-testid="pnl-loading">{String(loading)}</span>
      </div>
    ),
  ),
}));

jest.mock('./PnlBrandsVolumePagesSlide.styles', () => ({
  StyledPnlBrandsVolumePagesSlideRoot: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="pnl-volume-slide-root">{children}</div>,
}));

const mockTable: TableDataType = {
  header: [{ title: 'A' }],
  rows: [],
};

describe('PnlBrandsVolumePagesSlide', () => {
  it('should render PnL brands export content', () => {
    render(
      <PnlBrandsVolumePagesSlide
        data={mockTable}
        loading={false}
        pageFilterPageName="/test-page"
        dataTestId="pnl-slide"
      />,
    );

    expect(screen.getByTestId('pnl-volume-slide-root')).toBeInTheDocument();
    expect(screen.getByTestId('pnl-slide')).toBeInTheDocument();
    expect(screen.getByTestId('pnl-loading')).toHaveTextContent('false');
    const [[pnlBrandsProps]] = (PnlBrands as jest.Mock).mock.calls;
    expect(pnlBrandsProps).toEqual(
      expect.objectContaining({
        data: mockTable,
        loading: false,
        pageFilterPageName: '/test-page',
        dataTestId: 'pnl-slide',
        rowHeight: 36,
        tableConfigs: PNL_BRANDS_VOLUME_PAGES_EXPORT_TABLE_CONFIG,
      }),
    );
  });

  it('propagates loading=true to PnlBrands', () => {
    render(
      <PnlBrandsVolumePagesSlide
        data={mockTable}
        loading
        pageFilterPageName="/test-page"
        dataTestId="pnl-slide"
      />,
    );

    expect(screen.getByTestId('pnl-loading')).toHaveTextContent('true');
  });
});
