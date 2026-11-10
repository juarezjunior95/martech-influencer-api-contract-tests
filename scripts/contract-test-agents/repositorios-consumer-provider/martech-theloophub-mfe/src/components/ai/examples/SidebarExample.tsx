import { useState } from 'react';

import { AddCommentAlt } from '../components/atoms/Icon';
import { Sandbox } from '../components/organisms/Sandbox';
import { Sidebar } from '../components/organisms/Sidebar';
import { PropsTable } from './components';

const MOCK_CONVERSATIONS = [
  { id: '1', title: 'Top 5 Regions in Brazil by ABI Brand P...' },
  { id: '2', title: 'Brand power by zones' },
  { id: '3', title: 'Top 3 Brands in Brazil' },
  { id: '4', title: 'Brand power by region' },
  { id: '5', title: 'Budlight performance report' },
  { id: '6', title: '2023 power by beer brand' },
];

const SIDEBAR_PROPS = [
  {
    name: 'conversations',
    type: 'Conversation[]',
    description: 'Lista de conversas',
  },
  {
    name: 'activeConversationId',
    type: 'string',
    description: 'ID da conversa ativa',
  },
  {
    name: 'onNewChat',
    type: '() => void',
    description: 'Callback ao clicar em New Chat',
  },
  {
    name: 'onConversationClick',
    type: '(conversation) => void',
    description: 'Callback ao clicar em uma conversa',
  },
  {
    name: 'onConversationRename',
    type: '(conversation) => void',
    description: 'Callback ao renomear uma conversa',
  },
  {
    name: 'onConversationDelete',
    type: '(conversation) => void',
    description: 'Callback ao deletar uma conversa',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback ao fechar sidebar',
  },
  {
    name: 'newChatIcon',
    type: 'ReactNode',
    description: 'Ícone do botão New Chat',
  },
];

const CONVERSATION_ITEM_PROPS = [
  { name: 'id', type: 'string', description: 'ID único da conversa' },
  { name: 'title', type: 'string', description: 'Título da conversa' },
  {
    name: 'isActive',
    type: 'boolean',
    default: 'false',
    description: 'Se está ativa',
  },
  { name: 'onClick', type: '() => void', description: 'Callback ao clicar' },
  {
    name: 'onRename',
    type: '() => void',
    description: 'Callback ao renomear',
  },
  {
    name: 'onDelete',
    type: '() => void',
    description: 'Callback ao deletar',
  },
];

export const SidebarExample = () => {
  const [activeId, setActiveId] = useState<string | undefined>('1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Sandbox
        title="Sidebar"
        description="Sidebar com histórico de conversas e botão New Chat"
        background="dots"
        height={500}
        padding={0}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          <Sidebar
            conversations={MOCK_CONVERSATIONS}
            activeConversationId={activeId}
            newChatIcon={<AddCommentAlt size={18} />}
            onNewChat={() => {
              setActiveId(undefined);
              alert('New Chat clicked!');
            }}
            onConversationClick={(conversation) => {
              setActiveId(conversation.id);
              alert(`Clicked: ${conversation.title}`);
            }}
            onConversationRename={(conversation) => {
              alert(`Rename: ${conversation.title}`);
            }}
            onConversationDelete={(conversation) => {
              alert(`Delete: ${conversation.title}`);
            }}
            onClose={() => alert('Close clicked!')}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              color: '#999',
            }}
          >
            Chat Area
          </div>
        </div>
      </Sandbox>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            Sidebar
          </h4>
          <PropsTable props={SIDEBAR_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            ConversationItem
          </h4>
          <PropsTable props={CONVERSATION_ITEM_PROPS} />
        </div>
      </div>
    </div>
  );
};
