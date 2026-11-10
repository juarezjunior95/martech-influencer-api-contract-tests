import { StackedAreaContainer } from 'components';
import {
  edgeCaseManyColumnsData,
  edgeCaseStartingData,
  edgeCaseStartingMiddleZeroData,
  edgeCaseStoppingData,
} from 'components/Chart/StackedArea/__mocks';
import { StackedAreaSize } from 'components/Chart/StackedArea/types';
import { StackedAreaResponse } from 'components/Chart/StackedArea/types';

interface StackedAreaExampleItemProps {
  label: string;
  response: StackedAreaResponse;
  size?: StackedAreaSize;
}

const StackedAreaExampleItem = ({
  label,
  response,
  size,
}: StackedAreaExampleItemProps) => (
  <>
    <h3>{label}</h3>
    <StackedAreaContainer
      dataTestId={`stacked-area-example-${label}`}
      data={response.chartData}
      size={size}
      containerHeader={{
        title: response.title,
        subtitle: response.subtitle,
        titleSize: 'H4',
      }}
    />
  </>
);

const EXAMPLES: StackedAreaExampleItemProps[] = [
  { label: 'Small', response: edgeCaseStartingData, size: 'small' },
  { label: 'Medium', response: edgeCaseStartingMiddleZeroData },
  { label: 'Large', response: edgeCaseStoppingData, size: 'large' },
  {
    label: 'Responsive',
    response: edgeCaseManyColumnsData,
    size: 'responsive',
  },
];

export const StackedAreaExample = () => (
  <>
    {EXAMPLES.map(({ label, response, size }) => (
      <StackedAreaExampleItem
        key={label}
        label={label}
        response={response}
        size={size}
      />
    ))}
  </>
);
