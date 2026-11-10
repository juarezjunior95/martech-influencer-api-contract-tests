import { render, screen } from '@testing-library/react';

import type { Message } from '../../../types';
import { MessageContent } from './MessageContent';

jest.mock('redux/api/insightsCopilot', () => ({
  useLazyGetBlobMarkdownQuery: () => [jest.fn(), {}],
}));

jest.mock('../../atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
}));

const baseMessage: Message = {
  id: '1',
  role: 'assistant',
  content: 'Hello world',
  timestamp: '',
};

describe('MessageContent', () => {
  it('should render markdown content', () => {
    render(<MessageContent message={baseMessage} />);
    expect(screen.getByTestId('markdown')).toHaveTextContent('Hello world');
  });

  it('should not render chart section when no charts', () => {
    render(<MessageContent message={baseMessage} />);
    expect(screen.queryByTestId('chart-section')).not.toBeInTheDocument();
  });

  it('should not render chart section when charts is empty', () => {
    render(<MessageContent message={{ ...baseMessage, charts: [] }} />);
    expect(screen.queryByTestId('chart-section')).not.toBeInTheDocument();
  });
});
