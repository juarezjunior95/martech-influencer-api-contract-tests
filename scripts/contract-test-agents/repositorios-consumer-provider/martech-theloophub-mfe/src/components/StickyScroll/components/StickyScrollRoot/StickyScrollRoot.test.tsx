import React from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';

import { StickyScrollRoot } from './StickyScrollRoot';

jest.mock('./StickyScrollRoot.styles', () => ({
  StickyScrollRootStyles: ({
    children,
    showBackground,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    showBackground?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId}
      data-show-background={showBackground ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
}));

const getWindow = (): Window => globalThis as unknown as Window;

describe('StickyScrollRoot', () => {
  let scrollYValue = 0;
  let currentUnmount: (() => void) | null = null;
  let requestAnimationSpy: jest.SpyInstance;

  Object.defineProperty(getWindow(), 'scrollY', {
    configurable: true,
    get: () => scrollYValue,
  });

  beforeEach(() => {
    scrollYValue = 0;
    jest.clearAllMocks();
    requestAnimationSpy = jest
      .spyOn(getWindow(), 'requestAnimationFrame')
      .mockImplementation((cb) => {
        queueMicrotask(() => cb(0));
        return 0;
      });
  });

  afterEach(() => {
    if (currentUnmount) {
      currentUnmount();
      currentUnmount = null;
    }
    cleanup();
    scrollYValue = 0;
    requestAnimationSpy.mockRestore();
  });

  const renderWithUnmount = (ui: React.ReactElement) => {
    const result = render(ui);
    currentUnmount = result.unmount;
    return result;
  };

  it('should render children correctly', () => {
    renderWithUnmount(
      <StickyScrollRoot>
        <span>Test Content</span>
      </StickyScrollRoot>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with dataTestId', () => {
    renderWithUnmount(
      <StickyScrollRoot dataTestId="sticky-scroll-root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    expect(screen.getByTestId('sticky-scroll-root')).toBeInTheDocument();
  });

  it('should initially show background as false when scrollY is 0', () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('data-show-background', 'false');
  });

  it('should show background when scroll exceeds background threshold', async () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    await act(async () => {
      scrollYValue = 50;
      getWindow().dispatchEvent(new Event('scroll'));
    });

    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('data-show-background', 'true');
  });

  it('should hide background when scroll is below background threshold', async () => {
    scrollYValue = 50;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    await act(async () => {
      scrollYValue = 10;
      getWindow().dispatchEvent(new Event('scroll'));
    });

    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('data-show-background', 'false');
  });

  it('should remove scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(
      getWindow(),
      'removeEventListener',
    );

    const { unmount } = renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    unmount();
    currentUnmount = null;

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should initialize showBackground as false when page loads at top', () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Content</span>
      </StickyScrollRoot>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('data-show-background', 'false');
  });
});
