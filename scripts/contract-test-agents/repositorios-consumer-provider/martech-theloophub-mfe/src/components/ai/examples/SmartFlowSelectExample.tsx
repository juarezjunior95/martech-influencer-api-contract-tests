import { useState } from 'react';

import type { LabelValuePair } from 'models/InsightsCopilot';

import { Select } from '../components/atoms/Select';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const PROPS = [
  {
    name: 'options',
    type: 'LabelValuePair[]',
    description: 'Options to display in the dropdown',
  },
  {
    name: 'selected',
    type: 'LabelValuePair[]',
    description: 'Currently selected values',
  },
  {
    name: 'onChange',
    type: '(values: LabelValuePair[]) => void',
    description: 'Callback when selection changes',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: 'Select...',
    description: 'Placeholder text when nothing selected',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Show required indicator (*)',
  },
  {
    name: 'allowMultiSelect',
    type: 'boolean',
    default: 'false',
    description: 'Allow multiple selections',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading dots instead of options',
  },
  {
    name: 'searchable',
    type: 'boolean',
    default: 'false',
    description: 'Show search input in dropdown',
  },
];

const BRAND_OPTIONS: LabelValuePair[] = [
  { label: 'Budweiser', value: 'budweiser' },
  { label: 'Corona', value: 'corona' },
  { label: 'Stella Artois', value: 'stella' },
  { label: 'Brahma', value: 'brahma' },
  { label: 'Skol', value: 'skol' },
];

const YEAR_OPTIONS: LabelValuePair[] = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
];

export const SmartFlowSelectExample = () => {
  const [single, setSingle] = useState<LabelValuePair[]>([]);
  const [multi, setMulti] = useState<LabelValuePair[]>([]);
  const [required, setRequired] = useState<LabelValuePair[]>([]);
  const [searchable, setSearchable] = useState<LabelValuePair[]>([]);
  const [loading, setLoading] = useState<LabelValuePair[]>([]);

  return (
    <Sandbox
      title="Select"
      description="Inline dropdown for parameter selection"
      height={420}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 420px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Single select
            </div>
            <Select
              options={YEAR_OPTIONS}
              selected={single}
              onChange={setSingle}
              placeholder="year"
              dropDirection="down"
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Multi-select
            </div>
            <Select
              options={BRAND_OPTIONS}
              selected={multi}
              onChange={setMulti}
              placeholder="brands"
              allowMultiSelect
              dropDirection="down"
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Required
            </div>
            <Select
              options={BRAND_OPTIONS}
              selected={required}
              onChange={setRequired}
              placeholder="brand"
              required
              dropDirection="down"
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Searchable
            </div>
            <Select
              options={BRAND_OPTIONS}
              selected={searchable}
              onChange={setSearchable}
              placeholder="brand"
              searchable
              dropDirection="down"
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Loading
            </div>
            <Select
              options={[]}
              selected={loading}
              onChange={setLoading}
              placeholder="loading..."
              loading
              dropDirection="down"
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
