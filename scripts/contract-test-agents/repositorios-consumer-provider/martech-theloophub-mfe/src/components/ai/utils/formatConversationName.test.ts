import { formatConversationName } from './formatConversationName';

describe('formatConversationName', () => {
  it('should replace underscores with spaces', () => {
    expect(formatConversationName('hello_world')).toBe('hello world');
  });

  it('should replace multiple underscores', () => {
    expect(formatConversationName('foo_bar_baz')).toBe('foo bar baz');
  });

  it('should return same string if no underscores', () => {
    expect(formatConversationName('hello world')).toBe('hello world');
  });

  it('should return "New Chat" for empty string', () => {
    expect(formatConversationName('')).toBe('New Chat');
  });

  it('should return "New Chat" for whitespace-only string', () => {
    expect(formatConversationName('   ')).toBe('New Chat');
  });
});
