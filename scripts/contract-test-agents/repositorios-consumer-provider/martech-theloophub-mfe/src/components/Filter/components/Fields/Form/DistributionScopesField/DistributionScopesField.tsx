import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

import {
  StyledFieldContainer,
  StyledFieldLabel,
} from './DistributionScopesField.styles';

export const DistributionScopesField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const options = useMemo(() => {
    return FilterDataAccessor.getInstance().getOptions(
      fieldKey,
      dataFilters,
      {},
    );
  }, [fieldKey, dataFilters]);

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Distribution Scope Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });
    onValueChange(fieldKey, option);
  };

  return (
    <StyledFieldContainer
      data-testid={dataTestId ? `distribution-scopes-${dataTestId}` : undefined}
    >
      <StyledFieldLabel
        data-testid={
          dataTestId ? `${dataTestId}-distribution-scopes-label` : undefined
        }
      >
        Distribution Scope
      </StyledFieldLabel>
      <ChipsSelect
        dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
        value={getCurrentValue(fieldKey)}
        onChange={(option: Option) => handleValueChange(option)}
        options={options as Option[]}
      />
    </StyledFieldContainer>
  );
};
