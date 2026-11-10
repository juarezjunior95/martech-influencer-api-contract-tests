import { getAssetHostForServices } from 'config/api';
import { ImagesService } from 'services';

type CountryResolveResponse = {
  hasError?: boolean;
  data?: { url?: string };
};

const assetHost = getAssetHostForServices();

const buildBrandFallbackCdnUrl = () => {
  return `${assetHost}/brands/placeholder/no-image-available.png`;
};

export const getBrandImagePlaceholderUrl = () => buildBrandFallbackCdnUrl();

export const getCountryAssetImageUrl = async (
  countryValue?: string,
  format = 'icon',
): Promise<string | null> => {
  const trimmed = countryValue?.trim();
  if (!trimmed) return null;

  const response = (await ImagesService.getInstance().getCountry({
    name: trimmed,
    format,
  })) as CountryResolveResponse;

  if (response?.hasError || !response?.data?.url) return null;
  return response.data.url;
};
