import { useState } from 'react';

import { SmartFlowButton } from '../components/atoms/SmartFlowButton';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const PROPS = [
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    description: 'Whether a SmartFlow is currently selected',
  },
  {
    name: 'activeTitle',
    type: 'string',
    description: 'Title of the active SmartFlow (shown when active)',
  },
  {
    name: 'onClick',
    type: '() => void',
    description: 'Callback when button is clicked',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when close icon is clicked (active state)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the button',
  },
];

export const SmartFlowButtonExample = () => {
  const [active, setActive] = useState(false);

  return (
    <Sandbox
      title="SmartFlowButton"
      description="Pill toggle for activating/deactivating SmartFlows"
      height={280}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 380px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Inactive (default)
            </div>
            <SmartFlowButton onClick={() => alert('Open overlay')} />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Active
            </div>
            <SmartFlowButton
              active
              activeTitle="Brand Highlights"
              onClick={() => alert('Toggle overlay')}
              onClose={() => alert('Close flow')}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Disabled
            </div>
            <SmartFlowButton
              onClick={() => {
                console.log('Disabled');
              }}
              disabled
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
              Interactive
            </div>
            <SmartFlowButton
              active={active}
              activeTitle="Country Highlights"
              onClick={() => setActive(true)}
              onClose={() => setActive(false)}
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
