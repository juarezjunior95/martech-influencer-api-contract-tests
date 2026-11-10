import { act, renderHook } from '@testing-library/react-hooks';

import { useFeedback } from './useFeedback';

const mockUnwrap = jest.fn().mockResolvedValue({});
const mockFeedbackMut = jest.fn(() => ({ unwrap: mockUnwrap }));

jest.mock('redux/api/insightsCopilot', () => ({
  useSendFeedbackMutation: () => [mockFeedbackMut, {}],
}));

function setup() {
  return renderHook(() => useFeedback());
}

beforeEach(() => jest.clearAllMocks());

describe('useFeedback', () => {
  describe('getSentiment', () => {
    it('should return null when no feedback exists', () => {
      const { result } = setup();
      expect(result.current.getSentiment('msg-1')).toBeNull();
    });

    it('should return serverSentiment as fallback', () => {
      const { result } = setup();
      expect(result.current.getSentiment('msg-1', 'positive')).toBe('positive');
    });

    it('should prefer local state over serverSentiment', async () => {
      const { result } = setup();

      act(() => result.current.handleThumbDown('msg-1', 'req-1'));

      await act(async () => {
        await result.current.handleModalSubmit(['bad'], 'comment');
      });

      expect(result.current.getSentiment('msg-1', 'positive')).toBe('negative');
    });
  });

  describe('handleThumbUp / handleThumbDown', () => {
    it('should open modal with correct sentiment', () => {
      const { result } = setup();

      act(() => result.current.handleThumbUp('msg-1', 'req-1'));
      expect(result.current.modalState).toEqual({
        messageId: 'msg-1',
        requestId: 'req-1',
        sentiment: 'positive',
      });
    });

    it('should not reopen modal if feedback already exists', async () => {
      const { result } = setup();

      act(() => result.current.handleThumbDown('msg-1', 'req-1'));
      await act(async () => {
        await result.current.handleModalSubmit(['bad'], '');
      });

      act(() => result.current.handleThumbDown('msg-1', 'req-1'));
      expect(result.current.modalState).toBeNull();
    });
  });

  describe('handleModalSubmit', () => {
    it('should call feedbackMut and update state on success', async () => {
      const { result } = setup();

      act(() => result.current.handleThumbDown('msg-1', 'req-1'));

      await act(async () => {
        await result.current.handleModalSubmit(['bad'], 'comment');
      });

      expect(mockFeedbackMut).toHaveBeenCalledWith({
        requestId: 'req-1',
        sentiment: 'negative',
        scenario: 'response',
        selectedOptions: ['bad'],
        comments: 'comment',
      });
      expect(result.current.getSentiment('msg-1')).toBe('negative');
      expect(result.current.modalState).toBeNull();
    });

    it('should still close modal when mutation fails', async () => {
      mockUnwrap.mockRejectedValueOnce(new Error('fail'));
      const { result } = setup();

      act(() => result.current.handleThumbUp('msg-1', 'req-1'));

      await act(async () => {
        await result.current.handleModalSubmit([], '');
      });

      expect(result.current.getSentiment('msg-1')).toBeNull();
      expect(result.current.modalState).toBeNull();
    });

    it('should not send empty comments', async () => {
      const { result } = setup();

      act(() => result.current.handleThumbUp('msg-1', 'req-1'));

      await act(async () => {
        await result.current.handleModalSubmit(['good'], '');
      });

      expect(mockFeedbackMut).toHaveBeenCalledWith(
        expect.objectContaining({ comments: undefined }),
      );
    });
  });

  describe('handleModalClose', () => {
    it('should close modal without submitting', () => {
      const { result } = setup();

      act(() => result.current.handleThumbUp('msg-1', 'req-1'));
      expect(result.current.modalState).not.toBeNull();

      act(() => result.current.handleModalClose());
      expect(result.current.modalState).toBeNull();
    });
  });
});
