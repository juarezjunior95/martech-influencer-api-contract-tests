import { act, renderHook } from '@testing-library/react-hooks';

import { useLatestAsync } from './useLatestAsync';

describe('useLatestAsync', () => {
  describe('execute', () => {
    it('should return the result of the async function', async () => {
      const { result } = renderHook(() => useLatestAsync());

      let value: string | null = null;
      await act(async () => {
        value = await result.current.execute(async () => 'hello');
      });

      expect(value).toBe('hello');
    });

    it('should discard stale results by default', async () => {
      const { result } = renderHook(() => useLatestAsync('discard'));

      let first: string | null = 'initial';
      let second: string | null = 'initial';

      await act(async () => {
        const promise1 = result.current.execute(
          async () =>
            new Promise<string>((resolve) =>
              setTimeout(() => resolve('first'), 100),
            ),
        );
        const promise2 = result.current.execute(async () => 'second');

        [first, second] = await Promise.all([promise1, promise2]);
      });

      expect(first).toBeNull();
      expect(second).toBe('second');
    });

    it('should return null for aborted requests with cancel strategy', async () => {
      const { result } = renderHook(() => useLatestAsync('cancel'));

      let value: string | null = 'initial';

      await act(async () => {
        const promise = result.current.execute(async (signal) => {
          return new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => resolve('done'), 100);
            signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new DOMException('Aborted', 'AbortError'));
            });
          });
        });

        result.current.invalidate();
        value = await promise;
      });

      expect(value).toBeNull();
    });

    it('should rethrow non-abort errors for current request', async () => {
      const { result } = renderHook(() => useLatestAsync());

      await act(async () => {
        await expect(
          result.current.execute(async () => {
            throw new Error('test error');
          }),
        ).rejects.toThrow('test error');
      });
    });

    it('should return null for errors from stale requests', async () => {
      const { result } = renderHook(() => useLatestAsync());

      let first: string | null = 'initial';

      await act(async () => {
        const promise1 = result.current.execute(
          async () =>
            new Promise<string>((_, reject) =>
              setTimeout(() => reject(new Error('stale error')), 100),
            ),
        );

        result.current.execute(async () => 'second');

        first = await promise1;
      });

      expect(first).toBeNull();
    });
  });

  describe('invalidate', () => {
    it('should cause current execute to return null', async () => {
      const { result } = renderHook(() => useLatestAsync('discard'));

      let value: string | null = 'initial';

      await act(async () => {
        const promise = result.current.execute(
          async () =>
            new Promise<string>((resolve) =>
              setTimeout(() => resolve('done'), 100),
            ),
        );

        result.current.invalidate();
        value = await promise;
      });

      expect(value).toBeNull();
    });

    it('should abort controller when strategy is cancel', async () => {
      const { result } = renderHook(() => useLatestAsync('cancel'));

      let aborted = false;

      await act(async () => {
        const promise = result.current.execute(async (signal) => {
          return new Promise<string>((resolve, reject) => {
            signal.addEventListener('abort', () => {
              aborted = true;
              reject(new DOMException('Aborted', 'AbortError'));
            });
            setTimeout(() => resolve('done'), 100);
          });
        });

        result.current.invalidate();
        await promise;
      });

      expect(aborted).toBe(true);
    });
  });
});
