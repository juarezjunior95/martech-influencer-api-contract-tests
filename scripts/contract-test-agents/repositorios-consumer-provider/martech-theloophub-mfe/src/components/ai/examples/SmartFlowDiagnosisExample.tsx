import { useState } from 'react';

import type { LabelValuePair, SmartFlowConfig } from 'models/InsightsCopilot';

import { SmartFlowDiagnosis } from '../components/molecules/SmartFlowDiagnosis';
import { Sandbox } from '../components/organisms/Sandbox';
import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';
import { PropsTable } from './components';

const PROPS = [
  {
    name: 'flow',
    type: 'SmartFlowConfig',
    description: 'The SmartFlow config with query template and parameters',
  },
  {
    name: 'selectedParams',
    type: 'Record<string, LabelValuePair[]>',
    description: 'Currently selected values per parameter key',
  },
  {
    name: 'onParamChange',
    type: '(key: string, values: LabelValuePair[]) => void',
    description: 'Callback when a parameter selection changes',
  },
  {
    name: 'projectKey',
    type: 'string',
    description: 'Project key for async search requests',
  },
];

const MOCK_FLOW: SmartFlowConfig = {
  id: 1,
  engine_domain: 'test',
  function_name: 'get_brand_highlights',
  title: 'Brand Highlights',
  query:
    'Show me the highlights {of @brand} {in @country} {for @period} {in @year}?',
  query_parameters: {
    '@brand': {
      input_type: 'static',
      placeholder_text: 'brand',
      is_mandatory: true,
      allow_multiselect: false,
      default_options: [{ label: 'Budweiser', value: 'budweiser' }],
      static_options: [
        { label: 'Budweiser', value: 'budweiser' },
        { label: 'Corona', value: 'corona' },
        { label: 'Stella Artois', value: 'stella' },
      ],
    },
    '@country': {
      input_type: 'static',
      placeholder_text: 'country',
      is_mandatory: true,
      allow_multiselect: false,
      default_options: [{ label: 'US', value: 'us' }],
      static_options: [
        { label: 'US', value: 'us' },
        { label: 'Brazil', value: 'br' },
        { label: 'Mexico', value: 'mx' },
      ],
    },
    '@period': {
      input_type: 'static',
      placeholder_text: 'period',
      is_mandatory: false,
      allow_multiselect: false,
      default_options: [{ label: 'Q1', value: 'Q1' }],
      static_options: [
        { label: 'Q1', value: 'Q1' },
        { label: 'Q2', value: 'Q2' },
        { label: 'Q3', value: 'Q3' },
        { label: 'Q4', value: 'Q4' },
        { label: 'FY', value: 'FY' },
      ],
    },
    '@year': {
      input_type: 'static',
      placeholder_text: 'year',
      is_mandatory: false,
      allow_multiselect: false,
      default_options: [{ label: '2025', value: '2025' }],
      static_options: [
        { label: '2025', value: '2025' },
        { label: '2024', value: '2024' },
        { label: '2023', value: '2023' },
      ],
    },
  },
};

export const SmartFlowDiagnosisExample = () => {
  const [params, setParams] = useState<Record<string, LabelValuePair[]>>({
    '@brand': [{ label: 'Budweiser', value: 'budweiser' }],
    '@country': [{ label: 'US', value: 'us' }],
    '@period': [{ label: 'Q1', value: 'Q1' }],
    '@year': [{ label: '2025', value: '2025' }],
  });

  const handleChange = (key: string, values: LabelValuePair[]) => {
    setParams((prev) => ({ ...prev, [key]: values }));
  };

  return (
    <Sandbox
      title="SmartFlowDiagnosis"
      description="Inline template with embedded select dropdowns"
      height={380}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 460px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                marginBottom: 12,
              }}
            >
              With default selections
            </div>
            <SmartFlowDiagnosis
              flow={MOCK_FLOW}
              selectedParams={params}
              onParamChange={handleChange}
              projectKey={DEFAULT_CLARA_PROJECT_KEY}
            />
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                marginBottom: 12,
              }}
            >
              Empty (no selections)
            </div>
            <SmartFlowDiagnosis
              flow={MOCK_FLOW}
              selectedParams={{}}
              onParamChange={handleChange}
              projectKey={DEFAULT_CLARA_PROJECT_KEY}
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};
