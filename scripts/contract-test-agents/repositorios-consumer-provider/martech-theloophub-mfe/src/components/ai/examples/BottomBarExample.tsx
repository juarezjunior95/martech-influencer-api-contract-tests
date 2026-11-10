import { useState } from 'react';

import { SmartFlowButton } from '../components/atoms/SmartFlowButton';
import { BottomBar } from '../components/molecules/BottomBar';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const BOTTOM_BAR_PROPS = [
  {
    name: 'inputValue',
    type: 'string',
    description: 'Current text input value',
  },
  {
    name: 'onInputChange',
    type: '(value: string) => void',
    description: 'Callback when the input value changes',
  },
  {
    name: 'onSubmit',
    type: '(text: string) => void',
    description: 'Callback when the user submits a message',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Disables input and submit during loading',
  },
  {
    name: 'isDisabled',
    type: 'boolean',
    default: 'false',
    description: 'Shows "Start new chat" button instead of input',
  },
  {
    name: 'showDiagnosis',
    type: 'boolean',
    default: 'false',
    description: 'Enables SmartFlow diagnosis mode in TextArea',
  },
  {
    name: 'diagnosisContent',
    type: 'ReactNode',
    description: 'Diagnosis content rendered inside the TextArea top slot',
  },
  {
    name: 'smartFlowButton',
    type: 'ReactNode',
    description: 'SmartFlow button rendered at the start of TextArea',
  },
  {
    name: 'canSubmit',
    type: 'boolean',
    description: 'Controls submit availability in diagnosis mode',
  },
  {
    name: 'onNewChat',
    type: '() => void',
    description: 'Callback for the "Start new chat" button (disabled state)',
  },
];

export const BottomBarExample = () => {
  const [defaultValue, setDefaultValue] = useState('');
  const [loadingValue, setLoadingValue] = useState(
    'Analyzing brand performance...',
  );
  const [smartFlowValue, setSmartFlowValue] = useState('');

  return (
    <Sandbox
      title="BottomBar"
      description="Input area with hint, text field, disclaimer and multiple states"
      height={680}
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
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                padding: '12px 16px 0',
              }}
            >
              Default
            </div>
            <BottomBar
              inputValue={defaultValue}
              onInputChange={setDefaultValue}
              onSubmit={(text) => {
                alert(`Submitted: ${text}`);
                setDefaultValue('');
              }}
            />
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                padding: '12px 16px 0',
              }}
            >
              Loading (input disabled)
            </div>
            <BottomBar
              inputValue={loadingValue}
              onInputChange={setLoadingValue}
              onSubmit={() => undefined}
              isLoading
            />
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                padding: '12px 16px 0',
              }}
            >
              With SmartFlow button
            </div>
            <BottomBar
              inputValue={smartFlowValue}
              onInputChange={setSmartFlowValue}
              onSubmit={(text) => {
                alert(`Submitted: ${text}`);
                setSmartFlowValue('');
              }}
              smartFlowButton={
                <SmartFlowButton
                  active={false}
                  onClick={() => alert('SmartFlow overlay toggled')}
                />
              }
            />
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#666',
                padding: '12px 16px 0',
              }}
            >
              Disabled (abandoned conversation)
            </div>
            <BottomBar
              inputValue=""
              onInputChange={() => undefined}
              onSubmit={() => undefined}
              isDisabled
              onNewChat={() => alert('New chat started')}
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={BOTTOM_BAR_PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};
