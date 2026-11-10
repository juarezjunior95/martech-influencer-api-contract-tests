import { useState } from 'react';

import type { SmartFlowConfig } from 'models/InsightsCopilot';

import { Button } from '../components/atoms/Button';
import { Sandbox } from '../components/organisms/Sandbox';
import { SmartFlowOverlay } from '../components/organisms/SmartFlowOverlay';
import { PropsTable } from './components';

const PROPS = [
  {
    name: 'smartFlows',
    type: 'SmartFlowConfig[]',
    description: 'Array of SmartFlow configs to display as cards',
  },
  {
    name: 'onSelect',
    type: '(flow: SmartFlowConfig) => void',
    description: 'Callback when a SmartFlow card is clicked',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when overlay is dismissed',
  },
  {
    name: 'container',
    type: 'HTMLElement',
    description: 'Portal container (optional, renders inline if omitted)',
  },
];

const MOCK_FLOWS: SmartFlowConfig[] = [
  {
    id: 1,
    engine_domain: 'test',
    function_name: 'get_brand_highlights',
    title: 'Brand Highlights',
    query: 'Show me the highlights {of @brand} {in @country}?',
    example_query: 'Show me the highlights of Budweiser in US for Q1 in 2025?',
  },
  {
    id: 2,
    engine_domain: 'test',
    function_name: 'get_country_highlights',
    title: 'Country Highlights',
    query: 'Show me the highlights of {@country} {for @period}?',
    example_query: 'Show me the highlights of US for Q1 in 2025?',
  },
  {
    id: 3,
    engine_domain: 'test',
    function_name: 'get_kpi_trends',
    title: 'KPI Trends',
    query: 'Show @kpi trends {for @brand} {in @country}',
    example_query: 'Show Power trends for Corona in Brazil',
  },
];

export const SmartFlowOverlayExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<string>('');

  const handleSelect = (flow: SmartFlowConfig) => {
    setSelectedFlow(flow.title);
    setIsOpen(false);
  };

  return (
    <Sandbox
      title="SmartFlowOverlay"
      description="Slide-up overlay that lists available SmartFlows"
      height={480}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 460px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="primary" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Close Overlay' : 'Open Overlay'}
            </Button>
            {selectedFlow && (
              <span style={{ fontSize: 13, color: '#666' }}>
                Selected: {selectedFlow}
              </span>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              height: 380,
              background: '#f9f9fa',
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            {isOpen && (
              <SmartFlowOverlay
                smartFlows={MOCK_FLOWS}
                onSelect={handleSelect}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};
