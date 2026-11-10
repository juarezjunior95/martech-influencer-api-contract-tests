import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

const mockGetBrand = jest.fn();

jest.mock('services', () => ({
  ImagesService: {
    getInstance: jest.fn(() => ({
      getBrand: (...args: unknown[]) => mockGetBrand(...args),
    })),
  },
}));

import {
  brandImageCache,
  buildBrandImageCacheKey,
  resolveBrandImageForRow,
  useBrandImage,
  useBrandImages,
} from './useBrandImage';

describe('useBrandImage', () => {
  beforeEach(() => {
    brandImageCache.clear();
    jest.clearAllMocks();
    mockGetBrand.mockResolvedValue({
      data: { url: 'https://cdn.example/brand.png' },
    });
  });

  it('returns null when brand value is missing', () => {
    const { result } = renderHook(() => useBrandImage(undefined));
    expect(result.current).toBeNull();
    expect(mockGetBrand).not.toHaveBeenCalled();
  });

  it('loads URL via ImagesService for primary brand', async () => {
    const { result } = renderHook(() =>
      useBrandImage('Corona Extra', 'square'),
    );
    await waitFor(() => {
      expect(result.current).toBe('https://cdn.example/brand.png');
    });
    expect(mockGetBrand).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        format: 'square',
      }),
    );
  });

  it('defaults format to square', async () => {
    renderHook(() => useBrandImage('Skol'));
    await waitFor(() => {
      expect(mockGetBrand).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'square',
        }),
      );
    });
  });

  it('passes brandFamily when provided', async () => {
    renderHook(() => useBrandImage('Beck', 'square', 'Family'));
    await waitFor(() => {
      expect(mockGetBrand).toHaveBeenCalledWith(
        expect.objectContaining({
          brandFamily: expect.any(String),
          format: 'square',
        }),
      );
    });
  });

  it('tries fallback when primary resolves without URL', async () => {
    mockGetBrand.mockResolvedValueOnce({ data: {} }).mockResolvedValueOnce({
      data: { url: 'https://cdn.example/fallback.png' },
    });

    const { result } = renderHook(() =>
      useBrandImage('Primary', 'square', undefined, 'Fallback'),
    );
    await waitFor(() => {
      expect(mockGetBrand).toHaveBeenCalledTimes(2);
      expect(result.current).toBe('https://cdn.example/fallback.png');
    });
  });

  it('returns null for invalid rows when resolving directly', async () => {
    await expect(
      resolveBrandImageForRow({ name: '' } as { name: string }),
    ).resolves.toBeNull();
    expect(mockGetBrand).not.toHaveBeenCalled();
  });

  it('uses square as default in cache key builder', () => {
    expect(buildBrandImageCacheKey({ name: 'Skol' })).toBe('skol--square');
  });

  it('stores matched aliases in cache when API returns matched array', async () => {
    mockGetBrand.mockResolvedValueOnce({
      data: {
        url: 'https://cdn.example/aliased.png',
        matched: ['Corona Extra', { name: 'Corona', brandFamily: 'Core' }],
      },
    });

    const result = await resolveBrandImageForRow({
      name: 'Corona',
      format: 'square',
    });

    expect(result).toBeNull();

    await expect(
      resolveBrandImageForRow({ name: 'Corona Extra', format: 'square' }),
    ).resolves.toBe('https://cdn.example/aliased.png');
    await expect(
      resolveBrandImageForRow({
        name: 'Corona',
        brandFamily: 'Core',
        format: 'square',
      }),
    ).resolves.toBe('https://cdn.example/aliased.png');
  });

  it('ignores responses flagged with hasError', async () => {
    mockGetBrand.mockResolvedValueOnce({ hasError: true });
    await expect(
      resolveBrandImageForRow({ name: 'Error Brand', format: 'square' }),
    ).resolves.toBeNull();
  });

  it('deduplicates in-flight requests for the same normalized row', async () => {
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    mockGetBrand.mockImplementationOnce(async () => {
      await gate;
      return { data: { url: 'https://cdn.example/deduped.png' } };
    });

    const first = resolveBrandImageForRow({ name: 'Skol', format: 'square' });
    const second = resolveBrandImageForRow({
      name: '  SKOL  ',
      format: 'square',
    });

    expect(mockGetBrand).toHaveBeenCalledTimes(1);
    release?.();

    await expect(first).resolves.toBe('https://cdn.example/deduped.png');
    await expect(second).resolves.toBe('https://cdn.example/deduped.png');
    expect(mockGetBrand).toHaveBeenCalledTimes(1);
  });

  it('keeps null when primary resolves empty without fallback', async () => {
    mockGetBrand.mockResolvedValueOnce({ data: {} });
    const { result } = renderHook(() => useBrandImage('No Image'));
    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('exposes cached lookup and resolver via useBrandImages', async () => {
    const rows = [{ name: 'Brahma', format: 'square' as const }];
    const { result } = renderHook(() => useBrandImages(rows));

    await waitFor(() => {
      expect(mockGetBrand).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'brahma',
          format: 'square',
        }),
      );
    });

    expect(result.current.getCachedBrandImage({ name: '' })).toBeNull();
    expect(
      result.current.getCachedBrandImage({ name: 'Brahma', format: 'square' }),
    ).toBe('https://cdn.example/brand.png');

    await expect(
      result.current.resolveBrandImage({ name: 'Brahma', format: 'square' }),
    ).resolves.toBe('https://cdn.example/brand.png');
  });

  it('supports useBrandImages without rows', () => {
    const { result } = renderHook(() => useBrandImages());
    expect(result.current.getCachedBrandImage({ name: 'Unknown' })).toBeNull();
  });
});
