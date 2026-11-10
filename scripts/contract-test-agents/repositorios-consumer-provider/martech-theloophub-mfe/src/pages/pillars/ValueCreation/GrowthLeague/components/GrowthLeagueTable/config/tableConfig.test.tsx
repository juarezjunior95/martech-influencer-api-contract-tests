import { render, screen } from '@testing-library/react';
import { CellClassParams, GroupCellRendererParams } from 'ag-grid-community';

import { tableConfig } from './tableConfig';

jest.mock('components', () => ({
  RankingTag: ({
    position,
    type,
  }: {
    position: string | number;
    type: string;
  }) => (
    <span data-testid="ranking-tag" data-position={position} data-type={type}>
      {position}
    </span>
  ),
  TextDynamicTruncation: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
    shouldTruncate?: boolean;
    Component?: React.ElementType;
    size?: string;
  }) => <span data-testid={dataTestId}>{children}</span>,
}));

jest.mock('components/Tag', () => ({
  Tag: ({
    text,
    textColor,
    backgroundColor,
    dataTestId,
  }: {
    text: string;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    dataTestId?: string;
  }) => (
    <span
      data-testid={dataTestId || 'tag'}
      style={{ color: textColor, backgroundColor }}
    >
      {text}
    </span>
  ),
}));

jest.mock('utils/format', () => ({
  formatNumber: (value: number) => value.toFixed(1),
}));

