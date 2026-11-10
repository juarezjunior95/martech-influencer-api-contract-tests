import { render, screen } from '@testing-library/react';
import type { SmartFlowConfig } from 'models/InsightsCopilot';

import { SmartFlowDiagnosis } from './SmartFlowDiagnosis';

jest.mock('redux/api/insightsCopilot', () => ({
  useGetExhaustiveValuesQuery: () => ({ data: [], isLoading: false }),
}));

const TEST_PROJECT_KEY = 'test-project';

const mockFlow: SmartFlowConfig = {
  id: 1,
  engine_domain: 'test',
  function_name: 'get_sales',
  title: 'Sales Report',
  query: 'Show sales for @brand in @region',
  query_parameters: {
    '@brand': {
      input_type: 'static',
      placeholder_text: 'Select brand',
      is_mandatory: true,
      allow_multiselect: false,
      default_options: [],
      static_options: [
        { label: 'Budweiser', value: 'bud' },
        { label: 'Corona', value: 'cor' },
      ],
    },
    '@region': {
      input_type: 'static',
      placeholder_text: 'Select region',
      is_mandatory: false,
      allow_multiselect: false,
      default_options: [{ label: 'US', value: 'us' }],
      static_options: [
        { label: 'US', value: 'us' },
        { label: 'Brazil', value: 'br' },
      ],
    },
  },
};

describe('SmartFlowDiagnosis', () => {
  it('renders template text parts', () => {
    render(
      <SmartFlowDiagnosis
        flow={mockFlow}
        selectedParams={{}}
        onParamChange={jest.fn()}
        projectKey={TEST_PROJECT_KEY}
      />,
    );
    expect(screen.getByText('Show sales for')).toBeInTheDocument();
    expect(screen.getByText('in')).toBeInTheDocument();
  });

  it('renders select dropdowns for placeholders', () => {
    render(
      <SmartFlowDiagnosis
        flow={mockFlow}
        selectedParams={{}}
        onParamChange={jest.fn()}
        projectKey={TEST_PROJECT_KEY}
      />,
    );
    expect(screen.getByText('Select brand')).toBeInTheDocument();
  });

  it('shows selected values in dropdowns', () => {
    render(
      <SmartFlowDiagnosis
        flow={mockFlow}
        selectedParams={{
          '@brand': [{ label: 'Corona', value: 'cor' }],
          '@region': [{ label: 'US', value: 'us' }],
        }}
        onParamChange={jest.fn()}
        projectKey={TEST_PROJECT_KEY}
      />,
    );
    expect(screen.getByText('Corona')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();
  });
});
