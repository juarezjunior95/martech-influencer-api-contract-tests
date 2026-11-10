import { Chip, SegmentedControl } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons';
import { Expand, Tag } from 'components';

const handleValueChange = (value: boolean | string) => {
  return value;
};

export const MockSegmentedControl = () => {
  return (
    <SegmentedControl
      options={[
        { label: 'Label 1', value: 'view1' },
        { label: 'Label 2', value: 'view2' },
      ]}
      onValueChange={handleValueChange}
      value="view1"
    />
  );
};

export const MockLabel = () => {
  return (
    <Chip.Root>
      <Chip.Label>Label 1</Chip.Label>
    </Chip.Root>
  );
};

export const MockCalendarTag = () => {
  return <Tag Icon={CalendarClock} text={`: Dec - 2024`} />;
};

export const MockExpand = () => {
  return <Expand onValueChange={handleValueChange} value={false} />;
};
