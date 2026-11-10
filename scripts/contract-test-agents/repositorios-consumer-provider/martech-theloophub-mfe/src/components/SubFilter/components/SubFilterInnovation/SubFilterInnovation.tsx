import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Select } from 'components/Form';
import { SelectProps } from 'components/Form/components/Select/types';

const MOCK_OPTIONS = [
  { label: 'Volume', value: 'volume' },
  { label: 'Volume Mix', value: 'volumeMix' },
  { label: 'Net Revenue', value: 'netRevenue' },
  { label: 'Maco', value: 'maco' },
];
interface SubFilterInnovationProps extends Omit<
  SelectProps,
  'id' | 'options' | 'onValueChange'
> {
  stateKey: string;
  dataTestId?: string;
}
export const SubFilterInnovation: React.FC<SubFilterInnovationProps> = ({
  stateKey,
  dataTestId,
  ...selectProps
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultValue = MOCK_OPTIONS[0].value;
  const initialValue = searchParams.get('kpi') || defaultValue;
  const [currentValue, setCurrentValue] = useState<string>(initialValue);
  useEffect(() => {
    const urlValue = searchParams.get('kpi');
    if (urlValue && urlValue !== currentValue) {
      setCurrentValue(urlValue);
    }
    if (!urlValue) {
      searchParams.set('kpi', defaultValue);
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handleOnChange = (selected: any) => {
    const newValue = typeof selected === 'string' ? selected : selected?.value;
    if (!newValue) return;
    setCurrentValue(newValue);
    searchParams.set('kpi', newValue);
    setSearchParams(searchParams);
  };

  return (
    <div style={{ minWidth: '160px' }} data-testid={dataTestId}>
      <Select
        id={stateKey}
        value={currentValue}
        onValueChange={handleOnChange}
        options={MOCK_OPTIONS}
        shape="pill"
        size="medium"
        aria-label={stateKey}
        data-testid={dataTestId ? `${dataTestId}-select` : undefined}
        {...selectProps}
      />
    </div>
  );
};
