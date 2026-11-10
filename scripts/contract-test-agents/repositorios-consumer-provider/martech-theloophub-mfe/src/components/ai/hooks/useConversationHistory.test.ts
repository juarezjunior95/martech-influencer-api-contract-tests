import { renderHook } from '@testing-library/react-hooks';

import { useConversationHistory } from './useConversationHistory';

jest.mock('../utils/formatConversationName', () => ({
  formatConversationName: (name: string) => name || 'New Chat',
}));

const mockRefetch = jest.fn();
const TEST_PROJECT_KEY = 'test-pk';

jest.mock('redux/api/insightsCopilot', () => ({
  useListConversationsQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: mockRefetch,
  })),
}));

const { useListConversationsQuery } = jest.requireMock(
  'redux/api/insightsCopilot',
);

beforeEach(() => jest.clearAllMocks());

describe('useConversationHistory', () => {
  it('should query with projectKey and default limit', () => {
    renderHook(() => useConversationHistory({ projectKey: TEST_PROJECT_KEY }));

    expect(useListConversationsQuery).toHaveBeenCalledWith({
      projectKey: TEST_PROJECT_KEY,
      page: 1,
      limit: 20,
    });
  });

  it('should pass custom limit', () => {
    renderHook(() =>
      useConversationHistory({ projectKey: TEST_PROJECT_KEY, limit: 50 }),
    );

    expect(useListConversationsQuery).toHaveBeenCalledWith({
      projectKey: TEST_PROJECT_KEY,
      page: 1,
      limit: 50,
    });
  });

  it('should transform data into sidebarConversations', () => {
    (useListConversationsQuery as jest.Mock).mockReturnValue({
      data: [
        { conversation_id: 'c1', name: 'Chat_One' },
        { conversation_id: 'c2', name: '' },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() =>
      useConversationHistory({ projectKey: TEST_PROJECT_KEY }),
    );

    expect(result.current.sidebarConversations).toEqual([
      { id: 'c1', title: 'Chat_One', hasError: false },
      { id: 'c2', title: 'New Chat', hasError: true },
    ]);
  });

  it('should expose refetch', () => {
    const { result } = renderHook(() =>
      useConversationHistory({ projectKey: TEST_PROJECT_KEY }),
    );

    result.current.refetch();
    expect(mockRefetch).toHaveBeenCalled();
  });
});
