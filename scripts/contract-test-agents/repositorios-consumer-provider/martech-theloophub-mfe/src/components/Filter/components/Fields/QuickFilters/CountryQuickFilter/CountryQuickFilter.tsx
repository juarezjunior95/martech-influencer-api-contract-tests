import { useCallback, useEffect, useMemo, useState } from 'react';

import GlobalIcon from 'assets/icons/global.svg';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter';
import {
  useGoogleAnalytics,
  usePageFilterApplied,
  usePageFilterData,
} from 'hooks';
import { Option } from 'models/Filters';
import { getCountryAssetImageUrl } from 'utils';

interface CountryChipImageProps {
  imageUrl: string;
  alt: string;
  dataTestId?: string;
}

const CountryChipImage: React.FC<CountryChipImageProps> = ({
  imageUrl,
  alt,
  dataTestId,
}) => {
  return (
    <img
      data-testid={dataTestId}
      src={imageUrl}
      alt={alt}
      width={16}
      height={16}
    />
  );
};

const CountryChipPlaceholder: React.FC<{
  option: Option;
  dataTestId?: string;
}> = ({ option, dataTestId }) => {
  const value = String(option?.value || '');
  const presetUrl = option?.image_url;
  const [imageUrl, setImageUrl] = useState<string | null>(presetUrl ?? null);

  useEffect(() => {
    if (presetUrl) {
      setImageUrl(presetUrl);
      return undefined;
    }

    if (!value || value === 'ABI') {
      setImageUrl(null);
      return undefined;
    }

    let cancelled = false;

    getCountryAssetImageUrl(value).then((url) => {
      if (!cancelled) setImageUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [value, presetUrl]);

  if (value === 'ABI') {
    return <img src={GlobalIcon} alt="ABI Global" width={16} height={16} />;
  }

  if (!imageUrl) return null;

  return (
    <CountryChipImage
      dataTestId={dataTestId ? `${dataTestId}-country-img` : undefined}
      imageUrl={imageUrl}
      alt={value}
    />
  );
};

export const CountryQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { applied } = usePageFilterApplied(pageName);
  const zoneValue = applied.zone;
  const countryValue = applied.country;
  const { dataFilters, rawData } = usePageFilterData(pageName);

  const options = useMemo(() => {
    return FilterDataAccessor.getInstance().getCountryOptions(dataFilters);
  }, [dataFilters]);

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Country Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });

    onValueChange('zone', { value: op.zone, label: op.zone });
    onValueChange(fieldKey, op);
  };

  const { handleClear } = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'Country Select',
    filterContext: { zone: zoneValue },
    onValueChange,
    getCurrentValue,
  });

  const getChipPlaceholder = useCallback(
    (options: Option | Option[]) => {
      const option = Array.isArray(options) ? options[0] : options;
      if (!option?.value) return null;

      return (
        <CountryChipPlaceholder
          key={String(option.value)}
          option={option}
          dataTestId={dataTestId}
        />
      );
    },
    [dataTestId],
  );

  const validOptions = options
    .filter((op) => op?.value != null && op?.label != null)
    .map((op) => ({
      value: String(op?.value),
      label: op?.quick_filter_label || op?.label,
      zone: op?.zone,
      image_url: op?.image_url,
    }));

  const validValue = useMemo(() => {
    if (!countryValue) return validOptions[0]?.value || '';
    if (zoneValue !== 'ABI' && countryValue === 'ABI') {
      const applied = {
        country: countryValue,
        zone: zoneValue,
      };
      const country = FilterDataAccessor.getInstance().getCountry(
        dataFilters,
        applied,
        rawData,
      );

      return {
        value: zoneValue,
        label: country?.quick_filter_label || country?.label,
      };
    }

    return String(countryValue);
  }, [countryValue, zoneValue, validOptions, dataFilters, rawData]);

  const showClearIcon =
    validValue !== validOptions[0]?.value && zoneValue !== 'ABI';

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={validValue}
      options={validOptions}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Country"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
