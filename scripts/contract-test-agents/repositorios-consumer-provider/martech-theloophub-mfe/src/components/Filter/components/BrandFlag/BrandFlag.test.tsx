import { render, waitFor } from '@testing-library/react';
import * as hooks from 'hooks';

import { BrandFlag } from './BrandFlag';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  useBrandImage: jest.fn(),
}));

jest.mock('components/BrandImg', () => ({
  BrandImg: ({
    src,
    alt,
    dataTestId,
  }: {
    src?: string;
    alt?: string;
    dataTestId?: string;
  }) => {
    if (!src) return null;

    return (
      <div data-testid={dataTestId || 'brand-img'}>
        Src: {src}, Alt: {alt || 'none'}
      </div>
    );
  },
}));

describe('BrandFlag', () => {
  let mockUseCurrentPage: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentPage = jest.spyOn(hooks, 'useCurrentPage');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');

    mockUseCurrentPage.mockReturnValue({ currentPage: 'test-page' });
    (hooks.useBrandImage as jest.Mock).mockImplementation(
      (primary?: string | number | null) =>
        primary != null && String(primary).trim() !== ''
          ? `https://cdn.example.com/brands/${String(primary).toLowerCase()}/square.png`
          : null,
    );
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Brahma',
        sub_brands: 'Brahma Extra',
      },
    });
  });

  it('should render BrandImg with direct brand asset url', async () => {
    const { getByTestId, getByText } = render(<BrandFlag />);

    await waitFor(() => {
      expect(getByTestId('brand-img')).toBeInTheDocument();
    });
    expect(
      getByText(
        /Src: https:\/\/cdn.example.com\/brands\/brahma extra\/square.png/,
      ),
    ).toBeInTheDocument();
    expect(getByText(/Alt: Brahma Extra/)).toBeInTheDocument();
  });

  it('should use currentPage to get applied filters', () => {
    render(<BrandFlag />);

    expect(mockUseCurrentPage).toHaveBeenCalled();
    expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
  });

  it('should resolve sub brand asset url first', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Stella',
        sub_brands: 'Stella Artois',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'Stella Artois',
        'square',
        undefined,
        'Stella',
      );
    });
    expect(hooks.useBrandImage).toHaveBeenCalledTimes(1);
  });

  it('should use sub_scope as brand when brands is not available', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        sub_scope: 'Corona',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'Corona',
        'square',
        undefined,
        undefined,
      );
    });
  });

  it('should prioritize brands over sub_scope', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Brahma',
        sub_scope: 'Corona',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'Brahma',
        'square',
        undefined,
        undefined,
      );
    });
  });

  it('should not render BrandImg when asset url is not found', async () => {
    (hooks.useBrandImage as jest.Mock).mockReturnValue(null);
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'X',
      },
    });

    const { queryByTestId } = render(<BrandFlag />);

    await waitFor(() => {
      expect(queryByTestId('brand-img')).not.toBeInTheDocument();
    });
  });

  it('should pass sub_brands to brand asset resolver', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Budweiser',
        sub_brands: 'Bud Light',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'Bud Light',
        'square',
        undefined,
        'Budweiser',
      );
    });
  });

  it('should use brands_abi as subBrand when sub_brands is absent (BFF presets)', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands_abi: 'antarctica',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'antarctica',
        'square',
        undefined,
        undefined,
      );
    });
  });

  it('should prefer sub_brands over brands_abi when both are set', async () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        brands: 'Portfolio',
        sub_brands: 'Bud Light',
        brands_abi: 'antarctica',
      },
    });

    render(<BrandFlag />);

    await waitFor(() => {
      expect(hooks.useBrandImage).toHaveBeenCalledWith(
        'Bud Light',
        'square',
        undefined,
        'Portfolio',
      );
    });
    expect(hooks.useBrandImage).toHaveBeenCalledTimes(1);
  });

  describe('dataTestId rendering', () => {
    it('should render with default data-testid when dataTestId is not provided', async () => {
      const { getByTestId } = render(<BrandFlag />);

      await waitFor(() => {
        expect(getByTestId('brand-img')).toBeInTheDocument();
      });
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', async () => {
      const { container } = render(<BrandFlag />);

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="brand-img"]'),
        ).toBeInTheDocument();
      });

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="brand-flag-"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render BrandImg with prefixed dataTestId when dataTestId is provided', async () => {
      const { getByTestId } = render(<BrandFlag dataTestId="custom" />);

      await waitFor(() => {
        expect(getByTestId('brand-flag-custom')).toBeInTheDocument();
      });
    });
  });
});
