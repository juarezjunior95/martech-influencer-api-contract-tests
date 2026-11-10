import { render, screen } from '@testing-library/react';

import type { Message } from '../../../types';
import { MessagesList } from './MessagesList';

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

jest.mock('redux/api/insightsCopilot', () => ({
  useLazyGetBlobMarkdownQuery: () => [jest.fn(), {}],
}));

jest.mock('../../atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
}));

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Hello',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: 'Hi there',
    timestamp: '2024-01-01T00:00:01.000Z',
  },
];

describe('MessagesList', () => {
  it('should render user messages', () => {
    render(<MessagesList messages={mockMessages} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render assistant messages with markdown', () => {
    render(<MessagesList messages={mockMessages} />);
    expect(screen.getByTestId('markdown')).toHaveTextContent('Hi there');
  });

  it('should render error messages without markdown', () => {
    const errorMessages: Message[] = [
      {
        id: 'err-1',
        role: 'assistant',
        content: 'Sorry, something went wrong.',
        timestamp: '2024-01-01T00:00:00.000Z',
        isError: true,
      },
    ];
    render(<MessagesList messages={errorMessages} />);
    expect(
      screen.getByText('Sorry, something went wrong.'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
  });

  it('should show loader when isLoading is true', () => {
    render(<MessagesList messages={[]} isLoading />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should not show loader when isLoading is false', () => {
    render(<MessagesList messages={mockMessages} isLoading={false} />);
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
  });

  it('should render all messages', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Q1', timestamp: '' },
      { id: '2', role: 'assistant', content: 'A1', timestamp: '' },
      { id: '3', role: 'user', content: 'Q2', timestamp: '' },
    ];
    render(<MessagesList messages={messages} />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent('A1');
  });
});
