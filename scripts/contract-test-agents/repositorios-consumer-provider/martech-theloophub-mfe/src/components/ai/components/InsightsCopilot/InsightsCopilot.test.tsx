import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { InsightsCopilot } from './InsightsCopilot';

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const mockUseFeatureToggle = jest.fn();

jest.mock('../../hooks', () => {
  const { useClaraDomain } = jest.requireActual(
    '../../hooks/useClaraDomain/useClaraDomain',
  );

  return {
    useClaraDomain,
    useConversationHistory: () => ({
      sidebarConversations: [],
      refetch: jest.fn(),
      isLoading: false,
    }),
    useConversations: () => ({
      requestDelete: jest.fn(),
      confirmDelete: jest.fn(),
      cancelDelete: jest.fn(),
      rename: jest.fn(),
      isDeleteModalOpen: false,
    }),
    useFAQs: () => ({
      items: [],
      handleClick: jest.fn(),
    }),
    useFeedback: () => ({
      getSentiment: jest.fn(),
      handleThumbUp: jest.fn(),
      handleThumbDown: jest.fn(),
      handleCopy: jest.fn(),
      handleModalSubmit: jest.fn(),
      handleModalClose: jest.fn(),
      modalState: null,
    }),
    useMessaging: () => ({
      sendMessage: jest.fn(),
      retryLastMessage: jest.fn(),
      newChat: jest.fn(),
      loadConversation: jest.fn(),
      messages: [],
      conversationId: null,
      loading: false,
      lastFailedQuery: null,
      progress: null,
      streamingSteps: [],
      streamingStatus: 'idle',
      isAbandoned: false,
      isWebSocketConnected: false,
    }),
    useSmartFlow: () => ({
      items: [],
      activeFlow: null,
      selectFlow: jest.fn(),
      clearFlow: jest.fn(),
      selectedParams: {},
      setParamValues: jest.fn(),
      requiredFields: [],
      resolvedQuery: '',
      isReadyToSend: false,
      smartFlowSendParams: null,
      showOverlay: false,
      setShowOverlay: jest.fn(),
      showDiagnosis: false,
      trySend: jest.fn(() => false),
    }),
  };
});

jest.mock('hooks/useFeatureToggle', () => ({
  useFeatureToggle: () => mockUseFeatureToggle(),
}));

jest.mock('../atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => <div>{content}</div>,
}));

function MockWelcome() {
  return null;
}

function MockMessages() {
  return null;
}

jest.mock('../organisms/ChatArea', () => {
  function MockChatArea({ children }: any) {
    return <div data-testid="chat-area">{children}</div>;
  }
  function MockContent({ children }: any) {
    return <div>{children}</div>;
  }
  function MockInput({ claraDomainDropdown }: any) {
    return <div data-testid="chat-input">{claraDomainDropdown}</div>;
  }
  MockChatArea.Content = MockContent;
  MockChatArea.Welcome = MockWelcome;
  MockChatArea.Messages = MockMessages;
  MockChatArea.Input = MockInput;
  return { ChatArea: MockChatArea };
});

jest.mock('../organisms/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

const renderWithRouter = (
  ui: ReactElement,
  initialEntry = '/portfolio-brand',
) =>
  render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      {ui}
    </MemoryRouter>,
  );

describe('InsightsCopilot', () => {
  beforeEach(() => {
    mockUseFeatureToggle.mockReturnValue([true, false]);
  });

  it('should render the drawer trigger', () => {
    renderWithRouter(<InsightsCopilot />);
    expect(screen.getByText('Ask Clara')).toBeInTheDocument();
  });

  it('should render the menu button when open', () => {
    renderWithRouter(<InsightsCopilot defaultOpen />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('should render the new chat button when open', () => {
    renderWithRouter(<InsightsCopilot defaultOpen />);
    expect(screen.getByLabelText('New Chat')).toBeInTheDocument();
  });

  it('should render Clara domain dropdown when feature toggle is enabled', () => {
    renderWithRouter(<InsightsCopilot defaultOpen />);
    expect(
      screen.getByLabelText('Select Clara AI insight source'),
    ).toBeInTheDocument();
  });

  it('should use the pillar default domain when feature toggle is enabled', () => {
    renderWithRouter(<InsightsCopilot defaultOpen />, '/category/pos/grow');

    expect(screen.getByText('Clara: Category')).toBeInTheDocument();
  });

  it('should not render Clara domain dropdown when feature toggle is disabled', () => {
    mockUseFeatureToggle.mockReturnValue([false, false]);

    renderWithRouter(<InsightsCopilot defaultOpen />, '/category/pos/grow');
    expect(
      screen.queryByLabelText('Select Clara AI insight source'),
    ).not.toBeInTheDocument();
  });
});
