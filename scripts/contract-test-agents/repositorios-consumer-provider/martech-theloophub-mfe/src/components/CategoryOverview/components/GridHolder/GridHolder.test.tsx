import React from 'react';

import { render, screen } from '@testing-library/react';
import { CategoryOverviewInterface } from 'components/CategoryOverview/CategoryOverview';

import { GridHolderComponent } from './GridHolder';

jest.mock('hooks', () => ({
  useIsInExportPage: jest.fn(() => false),
}));

jest.mock('utils/format', () => ({
  formatNumber: jest.fn(String),
}));

jest.mock('./GridHolder.styles', () => ({
  ContainerGridHolder: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
  WapperGridHolder: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  GridHolder: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <div style={style}>{children}</div>,
  LabelHolder: ({
    children,
    isExportPage,
  }: {
    children: React.ReactNode;
    isExportPage?: boolean;
  }) => <span data-is-pr={isExportPage}>{children}</span>,
  ValueHolder: ({
    children,
    direction,
    isExportPage,
  }: {
    children: React.ReactNode;
    direction?: string;
    isExportPage?: boolean;
  }) => (
    <span data-direction={direction} data-is-pr={isExportPage}>
      {children}
    </span>
  ),
  BalancedChoicesFooter: ({ children }: { children: React.ReactNode }) => (
    <footer>{children}</footer>
  ),
}));

const mockData: CategoryOverviewInterface = {
  title: 'Test Grid',
  versus: "vs Q1'24",
  footerInfo: 'Footer text',
  kpi: {
    header: [
      { id: 'label', title: '' },
      { id: 'mix', title: 'MIX' },
      { id: 'vsLy', title: 'vs LY' },
    ],
    rows: [
      {
        label: 'Vol',
        mix: { value: 2.1, unitOfMeasure: '%' },
        vsLy: {
          value: 2.1,
          unitOfMeasure: 'pp',
          direction: 'up',
        },
      },
    ],
  },
};

describe('GridHolderComponent', () => {
  it('should render container with data-testid when provided', () => {
    render(<GridHolderComponent data={mockData} dataTestId="grid-holder" />);

    expect(screen.getByTestId('grid-holder')).toBeInTheDocument();
  });

  it('should render header titles from kpi', () => {
    render(<GridHolderComponent data={mockData} />);

    expect(screen.getByText('MIX')).toBeInTheDocument();
    expect(screen.getByText('vs LY')).toBeInTheDocument();
  });

  it('should render row label and formatted values', () => {
    render(<GridHolderComponent data={mockData} />);

    expect(screen.getByText('Vol')).toBeInTheDocument();
    expect(screen.getByText('2.1%')).toBeInTheDocument();
    expect(screen.getByText('2.1pp')).toBeInTheDocument();
  });

  it('should render footer info', () => {
    render(<GridHolderComponent data={mockData} />);

    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('should render without kpi when data has no kpi', () => {
    const dataWithoutKpi: CategoryOverviewInterface = {
      title: 'Empty',
      versus: 'vs',
      footerInfo: 'No data',
    };

    render(<GridHolderComponent data={dataWithoutKpi} />);

    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
