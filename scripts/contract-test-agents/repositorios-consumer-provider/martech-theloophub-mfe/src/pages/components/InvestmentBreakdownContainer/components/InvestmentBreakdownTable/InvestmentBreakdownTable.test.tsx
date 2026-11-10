import React from 'react';

import { render, screen } from '@testing-library/react';
import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { tableConfig } from './config';
import { InvestmentBreakdownTable } from './InvestmentBreakdownTable';
import { InvestmentBreakdownTableStyles } from './InvestmentBreakdownTable.styles';

jest.mock('components', () => ({
  Table: jest.fn(() => <div data-testid="table">Table Component</div>),
}));

describe('InvestmentBreakdownTable', () => {
  const mockData: TableDataType = {
    header: [
      { id: 'brands', title: 'Brands' },
      { id: 'investment', title: 'Investment' },
    ],
    rows: [
      [
        {
          brands: { value: 'Brand A' },
          investment: { value: '100' },
        },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should pass correct data prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockData,
      }),
      expect.anything(),
    );
  });

  it('should pass correct style prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        style: InvestmentBreakdownTableStyles,
      }),
      expect.anything(),
    );
  });

  it('should pass correct rowHeight prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        rowHeight: 34,
      }),
      expect.anything(),
    );
  });

  it('should pass correct headerHeight prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        headerHeight: 34,
      }),
      expect.anything(),
    );
  });

  it('should pass correct groupHeaderHeight prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        groupHeaderHeight: 44,
      }),
      expect.anything(),
    );
  });

  it('should pass correct columnDefsConfig prop to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        columnDefsConfig: tableConfig,
      }),
      expect.anything(),
    );
  });

  it('should pass all props correctly to Table component', () => {
    render(<InvestmentBreakdownTable data={mockData} />);

    expect(Table).toHaveBeenCalledWith(
      {
        data: mockData,
        style: InvestmentBreakdownTableStyles,
        rowHeight: 34,
        headerHeight: 34,
        groupHeaderHeight: 44,
        columnDefsConfig: tableConfig,
      },
      expect.anything(),
    );
  });

  it('should render with different data', () => {
    const differentData: TableDataType = {
      header: [
        { id: 'category', title: 'Category' },
        { id: 'value', title: 'Value' },
        { id: 'percentage', title: 'Percentage' },
      ],
      rows: [
        [
          {
            category: { value: 'Category A' },
            value: { value: '500' },
            percentage: { value: '25%' },
          },
          {
            category: { value: 'Category B' },
            value: { value: '300' },
            percentage: { value: '15%' },
          },
        ],
      ],
    };

    render(<InvestmentBreakdownTable data={differentData} />);

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        data: differentData,
      }),
      expect.anything(),
    );
  });

  it('should render with empty rows', () => {
    const emptyData: TableDataType = {
      header: [{ id: 'brands', title: 'Brands' }],
      rows: [],
    };

    render(<InvestmentBreakdownTable data={emptyData} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        data: emptyData,
      }),
      expect.anything(),
    );
  });

  describe('dataTestId', () => {
    it('should pass dataTestId to Table component when provided', () => {
      render(
        <InvestmentBreakdownTable data={mockData} dataTestId="investment" />,
      );

      expect(Table).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'investment',
        }),
        expect.anything(),
      );
    });

    it('should not pass dataTestId to Table component when not provided', () => {
      render(<InvestmentBreakdownTable data={mockData} />);

      expect(Table).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockData,
          style: InvestmentBreakdownTableStyles,
          rowHeight: 34,
          headerHeight: 34,
          groupHeaderHeight: 44,
          columnDefsConfig: tableConfig,
        }),
        expect.anything(),
      );

      const callArgs = (Table as jest.Mock).mock.calls[0][0];
      expect(callArgs.dataTestId).toBeUndefined();
    });
  });
});
