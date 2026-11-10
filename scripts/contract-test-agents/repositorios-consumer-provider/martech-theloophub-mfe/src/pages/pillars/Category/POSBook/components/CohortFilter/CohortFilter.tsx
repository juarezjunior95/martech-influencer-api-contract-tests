import React, { useEffect } from 'react';

import { Select } from 'components';
import { useSubFilters } from 'hooks';
import { Option } from 'models/Filters';

type optionProps = {
  group: string;
  values: {
    value: string;
    label: string;
  }[];
};

interface CohortFilterProps {
  defaultValue?: string;
  filterCohort?: string;
  selectLabel?: string;
  labelIsSelected?: string;
  onChange: (value: string) => void;
  allowItemRemoval?: boolean;
  options?: optionProps[];
  dataTestId?: string;
}

export const CohortFilter: React.FC<CohortFilterProps> = ({
  defaultValue = '',
  filterCohort = 'cohorts',
  selectLabel = 'Select a Cohort',
  labelIsSelected = 'Cohort',
  onChange,
  allowItemRemoval = true,
  options,
  dataTestId,
}) => {
  const {
    activeSubFilters,
    subFiltersData,
    subFiltersLoaded,
    loadSubFilterData,
    setSubFilterValue,
    setSubFilterInUse,
    ALL_VALUE,
  } = useSubFilters();

  const filterName = filterCohort;

  useEffect(() => {
    loadSubFilterData(filterName);
  }, [loadSubFilterData]);

  const handleCohortChange = (op: Option) => {
    const value = op.value as string;
    setSubFilterValue(filterName, value || ALL_VALUE);
    setSubFilterInUse(filterName, !!value && value !== ALL_VALUE);
    onChange(value);
  };

  const cohortsValues = subFiltersData?.[filterName]?.values || [];

  useEffect(() => {
    if (subFiltersLoaded?.[filterName] && cohortsValues.length > 0) {
      handleCohortChange({ value: defaultValue, label: '' });
    }
  }, [subFiltersLoaded, cohortsValues.length]);

  return (
    <div style={{ minWidth: '200px' }}>
      <Select
        id={filterName}
        defaultValue={defaultValue}
        value={
          activeSubFilters[filterName] === 'All'
            ? ''
            : activeSubFilters[filterName]
        }
        options={options || cohortsValues}
        shape="pill"
        size="medium"
        onValueChange={handleCohortChange}
        valueLabel={
          activeSubFilters[filterName] === 'All' ? selectLabel : labelIsSelected
        }
        chips
        placeholder=""
        clearChips={allowItemRemoval}
        dataTestId={dataTestId ? `${dataTestId}-filter-cohort` : undefined}
      />
    </div>
  );
};
