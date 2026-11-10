import React from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';

import { StickyScrollCollapse } from './components/StickyScrollCollapse/StickyScrollCollapse';
import { StickyScrollRoot } from './components/StickyScrollRoot/StickyScrollRoot';

jest.mock('./components/StickyScrollRoot/StickyScrollRoot.styles', () => ({
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

jest.mock(
  './components/StickyScrollCollapse/StickyScrollCollapse.styles',
  () => ({
    StickyScrollCollapseStyles: ({
      children,
      show,
    }: {
      children: React.ReactNode;
      show?: boolean;
    }) => (
      <div
        data-testid="sticky-scroll-collapse"
        data-show={show ? 'true' : 'false'}
      >
        {children}
      </div>
    ),
  }),
);

describe('StickyScroll', () => {
  let scrollYValue = 0;
  let currentUnmount: (() => void) | null = null;
  let requestAnimationSpy: jest.SpyInstance;

  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    get: () => scrollYValue,
  });

  beforeEach(() => {
    scrollYValue = 0;
    jest.clearAllMocks();
    requestAnimationSpy = jest
      .spyOn(window, 'requestAnimationFrame')
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

  it('should render StickyScrollCollapse children with show prop', () => {
    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <StickyScrollCollapse>
          <span>Collapsible Content</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    expect(screen.getByText('Collapsible Content')).toBeInTheDocument();
    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'true');
  });

  it('should render multiple children including StickyScrollCollapse', () => {
    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <span>Static Content</span>
        <StickyScrollCollapse>
          <span>Collapsible Content</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    expect(screen.getByText('Static Content')).toBeInTheDocument();
    expect(screen.getByText('Collapsible Content')).toBeInTheDocument();
  });

  it('should hide breadcrumb when scrolling down past threshold', async () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <StickyScrollCollapse>
          <span>Breadcrumb</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    await act(async () => {
      scrollYValue = 300;
      window.dispatchEvent(new Event('scroll'));
    });

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'false');
  });

  it('should show breadcrumb when scrolling up past threshold', async () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <StickyScrollCollapse>
          <span>Breadcrumb</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    await act(async () => {
      scrollYValue = 300;
      window.dispatchEvent(new Event('scroll'));
    });

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'false');

    await act(async () => {
      scrollYValue = 0;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(collapse).toHaveAttribute('data-show', 'true');
  });

  it('should not change breadcrumb visibility for small scroll movements', async () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <StickyScrollCollapse>
          <span>Breadcrumb</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    await act(async () => {
      scrollYValue = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'true');

    await act(async () => {
      scrollYValue = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(collapse).toHaveAttribute('data-show', 'true');
  });

  it('should handle non-React element children gracefully', () => {
    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        Plain text child
        <StickyScrollCollapse>
          <span>Collapsible</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    expect(screen.getByText('Plain text child')).toBeInTheDocument();
    expect(screen.getByText('Collapsible')).toBeInTheDocument();
  });

  it('should accumulate scroll deltas correctly', async () => {
    scrollYValue = 0;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <StickyScrollCollapse>
          <span>Breadcrumb</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    const collapse = screen.getByTestId('sticky-scroll-collapse');

    await act(async () => {
      scrollYValue = 100;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(collapse).toHaveAttribute('data-show', 'true');

    await act(async () => {
      scrollYValue = 200;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(collapse).toHaveAttribute('data-show', 'true');

    await act(async () => {
      scrollYValue = 350;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(collapse).toHaveAttribute('data-show', 'false');
  });

  it('should handle children that are not StickyScrollCollapse', () => {
    const CustomComponent = () => <div data-testid="custom">Custom</div>;

    renderWithUnmount(
      <StickyScrollRoot dataTestId="root">
        <CustomComponent />
        <StickyScrollCollapse>
          <span>Collapsible</span>
        </StickyScrollCollapse>
      </StickyScrollRoot>,
    );

    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.getByText('Collapsible')).toBeInTheDocument();
  });
});
