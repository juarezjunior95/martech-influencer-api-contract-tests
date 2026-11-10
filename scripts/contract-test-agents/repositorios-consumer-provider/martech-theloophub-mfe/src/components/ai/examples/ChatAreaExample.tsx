import { useCallback, useState } from 'react';

import type { Message, SmartFlowConfig } from 'models/InsightsCopilot';

import { Button } from '../components/atoms/Button';
import { AddCommentAlt } from '../components/atoms/Icon';
import { ChatHeader } from '../components/molecules/ChatHeader';
import { ChatArea } from '../components/organisms/ChatArea';
import { Sandbox } from '../components/organisms/Sandbox';
import type { FAQ } from '../types';
import { createAssistantMessage, createUserMessage } from '../utils';
import { PropsTable } from './components';

const CHAT_AREA_ROOT_PROPS = [
  {
    name: 'messages',
    type: 'Message[]',
    description: 'Array of chat messages (user + assistant)',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Shows loading indicator on the last assistant message',
  },
  {
    name: 'isAbandoned',
    type: 'boolean',
    default: 'false',
    description: 'Switches BottomBar to disabled "Start new chat" mode',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Compound children: Content, Welcome, Messages, Input',
  },
];

const CHAT_AREA_WELCOME_PROPS = [
  {
    name: 'faqs',
    type: 'FAQ[]',
    description: 'Suggested questions shown in the welcome screen',
  },
  {
    name: 'onFAQClick',
    type: '(faq: FAQ) => void',
    description: 'Callback when a FAQ card is clicked',
  },
  {
    name: 'smartFlows',
    type: 'SmartFlowConfig[]',
    description: 'SmartFlow cards shown in the welcome screen',
  },
  {
    name: 'onSmartFlowClick',
    type: '(flow: SmartFlowConfig) => void',
    description: 'Callback when a SmartFlow card is clicked',
  },
  {
    name: 'onRetryFAQs',
    type: '() => void',
    description: 'Retry callback for FAQ error state',
  },
  {
    name: 'onRetrySmartFlows',
    type: '() => void',
    description: 'Retry callback for SmartFlow error state',
  },
  {
    name: 'loadingFAQs',
    type: 'boolean',
    description: 'Shows loading skeleton for FAQ section',
  },
  {
    name: 'loadingSmartFlows',
    type: 'boolean',
    description: 'Shows loading skeleton for SmartFlow section',
  },
];

const CHAT_AREA_MESSAGES_PROPS = [
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback for the retry button on failed messages',
  },
  {
    name: 'feedback',
    type: 'FeedbackHandlers',
    description: 'Handlers for thumbs up/down and copy actions',
  },
  {
    name: 'streamingSteps',
    type: 'AgentStepEvent[]',
    description: 'Live execution log steps during streaming',
  },
  {
    name: 'streamingStatus',
    type: "'idle' | 'streaming' | 'complete'",
    description: 'Current status of the agent execution stream',
  },
];

const CHAT_AREA_INPUT_PROPS = [
  {
    name: 'value',
    type: 'string',
    description: 'Current input text value',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    description: 'Callback when input value changes',
  },
  {
    name: 'onSubmit',
    type: '(text: string) => void',
    description: 'Callback when the user submits a message',
  },
  {
    name: 'showDiagnosis',
    type: 'boolean',
    description: 'Enables SmartFlow diagnosis mode',
  },
  {
    name: 'onNewChat',
    type: '() => void',
    description: 'Callback for new chat button (abandoned state)',
  },
];

