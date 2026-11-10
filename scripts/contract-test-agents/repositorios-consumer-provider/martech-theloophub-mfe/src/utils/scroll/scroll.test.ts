import { scrollToElement } from './scroll';

describe('scroll', () => {
  describe('scrollToElement', () => {
    const mockScrollTo = jest.fn();

    beforeEach(() => {
      window.scrollTo = mockScrollTo;
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      jest.clearAllMocks();
    });

    it('should scroll to element with offset', () => {
      const mockElement = {
        getBoundingClientRect: jest.fn(() => ({
          top: 200,
        })),
      } as unknown as HTMLElement;

      const ref = { current: mockElement };
      scrollToElement(ref);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 220,
        behavior: 'smooth',
      });
    });

    it('should not scroll when ref.current is null', () => {
      const ref = { current: null };
      scrollToElement(ref);

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should calculate correct position with different scrollY', () => {
      Object.defineProperty(window, 'scrollY', { value: 500 });

      const mockElement = {
        getBoundingClientRect: jest.fn(() => ({
          top: 100,
        })),
      } as unknown as HTMLElement;

      const ref = { current: mockElement };
      scrollToElement(ref);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 520,
        behavior: 'smooth',
      });
    });

    it('should handle element at top of page', () => {
      Object.defineProperty(window, 'scrollY', { value: 0 });

      const mockElement = {
        getBoundingClientRect: jest.fn(() => ({
          top: 80,
        })),
      } as unknown as HTMLElement;

      const ref = { current: mockElement };
      scrollToElement(ref);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should handle negative element position', () => {
      Object.defineProperty(window, 'scrollY', { value: 1000 });

      const mockElement = {
        getBoundingClientRect: jest.fn(() => ({
          top: -200,
        })),
      } as unknown as HTMLElement;

      const ref = { current: mockElement };
      scrollToElement(ref);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 720,
        behavior: 'smooth',
      });
    });
  });
});
