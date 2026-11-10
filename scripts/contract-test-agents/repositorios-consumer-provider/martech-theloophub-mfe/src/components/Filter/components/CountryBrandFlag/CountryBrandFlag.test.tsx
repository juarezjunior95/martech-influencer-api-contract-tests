import { render } from '@testing-library/react';
import * as hooks from 'hooks';
import { ALL_BRAND } from 'models/Filters';

import { CountryBrandFlag } from './CountryBrandFlag';

jest.mock('@hexa-ui/components', () => ({
  Divider: ({
    orientation,
    'data-testid': dataTestId,
  }: {
    orientation: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'divider'} data-orientation={orientation}>
      Divider
    </div>
  ),
  Grid: {
    Container: 'div',
    Row: 'div',
    Col: 'div',
  },
  Chip: {
    Root: 'div',
  },
  EmptyState: {
    PageLevel: 'div',
  },
  Tabs: {
    Root: 'div',
  },
  SearchField: {
    Root: 'div',
  },
  styled: (component: any, styles: any) => component,
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
}));
jest.mock('../CountryFlag', () => ({
  CountryFlag: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'country-flag'}>Country Flag</div>
  ),
}));
jest.mock('../BrandFlag', () => ({
  BrandFlag: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'brand-flag'}>Brand Flag</div>
  ),
}));

describe('CountryBrandFlag', () => {
  let mockUseCurrentPage: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentPage = jest.spyOn(hooks, 'useCurrentPage');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');

    mockUseCurrentPage.mockReturnValue({ currentPage: 'test-page' });
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Brahma',
        scope: 'country_brands',
      },
    });
  });

  describe('rendering', () => {
    it('should always render CountryFlag', () => {
      const { getByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('country-flag')).toBeInTheDocument();
    });

    it('should use currentPage to get applied filters', () => {
      render(<CountryBrandFlag />);

      expect(mockUseCurrentPage).toHaveBeenCalled();
      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
    });
  });

  describe('BrandFlag visibility with brandFlagHidden=true', () => {
    it('should render BrandFlag when brands is set and not ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(getByTestId('brand-flag')).toBeInTheDocument();
      expect(getByTestId('divider')).toBeInTheDocument();
    });

    it('should not render BrandFlag when brands is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: ALL_BRAND,
        },
      });

      const { queryByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
      expect(queryByTestId('divider')).not.toBeInTheDocument();
    });

    it('should render BrandFlag when scope is global_brands', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          scope: 'global_brands',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(getByTestId('brand-flag')).toBeInTheDocument();
      expect(getByTestId('divider')).toBeInTheDocument();
    });

    it('should not render BrandFlag when brands is not set and scope is not global_brands', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          scope: 'country_brands',
        },
      });

      const { queryByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
      expect(queryByTestId('divider')).not.toBeInTheDocument();
    });

    it('should render BrandFlag when both brands is set and scope is global_brands', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Stella',
          scope: 'global_brands',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(getByTestId('brand-flag')).toBeInTheDocument();
    });
  });

  describe('BrandFlag visibility with brandFlagHidden=false', () => {
    it('should not render BrandFlag when brandFlagHidden is false even if brands is set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { queryByTestId } = render(
        <CountryBrandFlag brandFlagHidden={false} />,
      );

      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
      expect(queryByTestId('divider')).not.toBeInTheDocument();
    });

    it('should not render BrandFlag when brandFlagHidden is false even if scope is global_brands', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          scope: 'global_brands',
        },
      });

      const { queryByTestId } = render(
        <CountryBrandFlag brandFlagHidden={false} />,
      );

      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
    });
  });

  describe('default props', () => {
    it('should use brandFlagHidden=true as default', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('brand-flag')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined applied filters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: undefined,
      });

      const { getByTestId, queryByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('country-flag')).toBeInTheDocument();
      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
    });

    it('should handle null applied filters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      });

      const { getByTestId, queryByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('country-flag')).toBeInTheDocument();
      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
    });

    it('should handle empty applied filters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      });

      const { getByTestId, queryByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('country-flag')).toBeInTheDocument();
      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
    });
  });

  describe('divider', () => {
    it('should render divider with vertical orientation when BrandFlag is visible', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      const divider = getByTestId('divider');
      expect(divider).toBeInTheDocument();
      expect(divider).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('isGlobalBrandsScopeSelected memo', () => {
    it('should correctly identify global_brands scope', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          scope: 'global_brands',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(getByTestId('brand-flag')).toBeInTheDocument();
    });

    it('should not identify country_brands as global scope', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          scope: 'country_brands',
        },
      });

      const { queryByTestId } = render(
        <CountryBrandFlag brandFlagHidden={true} />,
      );

      expect(queryByTestId('brand-flag')).not.toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render with custom data-testid when dataTestId is provided', () => {
      const { getByTestId } = render(
        <CountryBrandFlag dataTestId="custom" brandFlagHidden={true} />,
      );

      expect(getByTestId('country-brand-flag-custom')).toBeInTheDocument();
    });

    it('should pass dataTestId to CountryFlag when provided', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag dataTestId="custom" brandFlagHidden={true} />,
      );

      expect(getByTestId('custom-country-brand-flag')).toBeInTheDocument();
    });

    it('should pass dataTestId to BrandFlag when provided', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getByTestId } = render(
        <CountryBrandFlag dataTestId="custom" brandFlagHidden={true} />,
      );

      expect(getByTestId('custom-brand-flag')).toBeInTheDocument();
    });

    it('should pass dataTestId to Divider when provided', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          brands: 'Brahma',
        },
      });

      const { getAllByTestId } = render(
        <CountryBrandFlag dataTestId="custom" brandFlagHidden={true} />,
      );

      const dividers = getAllByTestId('country-brand-flag-divider-custom');
      expect(dividers.length).toBeGreaterThan(0);
      expect(dividers[0]).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      const { getByTestId } = render(<CountryBrandFlag />);

      expect(getByTestId('country-flag')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<CountryBrandFlag />);

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="country-brand-flag-"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
