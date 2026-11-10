import { fireEvent, render, screen } from '@testing-library/react';
import type { SmartFlowConfig } from 'models/InsightsCopilot';

import type { FAQ, Message } from '../../../types';
import { ChatArea } from './ChatArea';

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  Element.prototype.scrollTo = jest.fn();
});

jest.mock('redux/api/insightsCopilot', () => ({
  useLazyGetBlobMarkdownQuery: () => [jest.fn(), {}],
}));

jest.mock('../../atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
}));

jest.mock('../../organisms/ExecutionLog', () => ({
  ExecutionLog: () => null,
  toAgentStep: () => null,
}));

jest.mock('../../molecules/MessageContent', () => ({
  MessageContent: ({ message }: { message: { content: string } }) => (
    <div>{message.content}</div>
  ),
}));

jest.mock('../../molecules/FeedbackActions', () => ({
  FeedbackActions: () => null,
}));

const renderChatArea = ({
  messages = [] as Message[],
  faqs,
  smartFlows,
  loadingSmartFlows,
  loadingFAQs,
  isLoading,
  inputValue = '',
  onInputChange = jest.fn(),
  onSubmit = jest.fn(),
}: {
  messages?: Message[];
  faqs?: FAQ[];
  smartFlows?: SmartFlowConfig[];
  loadingSmartFlows?: boolean;
  loadingFAQs?: boolean;
  isLoading?: boolean;
  inputValue?: string;
  onInputChange?: (v: string) => void;
  onSubmit?: (t: string) => void;
}) =>
  render(
    <ChatArea messages={messages} isLoading={isLoading}>
      <ChatArea.Content>
        <ChatArea.Welcome
          faqs={faqs}
          smartFlows={smartFlows}
          loadingSmartFlows={loadingSmartFlows}
          loadingFAQs={loadingFAQs}
        />
        <ChatArea.Messages />
      </ChatArea.Content>
      <ChatArea.Input
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </ChatArea>,
  );

const mockFaqs: FAQ[] = [
  {
    id: 'faq-1',
    query: 'What is the MDS?',
    project_key: 'proj',
    language: 'en',
    group_id: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'faq-2',
    query: 'How are sales?',
    project_key: 'proj',
    language: 'en',
    group_id: '',
    created_at: '',
    updated_at: '',
  },
];

const mockSmartFlows: SmartFlowConfig[] = [
  {
    id: 1,
    engine_domain: 'brand',
    function_name: 'country_highlights',
    title: 'Country Highlights',
    query: 'Show country highlights',
  },
  {
    id: 2,
    engine_domain: 'brand',
    function_name: 'brand_highlights',
    title: 'Brand Highlights',
    query: 'Show brand highlights',
  },
  {
    id: 3,
    engine_domain: 'brand',
    function_name: 'portfolio_highlights',
    title: 'Portfolio Highlights',
    query: 'Show portfolio highlights',
  },
];

describe('ChatArea', () => {
  it('should render the input area', () => {
    renderChatArea({});
    expect(screen.getByPlaceholderText('Ask a question')).toBeInTheDocument();
  });

  it('should show FAQs when there are no messages', () => {
    renderChatArea({ faqs: mockFaqs });
    expect(screen.getByText('What is the MDS?')).toBeInTheDocument();
    expect(screen.getByText('How are sales?')).toBeInTheDocument();
  });

  it('should show FAQ section title', () => {
    renderChatArea({ faqs: mockFaqs });
    expect(screen.getByText('Some questions you can ask')).toBeInTheDocument();
  });

  it('should limit FAQs to two items and navigate the carousel', () => {
    const faqs = [
      ...mockFaqs,
      {
        id: 'faq-3',
        query: 'Which brands are growing fastest?',
        project_key: 'proj',
        language: 'en',
        group_id: '',
        created_at: '',
        updated_at: '',
      },
    ];

    renderChatArea({ faqs });

    expect(screen.getByText('What is the MDS?')).toBeInTheDocument();
    expect(screen.getByText('How are sales?')).toBeInTheDocument();
    expect(
      screen.queryByText('Which brands are growing fastest?'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Some questions you can ask next'));

    expect(screen.queryByText('What is the MDS?')).not.toBeInTheDocument();
    expect(
      screen.getByText('Which brands are growing fastest?'),
    ).toBeInTheDocument();
  });

  it('should limit Smart Flows to two items and navigate the carousel', () => {
    renderChatArea({ smartFlows: mockSmartFlows });

    expect(screen.getByText('Country Highlights')).toBeInTheDocument();
    expect(screen.getByText('Brand Highlights')).toBeInTheDocument();
    expect(screen.queryByText('Portfolio Highlights')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Suggested Smart Flows next'));

    expect(screen.queryByText('Country Highlights')).not.toBeInTheDocument();
    expect(screen.getByText('Portfolio Highlights')).toBeInTheDocument();
  });

  it('should hide FAQs when there are messages', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: '' },
    ];
    renderChatArea({ messages, faqs: mockFaqs });
    expect(
      screen.queryByText('Some questions you can ask'),
    ).not.toBeInTheDocument();
  });

  it('should render messages when present', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: '' },
      { id: '2', role: 'assistant', content: 'Hi there', timestamp: '' },
    ];
    renderChatArea({ messages });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should show empty state when faqs array is empty', () => {
    renderChatArea({ faqs: [] });
    expect(screen.getByText('Some questions you can ask')).toBeInTheDocument();
    expect(screen.getAllByText('Suggestions unavailable.')).toHaveLength(2);
  });

  it('should show Smart Flows skeleton while suggestions reload', () => {
    renderChatArea({ faqs: mockFaqs, loadingSmartFlows: true });
    expect(screen.getByText('Suggested Smart Flows')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('should show questions skeleton while FAQs reload', () => {
    renderChatArea({ loadingFAQs: true });
    expect(screen.getByText('Some questions you can ask')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });
});
