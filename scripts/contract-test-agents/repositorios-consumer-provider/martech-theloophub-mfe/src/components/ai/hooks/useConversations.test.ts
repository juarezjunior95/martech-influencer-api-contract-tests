import { act, renderHook } from '@testing-library/react-hooks';

import { useConversations } from './useConversations';

const TEST_PROJECT_KEY = 'test-pk';

const mockDeleteMut = jest.fn(() => ({
  unwrap: () => Promise.resolve({ message: 'Deleted' }),
}));
const mockRenameMut = jest.fn(() => ({
  unwrap: () => Promise.resolve({ conversation_id: 'c1', name: 'New' }),
}));

jest.mock('redux/api/insightsCopilot', () => ({
  useDeleteConversationMutation: () => [mockDeleteMut, {}],
  useRenameConversationMutation: () => [mockRenameMut, {}],
}));

beforeEach(() => jest.clearAllMocks());

describe('useConversations', () => {
  describe('delete flow', () => {
    it('should open modal on requestDelete', () => {
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY }),
      );

      expect(result.current.isDeleteModalOpen).toBe(false);

      act(() => {
        result.current.requestDelete({ id: 'c1', title: 'Chat' });
      });

      expect(result.current.isDeleteModalOpen).toBe(true);
    });

    it('should close modal on cancelDelete', () => {
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY }),
      );

      act(() => {
        result.current.requestDelete({ id: 'c1', title: 'Chat' });
      });

      act(() => {
        result.current.cancelDelete();
      });

      expect(result.current.isDeleteModalOpen).toBe(false);
    });

    it('should call mutation and onDeleted on confirmDelete', async () => {
      const onDeleted = jest.fn();
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY, onDeleted }),
      );

      act(() => {
        result.current.requestDelete({ id: 'c1', title: 'Chat' });
      });

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockDeleteMut).toHaveBeenCalledWith({
        conversationId: 'c1',
        projectKey: TEST_PROJECT_KEY,
      });
      expect(onDeleted).toHaveBeenCalledWith('c1');
      expect(result.current.isDeleteModalOpen).toBe(false);
    });

    it('should close modal even when mutation fails', async () => {
      mockDeleteMut.mockReturnValueOnce({
        unwrap: () => Promise.reject(new Error('fail')),
      });

      const onDeleted = jest.fn();
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY, onDeleted }),
      );

      act(() => {
        result.current.requestDelete({ id: 'c1', title: 'Chat' });
      });

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(onDeleted).not.toHaveBeenCalled();
      expect(result.current.isDeleteModalOpen).toBe(false);
    });

    it('should do nothing when confirmDelete without requestDelete', async () => {
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY }),
      );

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockDeleteMut).not.toHaveBeenCalled();
    });
  });

  describe('rename', () => {
    it('should call mutation and return true on success', async () => {
      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY }),
      );

      let success: boolean;
      await act(async () => {
        success = await result.current.rename({ id: 'c1' }, 'New Name');
      });

      expect(success!).toBe(true);
      expect(mockRenameMut).toHaveBeenCalledWith({
        conversationId: 'c1',
        projectKey: TEST_PROJECT_KEY,
        name: 'New Name',
      });
    });

    it('should return false when mutation fails', async () => {
      mockRenameMut.mockReturnValueOnce({
        unwrap: () => Promise.reject(new Error('fail')),
      });

      const { result } = renderHook(() =>
        useConversations({ projectKey: TEST_PROJECT_KEY }),
      );

      let success: boolean;
      await act(async () => {
        success = await result.current.rename({ id: 'c1' }, 'New Name');
      });

      expect(success!).toBe(false);
    });
  });
});
