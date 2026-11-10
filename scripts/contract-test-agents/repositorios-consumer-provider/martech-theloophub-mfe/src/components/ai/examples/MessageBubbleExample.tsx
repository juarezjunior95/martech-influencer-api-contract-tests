import { MessageBubble } from '../components/molecules/MessageBubble';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const MESSAGE_BUBBLE_PROPS = [
  {
    name: 'position',
    type: "'user' | 'assistant'",
    description: 'Define o lado e estilo da mensagem',
  },
  {
    name: 'status',
    type: "'default' | 'thinking' | 'failed' | 'error'",
    default: "'default'",
    description: 'Estado atual da mensagem',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Conteúdo da mensagem',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback do botão "Try again"',
  },
  {
    name: 'errorMessage',
    type: 'string',
    description: 'Mensagem de erro customizada',
  },
];

export const MessageBubbleExample = () => {
  return (
    <Sandbox
      title="MessageBubble"
      description="Bolhas de mensagem para chat com estados de erro"
      background="light"
      height={580}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 520px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* User Messages */}
          <section>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 13,
                color: '#666',
                fontWeight: 500,
              }}
            >
              User Messages
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'flex-end',
              }}
            >
              <MessageBubble position="user">
                What were the Top 5 regions in Brazil in terms of ABI Brand
                Power in 2024?
              </MessageBubble>

              <MessageBubble position="user" status="failed">
                What were the Top 5 regions in Brazil in terms of ABI Brand
                Power in 2024?
              </MessageBubble>
            </div>
          </section>

          {/* Assistant Messages */}
          <section>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 13,
                color: '#666',
                fontWeight: 500,
              }}
            >
              Assistant Messages
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <MessageBubble position="assistant" status="thinking" />

              <MessageBubble
                position="assistant"
                status="error"
                onRetry={() => alert('Retry clicked')}
              />
            </div>
          </section>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={MESSAGE_BUBBLE_PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};
