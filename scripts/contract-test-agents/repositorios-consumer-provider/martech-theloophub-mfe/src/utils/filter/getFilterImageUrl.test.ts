import { getAssetHostForServices } from 'config/api';

const mockGetCountry = jest.fn();

jest.mock('services', () => ({
  ImagesService: {
    getInstance: jest.fn(() => ({
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
    })),
  },
}));

import {
  getBrandImagePlaceholderUrl,
  getCountryAssetImageUrl,
} from './getFilterImageUrl';

describe('getFilterImageUrl', () => {
  const assetHost = getAssetHostForServices();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCountry.mockResolvedValue({
      data: { url: 'https://bff.example/resolved/BRA.png' },
    });
  });

  describe('getCountryAssetImageUrl', () => {
    it('returns null when country is missing', async () => {
      await expect(getCountryAssetImageUrl()).resolves.toBeNull();
      await expect(getCountryAssetImageUrl('')).resolves.toBeNull();
      await expect(getCountryAssetImageUrl('   ')).resolves.toBeNull();
      expect(mockGetCountry).not.toHaveBeenCalled();
    });

    it('returns resolved URL from ImagesService', async () => {
      await expect(getCountryAssetImageUrl('BRA')).resolves.toBe(
        'https://bff.example/resolved/BRA.png',
      );
      expect(mockGetCountry).toHaveBeenCalledWith({
        name: 'BRA',
        format: 'icon',
      });
    });

    it('returns null when API responds with error', async () => {
      mockGetCountry.mockResolvedValue({ hasError: true });
      await expect(getCountryAssetImageUrl('BRA')).resolves.toBeNull();
    });

    it('returns null when response has no url', async () => {
      mockGetCountry.mockResolvedValue({ data: {} });
      await expect(getCountryAssetImageUrl('BRA')).resolves.toBeNull();
    });
  });

  describe('getBrandImagePlaceholderUrl', () => {
    it('returns CDN placeholder path', () => {
      expect(getBrandImagePlaceholderUrl()).toBe(
        `${assetHost}/brands/placeholder/no-image-available.png`,
      );
    });
  });
});
