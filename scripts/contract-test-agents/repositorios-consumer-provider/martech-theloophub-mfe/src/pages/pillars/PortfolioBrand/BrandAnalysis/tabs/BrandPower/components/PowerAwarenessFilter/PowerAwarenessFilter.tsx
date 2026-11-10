import { useIntl } from 'react-intl';

import { BarChart2 } from '@hexa-ui/icons2';
import { Select } from 'components';
import { Option } from 'models/Filters';

import { unaidedAwarenessOptions } from '../../constants';

interface PowerAwarenessFilterProps {
  value: string;
  onChange: (op: Option) => void;
  dataTestId?: string;
}

export const PowerAwarenessFilter: React.FC<PowerAwarenessFilterProps> = ({
  value,
  onChange,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Select
      id="powerAwarenessFilter"
      size="medium"
      shape="pill"
      icon={BarChart2}
      placeholder={formatMessage({
        id: 'PortfolioBrand.BrandPower.kpis.powerAwareness.unaided-awareness.title',
        defaultMessage: '',
      })}
      onValueChange={onChange}
      value={value}
      options={unaidedAwarenessOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
        isDisabled: opt.disabled,
      }))}
      dataTestId={dataTestId}
    />
  );
};
