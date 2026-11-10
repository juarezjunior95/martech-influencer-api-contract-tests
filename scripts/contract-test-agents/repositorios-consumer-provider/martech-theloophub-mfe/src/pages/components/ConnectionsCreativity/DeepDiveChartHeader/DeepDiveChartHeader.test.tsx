import React from 'react';

import { render, screen } from '@testing-library/react';

import { DeepDiveChartHeader } from './DeepDiveChartHeader';

jest.mock('components', () => ({
  CustomTooltip: ({ children, content, backgroundStyle, label, size }: any) => (
    <div
      data-testid="deep-dive-mock-tooltip"
      data-background-style={backgroundStyle}
      data-label={label}
      data-size={size}
    >
      <div data-testid="deep-dive-mock-tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

describe('DeepDiveChartHeader', () => {
  it('renders the title and measure', () => {
    render(
      <DeepDiveChartHeader title="Audience Reach" measure="Impressions" />,
    );

    expect(screen.getByText('Audience Reach')).toBeInTheDocument();
    expect(screen.getByText('Impressions')).toBeInTheDocument();
  });

  it('renders connector and context when provided', () => {
    render(
      <DeepDiveChartHeader
        title="Audience Reach"
        connector="vs"
        context="Competitors"
        measure="Impressions"
      />,
    );

    expect(screen.getByText('vs')).toBeInTheDocument();
    expect(screen.getByText('Competitors')).toBeInTheDocument();
  });

  it('renders a tooltip based on a string value with default transparent background', () => {
    render(
      <DeepDiveChartHeader
        title="Audience Reach"
        measure="Impressions"
        tooltip="First sentence. Second sentence."
      />,
    );

    const tooltip = screen.getByTestId('deep-dive-mock-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-background-style', 'transparent');
    expect(tooltip).toHaveAttribute('data-label', 'Audience Reach');
    expect(tooltip).toHaveAttribute('data-size', 'medium');

    const tooltipContent = screen.getByTestId('deep-dive-mock-tooltip-content');
    expect(tooltipContent.textContent).toBe(
      'First sentence.\nSecond sentence.',
    );
  });

  it('renders a tooltip React node and applies the default background when transparent is false', () => {
    render(
      <DeepDiveChartHeader
        title="Audience Reach"
        measure="Impressions"
        tooltip={<span data-testid="custom-tooltip-node">Custom content</span>}
        tooltipTransparent={false}
      />,
    );

    const tooltip = screen.getByTestId('deep-dive-mock-tooltip');
    expect(tooltip).toHaveAttribute('data-background-style', 'default');
    expect(screen.getByTestId('custom-tooltip-node')).toBeInTheDocument();
  });
});
