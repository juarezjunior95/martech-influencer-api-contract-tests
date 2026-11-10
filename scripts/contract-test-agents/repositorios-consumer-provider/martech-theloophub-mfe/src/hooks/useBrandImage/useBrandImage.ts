import { useCallback, useEffect, useMemo, useState } from 'react';

import type { BrandImageFormat } from 'models/Filters';
import { ImagesService, ResolveImagePayload } from 'services';
import { normalizeString } from 'utils/format';

export interface BrandImageRow {
  name: string;
  brandFamily?: string;
  format?: BrandImageFormat;
}

type BrandResolveResponse = {
  hasError?: boolean;
  data?: {
    url?: string;
    matched?: (ResolveImagePayload | string)[];
  };
};

export const brandImageCache = new Map<string, string>();
const inFlightByKey = new Map<string, Promise<void>>();

const normalizeKeyValue = (value?: string) => normalizeString(value || '');

export const buildBrandImageCacheKey = ({
  name,
  brandFamily = '',
  format = 'square',
}: BrandImageRow) => {
  return `${normalizeKeyValue(name)}-${normalizeKeyValue(brandFamily)}-${format}`;
};

const normalizeRows = (rows: BrandImageRow[]) => {
  const unique = new Map<string, BrandImageRow>();
  rows.forEach((row) => {
    if (!row?.name) return;
    const normalized: BrandImageRow = {
      name: normalizeKeyValue(row.name),
      brandFamily: normalizeKeyValue(row.brandFamily),
      format: row.format || 'square',
    };
    unique.set(buildBrandImageCacheKey(normalized), normalized);
  });
  return Array.from(unique.values());
};

const applyBrandResolveToCache = (
  body: BrandResolveResponse['data'],
  fallback: BrandImageRow,
) => {
  const url = body?.url;
  if (!url) return;

  const matched = body.matched;
  if (!Array.isArray(matched) || matched.length === 0) {
    brandImageCache.set(buildBrandImageCacheKey(fallback), url);
    return;
  }

  matched.forEach((entry) => {
    const key =
      typeof entry === 'string'
        ? buildBrandImageCacheKey({ name: entry })
        : buildBrandImageCacheKey({
            name: entry?.name || fallback.name,
            brandFamily: entry?.brandFamily,
            format:
              (entry?.format as BrandImageFormat) ||
              fallback.format ||
              'square',
          });
    brandImageCache.set(key, url);
  });
};

const resolveMissingRows = async (rows: BrandImageRow[]) => {
  const normalizedRows = normalizeRows(rows).filter(
    (row) => !brandImageCache.has(buildBrandImageCacheKey(row)),
  );
  if (normalizedRows.length === 0) return;

  const pendingPromises: Promise<void>[] = [];
  const queuedRows: BrandImageRow[] = [];

  normalizedRows.forEach((row) => {
    const key = buildBrandImageCacheKey(row);
    const inFlight = inFlightByKey.get(key);
    if (inFlight !== undefined) {
      pendingPromises.push(inFlight);
      return;
    }
    queuedRows.push(row);
  });

  queuedRows.forEach((row) => {
    const key = buildBrandImageCacheKey(row);
    const promise = ImagesService.getInstance()
      .getBrand({
        name: row.name,
        brandFamily: row.brandFamily,
        format: row.format || 'square',
      })
      .then((result) => {
        const response = result as BrandResolveResponse;
        if (response?.hasError) return;
        applyBrandResolveToCache(response?.data, row);
      })
      .finally(() => {
        inFlightByKey.delete(key);
      });

    inFlightByKey.set(key, promise);
    pendingPromises.push(promise);
  });

  if (pendingPromises.length > 0) {
    await Promise.all(pendingPromises);
  }
};

/**
 * Resolve one brand via the same cache + BFF flow as {@link useBrandImages}.
 * Safe to call from non-React code paths that share the brand image cache.
 */
export async function resolveBrandImageForRow(
  row: BrandImageRow,
): Promise<string | null> {
  if (!row?.name) return null;
  await resolveMissingRows([row]);
  return brandImageCache.get(buildBrandImageCacheKey(row)) || null;
}

type FilterIdValue = string | number | null;

const toBrandImageRow = (
  brandValue?: FilterIdValue,
  format: BrandImageFormat = 'square',
  brandFamily?: string,
): BrandImageRow | null => {
  if (brandValue == null) return null;
  const name = String(brandValue).trim();
  if (!name) return null;
  const row: BrandImageRow = { name, format };
  if (brandFamily != null && String(brandFamily).trim() !== '') {
    row.brandFamily = String(brandFamily).trim();
  }
  return row;
};

/**
 * Resolves a brand image URL (and optional fallback) via the same cache + BFF
 * flow as {@link resolveBrandImageForRow}. Prefer this in components instead of
 * calling the util from `getFilterImageUrl` directly.
 */
export const useBrandImage = (
  brandValue?: FilterIdValue,
  format: BrandImageFormat = 'square',
  brandFamily?: string,
  fallbackBrandValue?: FilterIdValue,
): string | null => {
  const primaryRow = useMemo(
    () => toBrandImageRow(brandValue, format, brandFamily),
    [brandValue, format, brandFamily],
  );
  const fallbackRow = useMemo(
    () => toBrandImageRow(fallbackBrandValue, format),
    [fallbackBrandValue, format],
  );

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!primaryRow && !fallbackRow) {
      setUrl(null);
      return undefined;
    }

    void (async () => {
      if (primaryRow) {
        const first = await resolveBrandImageForRow(primaryRow);
        if (cancelled) return;
        if (first) {
          setUrl(first);
          return;
        }
      }
      if (fallbackRow) {
        const second = await resolveBrandImageForRow(fallbackRow);
        if (!cancelled) {
          setUrl(second);
        }
        return;
      }
      if (!cancelled) {
        setUrl(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [primaryRow, fallbackRow]);

  return url;
};

export const useBrandImages = (rows: BrandImageRow[] = []) => {
  const normalizedRows = useMemo(() => normalizeRows(rows), [rows]);

  useEffect(() => {
    void resolveMissingRows(normalizedRows);
  }, [normalizedRows]);

  const getCachedBrandImage = useCallback((row: BrandImageRow) => {
    if (!row?.name) return null;
    return brandImageCache.get(buildBrandImageCacheKey(row)) || null;
  }, []);

  const resolveBrandImage = useCallback(
    (row: BrandImageRow) => resolveBrandImageForRow(row),
    [],
  );

  return {
    getCachedBrandImage,
    resolveBrandImage,
  };
};
