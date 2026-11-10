import { useState } from 'react';

import { Button } from '../components/atoms/Button';
import { AddCommentAlt, Close, Refresh } from '../components/atoms/Icon';
import { ChatHeader } from '../components/molecules/ChatHeader';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const CHAT_HEADER_PROPS = [
  {
    name: 'onMenuClick',
    type: '() => void',
    description: 'Callback when the hamburger menu is clicked',
  },
  {
    name: 'actionButton',
    type: 'ReactNode',
    description: 'Action button rendered on the right side',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional CSS class for custom styling',
  },
];

export const ChatHeaderExample = () => {
  const [lastAction, setLastAction] = useState('No action yet');

  return (
    <Sandbox
      title="ChatHeader"
      description="Top bar with menu toggle and configurable action slot"
      height={460}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%', padding: 16 }}>
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
              With New Chat action
            </div>
            <ChatHeader
              onMenuClick={() => setLastAction('Menu clicked')}
              actionButton={
                <Button
                  variant="action"
                  iconMode
                  startContent={<AddCommentAlt size={18} />}
                  onClick={() => setLastAction('New Chat clicked')}
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
              With multiple actions
            </div>
            <ChatHeader
              onMenuClick={() => setLastAction('Menu clicked')}
              actionButton={
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button
                    variant="transparent"
                    iconMode
                    size="small"
                    startContent={<Refresh size={16} />}
                    onClick={() => setLastAction('Refresh clicked')}
                  />
                  <Button
                    variant="transparent"
                    iconMode
                    size="small"
                    startContent={<Close size={16} />}
                    onClick={() => setLastAction('Close clicked')}
                  />
                </div>
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
              Menu only (no action)
            </div>
            <ChatHeader onMenuClick={() => setLastAction('Menu clicked')} />
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#666',
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: 8,
            }}
          >
            Last action: <strong>{lastAction}</strong>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={CHAT_HEADER_PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};