const MOCK_FAQS: FAQ[] = [
  {
    id: '1',
    project_key: 'demo',
    query: 'What were the Top 5 regions in Brazil by ABI Brand Power in 2024?',
    language: 'en',
    group_id: 'g1',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
  {
    id: '2',
    project_key: 'demo',
    query: 'How did Corona perform compared to Budweiser in Mexico?',
    language: 'en',
    group_id: 'g1',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
  {
    id: '3',
    project_key: 'demo',
    query: 'Why did Salience drop for Stella Artois in 2024?',
    language: 'en',
    group_id: 'g1',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
];

const MOCK_SMART_FLOWS: SmartFlowConfig[] = [
  {
    id: 1,
    engine_domain: 'demo',
    function_name: 'get_brand_highlights',
    title: 'Brand Highlights',
    query: 'Show me the highlights {of @brand} {in @country}?',
    example_query: 'Show me highlights of Budweiser in US?',
  },
  {
    id: 2,
    engine_domain: 'demo',
    function_name: 'get_country_highlights',
    title: 'Country Highlights',
    query: 'Show me the highlights of {@country} {for @period}?',
    example_query: 'Show me the highlights of US for Q1 in 2025?',
  },
  {
    id: 3,
    engine_domain: 'demo',
    function_name: 'get_kpi_trends',
    title: 'KPI Trends',
    query: 'Show @kpi trends {for @brand} {in @country}',
    example_query: 'Show Power trends for Corona in Brazil',
  },
];

const MOCK_CONVERSATION: Message[] = [
  createUserMessage(
    'What were the Top 5 regions in Brazil by ABI Brand Power in 2024?',
  ),
  {
    ...createAssistantMessage(
      '# Top 5 Regions by ABI Brand Power (2024)\n\n' +
        '| Rank | Region | Brand Power |\n' +
        '|------|--------|------------|\n' +
        '| 1 | Southeast | 142.3 |\n' +
        '| 2 | South | 138.7 |\n' +
        '| 3 | Northeast | 125.1 |\n' +
        '| 4 | Central-West | 118.9 |\n' +
        '| 5 | North | 112.4 |\n\n' +
        'The **Southeast** region leads with a brand power score of **142.3**, ' +
        'driven primarily by strong Salience and Meaningfulness metrics.',
    ),
    requestId: 'req-1',
  },
  createUserMessage('How does this compare to 2023?'),
  {
    ...createAssistantMessage(
      'Comparing 2024 vs 2023, the **Southeast** region showed a **+3.2%** increase in Brand Power, ' +
        'while the **North** region experienced the highest growth at **+5.8%**. ' +
        'The overall trend indicates strengthening brand presence across all five regions.',
    ),
    requestId: 'req-2',
  },
];

type Mode =
  | 'welcome'
  | 'conversation'
  | 'loading'
  | 'abandoned'
  | 'err-faq'
  | 'err-flows'
  | 'err-both'
  | 'empty-faq'
  | 'empty-flows'
  | 'empty-both';

const MAIN_MODES: Mode[] = ['welcome', 'conversation', 'loading', 'abandoned'];
const ERR_MODES: Mode[] = ['err-faq', 'err-flows', 'err-both'];
const EMPTY_MODES: Mode[] = ['empty-faq', 'empty-flows', 'empty-both'];

const MODE_LABELS: Record<Mode, string> = {
  welcome: 'Welcome',
  conversation: 'Conversation',
  loading: 'Loading',
  abandoned: 'Abandoned',
  'err-faq': 'FAQ',
  'err-flows': 'Flows',
  'err-both': 'Both',
  'empty-faq': 'FAQ',
  'empty-flows': 'Flows',
  'empty-both': 'Both',
};

export const ChatAreaExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('welcome');

  const handleSubmit = useCallback((text: string) => {
    const userMsg = createUserMessage(text);
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const reply = {
        ...createAssistantMessage(
          `That's a great question about "${text}". ` +
            'Here is a simulated response from the assistant.',
        ),
        requestId: `req-${Date.now()}`,
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFAQClick = useCallback(
    (faq: FAQ) => {
      handleSubmit(faq.query);
    },
    [handleSubmit],
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
    setMode('welcome');
  }, []);

  const faqFailed =
    mode === 'err-faq' ||
    mode === 'err-both' ||
    mode === 'empty-faq' ||
    mode === 'empty-both';
  const flowsFailed =
    mode === 'err-flows' ||
    mode === 'err-both' ||
    mode === 'empty-flows' ||
    mode === 'empty-both';
  const isErrorMode = mode.startsWith('err-');

  const welcomeFaqs = faqFailed ? [] : MOCK_FAQS;
  const welcomeFlows = flowsFailed ? [] : MOCK_SMART_FLOWS;
  const retryFaqs =
    isErrorMode && faqFailed ? () => alert('Retry FAQs') : undefined;
  const retryFlows =
    isErrorMode && flowsFailed ? () => alert('Retry Smart Flows') : undefined;

  const getDisplayMessages = (): Message[] => {
    if (mode === 'conversation') return MOCK_CONVERSATION;
    if (mode === 'loading') {
      return [createUserMessage('What is the brand power trend for Corona?')];
    }
    if (mode === 'abandoned') return MOCK_CONVERSATION;
    return messages;
  };

  const displayMessages = getDisplayMessages();
  const displayLoading = mode === 'loading' || isLoading;
  const displayAbandoned = mode === 'abandoned';

  const renderBadge = (m: Mode) => (
    <button
      key={m}
      onClick={() => {
        setMode(m);
        if (m === 'welcome' || m.startsWith('err-') || m.startsWith('empty-')) {
          setMessages([]);
          setIsLoading(false);
        }
      }}
      style={{
        padding: '4px 10px',
        borderRadius: 16,
        border: mode === m ? '1px solid #E5B611' : '1px solid rgba(0,0,0,0.12)',
        background: mode === m ? 'rgba(229,182,17,0.08)' : '#fff',
        color: mode === m ? '#B8920E' : '#666',
        fontSize: 11,
        fontWeight: mode === m ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {MODE_LABELS[m]}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Sandbox
        title="ChatArea (Compound)"
        description="Full chat layout with Welcome, Messages and Input sub-components"
        height={768}
        padding={0}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            maxWidth: 554,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '8px 12px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              flexShrink: 0,
              alignItems: 'center',
            }}
          >
            {MAIN_MODES.map(renderBadge)}
            <span
              style={{
                fontSize: 10,
                color: '#999',
                fontWeight: 600,
                borderLeft: '1px solid rgba(0,0,0,0.12)',
                paddingLeft: 8,
                marginLeft: 2,
              }}
            >
              Err:
            </span>
            {ERR_MODES.map(renderBadge)}
            <span
              style={{
                fontSize: 10,
                color: '#999',
                fontWeight: 600,
                borderLeft: '1px solid rgba(0,0,0,0.12)',
                paddingLeft: 8,
                marginLeft: 2,
              }}
            >
              Empty:
            </span>
            {EMPTY_MODES.map(renderBadge)}
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
            }}
          >
            <ChatHeader
              onMenuClick={() => alert('Menu clicked')}
              actionButton={
                <Button
                  variant="action"
                  iconMode
                  startContent={<AddCommentAlt size={18} />}
                  onClick={handleNewChat}
                />
              }
            />
            <ChatArea
              messages={displayMessages}
              isLoading={displayLoading}
              isAbandoned={displayAbandoned}
            >
              <ChatArea.Content>
                <ChatArea.Welcome
                  faqs={welcomeFaqs}
                  onFAQClick={handleFAQClick}
                  smartFlows={welcomeFlows}
                  onSmartFlowClick={(flow) =>
                    alert(`SmartFlow clicked: ${flow.title}`)
                  }
                  onRetryFAQs={retryFaqs}
                  onRetrySmartFlows={retryFlows}
                />
                <ChatArea.Messages
                  onRetry={() => alert('Retry clicked')}
                  feedback={{
                    onThumbUp: (msgId) => alert(`Thumbs up: ${msgId}`),
                    onThumbDown: (msgId) => alert(`Thumbs down: ${msgId}`),
                  }}
                />
              </ChatArea.Content>
              <ChatArea.Input
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                onNewChat={handleNewChat}
              />
            </ChatArea>
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
            ChatArea (Root)
          </h4>
          <PropsTable props={CHAT_AREA_ROOT_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            ChatArea.Welcome
          </h4>
          <PropsTable props={CHAT_AREA_WELCOME_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            ChatArea.Messages
          </h4>
          <PropsTable props={CHAT_AREA_MESSAGES_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            ChatArea.Input
          </h4>
          <PropsTable props={CHAT_AREA_INPUT_PROPS} />
        </div>
      </div>
    </div>
  );
};
