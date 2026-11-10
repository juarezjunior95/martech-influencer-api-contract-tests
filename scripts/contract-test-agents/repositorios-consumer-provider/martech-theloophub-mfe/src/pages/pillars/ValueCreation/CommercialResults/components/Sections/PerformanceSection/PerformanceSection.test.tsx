import React from 'react';

import { render, screen } from '@testing-library/react';

import { PerformanceSection } from './PerformanceSection';

jest.mock('../../ContentCardWithBreadcrumb', () => ({
  ContentCardWithBreadcrumb: ({
    children,
    title,
    tooltip,
  }: {
    children: React.ReactNode;
    title: string;
    tooltip?: string;
  }) => (
    <div
      data-testid="commercial-results-performance-section"
      data-title={title}
      data-tooltip={tooltip}
    >
      {children}
    </div>
  ),
}));

describe('PerformanceSection', () => {
  it('should render the performance section', () => {
    render(
      <PerformanceSection title="Test Title" tooltip="Test Tooltip">
        <div>Test Children</div>
      </PerformanceSection>,
    );

    expect(
      screen.getByTestId('commercial-results-performance-section'),
    ).toBeInTheDocument();
  });

  it('should render the performance section children', () => {
    render(
      <PerformanceSection title="Test Title" tooltip="Test Tooltip">
        <div>Test Children</div>
      </PerformanceSection>,
    );

    expect(
      screen.getByTestId('performance-section-children'),
    ).toBeInTheDocument();
  });

  it('passes the title to ContentCardWithBreadcrumb', () => {
    render(
      <PerformanceSection title="Volume Performance" tooltip="Test Tooltip">
        <div>Child</div>
      </PerformanceSection>,
    );

    expect(
      screen.getByTestId('commercial-results-performance-section'),
    ).toHaveAttribute('data-title', 'Volume Performance');
  });

  it('passes the tooltip to ContentCardWithBreadcrumb', () => {
    render(
      <PerformanceSection title="Test Title" tooltip="Helpful tip">
        <div>Child</div>
      </PerformanceSection>,
    );

    expect(
      screen.getByTestId('commercial-results-performance-section'),
    ).toHaveAttribute('data-tooltip', 'Helpful tip');
  });

  it('renders children inside the performance-section-children wrapper', () => {
    render(
      <PerformanceSection title="Test Title" tooltip="Test Tooltip">
        <span data-testid="custom-child">My Chart</span>
      </PerformanceSection>,
    );

    const wrapper = screen.getByTestId('performance-section-children');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
