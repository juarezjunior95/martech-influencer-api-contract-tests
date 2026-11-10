import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const SubScopesField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const scope = getCurrentValue('scopes');
  const options = useMemo(() => {
    return FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
      scopes: scope,
    }) as Option[];
  }, [fieldKey, dataFilters, scope]);

  const placeholder = useMemo(() => {
    if (scope === 'portfolio') {
      return `Select a Portfolio`;
    }

    if (scope === 'global_brands') {
      return `Select a Global Brands`;
    }

    return `Select a Segment`;
  }, [scope]);

  const label = useMemo(() => {
    if (scope === 'portfolio') {
      return `Portfolio`;
    }

    if (scope === 'global_brands') {
      return `Global Brands`;
    }

    if (scope === 'segment') {
      return `Segment`;
    }

    return `Sub Scope`;
  }, [scope]);

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Sub Scope Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });
    onValueChange(fieldKey, option);
  };

  return scope ? (
    <Select
      dataTestId={
        dataTestId ? `${dataTestId}-sub-scopes-${fieldKey}` : undefined
      }
      id={`${fieldKey}-select`}
      label={label}
      value={getCurrentValue(fieldKey)}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={placeholder}
    />
  ) : (
    <Select
      dataTestId={
        dataTestId ? `${dataTestId}-sub-scopes-${fieldKey}` : undefined
      }
      id={`${fieldKey}-select`}
      label="Sub Scope"
      value={getCurrentValue(fieldKey)}
      options={options}
      placeholder={`Select a scope first`}
      disabled
    />
  );
};
