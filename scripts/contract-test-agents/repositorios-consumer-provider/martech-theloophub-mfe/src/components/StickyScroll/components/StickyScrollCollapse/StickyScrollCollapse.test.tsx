import React from 'react';

import { render, screen } from '@testing-library/react';

import { StickyScrollCollapse } from './StickyScrollCollapse';

jest.mock('./StickyScrollCollapse.styles', () => ({
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
}));

describe('StickyScrollCollapse', () => {
  it('should render children correctly', () => {
    render(
      <StickyScrollCollapse>
        <span>Test Content</span>
      </StickyScrollCollapse>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should pass show prop to styled component when true', () => {
    render(
      <StickyScrollCollapse show={true}>
        <span>Content</span>
      </StickyScrollCollapse>,
    );

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'true');
  });

  it('should pass show prop to styled component when false', () => {
    render(
      <StickyScrollCollapse show={false}>
        <span>Content</span>
      </StickyScrollCollapse>,
    );

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'false');
  });

  it('should handle undefined show prop', () => {
    render(
      <StickyScrollCollapse>
        <span>Content</span>
      </StickyScrollCollapse>,
    );

    const collapse = screen.getByTestId('sticky-scroll-collapse');
    expect(collapse).toHaveAttribute('data-show', 'false');
  });
});