describe('tableConfig', () => {
  const createMockCellParams = (
    overrides: Partial<GroupCellRendererParams> = {},
  ): GroupCellRendererParams => {
    return {
      value: 'test-value',
      data: {},
      colDef: { field: 'testField' },
      ...overrides,
    } as GroupCellRendererParams;
  };

  const createMockCellClassParams = (
    rowIndex: number,
    displayedRowCount: number,
  ): CellClassParams => {
    return {
      rowIndex,
      api: {
        getDisplayedRowCount: () => displayedRowCount,
      },
    } as CellClassParams;
  };

  describe('tableConfig function', () => {
    it('returns base columns without brand when isBrandView is false', () => {
      const config = tableConfig(['col1', 'col2'], false);

      expect(config).toHaveProperty('rank');
      expect(config).toHaveProperty('country');
      expect(config).not.toHaveProperty('brand');
      expect(config).toHaveProperty('col1');
      expect(config).toHaveProperty('col2');
    });

    it('includes brand column when isBrandView is true', () => {
      const config = tableConfig(['col1'], true);

      expect(config).toHaveProperty('rank');
      expect(config).toHaveProperty('country');
      expect(config).toHaveProperty('brand');
    });

    it('applies tagCellRenderer to all custom fields', () => {
      const config = tableConfig(['score', 'points', 'total'], false);

      expect(config['score']).toHaveProperty('cellRenderer');
      expect(config['points']).toHaveProperty('cellRenderer');
      expect(config['total']).toHaveProperty('cellRenderer');
    });

    it('sets correct minWidth for rank (70), country (232) and brand (200) columns', () => {
      const configNoBrand = tableConfig([], false);
      const configWithBrand = tableConfig([], true);

      expect(configNoBrand.rank.minWidth).toBe(70);
      expect(configNoBrand.country.minWidth).toBe(232);
      expect(configWithBrand.brand.minWidth).toBe(200);
    });
  });

  describe('rankingCellRenderer', () => {
    it('renders RankingTag with position value and type "ranking"', () => {
      const config = tableConfig([], false);

      render(
        <>{config.rank.cellRenderer(createMockCellParams({ value: 1 }))}</>,
      );

      const tag = screen.getByTestId('ranking-tag');
      expect(tag).toHaveAttribute('data-position', '1');
      expect(tag).toHaveAttribute('data-type', 'ranking');
    });

    it('renders RankingTag with string position', () => {
      const config = tableConfig([], false);

      render(
        <>{config.rank.cellRenderer(createMockCellParams({ value: '1' }))}</>,
      );

      expect(screen.getByTestId('ranking-tag')).toHaveTextContent('1');
    });
  });

  describe('countryCellRenderer', () => {
    it('renders ImgWithLabel with country image and value', () => {
      const config = tableConfig([], false);
      const params = createMockCellParams({
        value: 'Brazil',
        colDef: { field: 'country' },
        data: { country_config: { img: 'br.png' } },
      });

      render(<>{config.country.cellRenderer(params)}</>);

      const img = screen.getByAltText('Flag Brazil');
      expect(img).toHaveAttribute('src', 'br.png');
      expect(screen.getByText('Brazil')).toBeInTheDocument();
    });

    it('renders without crash when country_config is missing', () => {
      const config = tableConfig([], false);
      const params = createMockCellParams({
        value: 'Argentina',
        colDef: { field: 'country' },
        data: {},
      });

      render(<>{config.country.cellRenderer(params)}</>);

      expect(screen.getByText('Argentina')).toBeInTheDocument();
    });
  });

  describe('brandCellRenderer', () => {
    it('renders ImgWithLabel with brand image and value', () => {
      const config = tableConfig([], true);
      const params = createMockCellParams({
        value: 'Brahma',
        colDef: { field: 'brand' },
        data: { brand_config: { img: 'brahma.png' } },
      });

      render(<>{config.brand.cellRenderer(params)}</>);

      const img = screen.getByAltText('Brahma logo');
      expect(img).toHaveAttribute('src', 'brahma.png');
      expect(screen.getByText('Brahma')).toBeInTheDocument();
    });

    it('renders without crash when brand_config is missing', () => {
      const config = tableConfig([], true);
      const params = createMockCellParams({
        value: 'Quilmes',
        colDef: { field: 'brand' },
        data: {},
      });

      render(<>{config.brand.cellRenderer(params)}</>);

      expect(screen.getByText('Quilmes')).toBeInTheDocument();
    });
  });

  describe('tagCellRenderer', () => {
    it('renders GrowthLeagueTag with value and unitMeasure', () => {
      const config = tableConfig(['score'], false);
      const params = createMockCellParams({
        value: '85',
        colDef: { field: 'score' },
        data: { score_config: { unitMeasure: 'pts' } },
      });

      render(<>{config['score'].cellRenderer(params)}</>);

      expect(screen.getByText('85.0pts')).toBeInTheDocument();
    });

    it('renders GrowthLeagueTag without unit when unitMeasure is missing', () => {
      const config = tableConfig(['total'], false);
      const params = createMockCellParams({
        value: '95',
        colDef: { field: 'total' },
        data: {},
      });

      render(<>{config['total'].cellRenderer(params)}</>);

      expect(screen.getByText('95.0')).toBeInTheDocument();
    });
  });

  describe('cellClass function', () => {
    it('always includes the base class and adds last-of-group only for the last row', () => {
      const config = tableConfig([], false);

      const firstRowClasses = config.rank.cellClass(
        createMockCellClassParams(0, 5),
      );
      const lastRowClasses = config.rank.cellClass(
        createMockCellClassParams(4, 5),
      );
      const midRowClasses = config.rank.cellClass(
        createMockCellClassParams(2, 5),
      );

      expect(firstRowClasses).toContain('ag-cell-rank');
      expect(lastRowClasses).toContain('ag-cell-rank');
      expect(lastRowClasses).toContain('ag-cell-last-of-group');
      expect(midRowClasses).not.toContain('ag-cell-last-of-group');
    });

    it('applies ag-cell-country-no-border for brand view and ag-cell-country otherwise', () => {
      const configNoBrand = tableConfig([], false);
      const configWithBrand = tableConfig([], true);

      expect(
        configNoBrand.country.cellClass(createMockCellClassParams(0, 5)),
      ).toContain('ag-cell-country');

      expect(
        configWithBrand.country.cellClass(createMockCellClassParams(0, 5)),
      ).toContain('ag-cell-country-no-border');
    });
  });

  describe('header classes', () => {
    it('sets correct headerClass for country and brand columns', () => {
      const configNoBrand = tableConfig([], false);
      const configWithBrand = tableConfig([], true);

      expect(configNoBrand.country.headerClass).toBe('ag-header-cell-country');
      expect(configWithBrand.brand.headerClass).toBe('ag-header-cell-brand');
    });
  });
});
