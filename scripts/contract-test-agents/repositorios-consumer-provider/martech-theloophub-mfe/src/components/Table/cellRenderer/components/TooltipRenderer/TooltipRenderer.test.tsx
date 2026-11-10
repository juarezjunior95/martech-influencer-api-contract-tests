import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TooltipRenderer } from './TooltipRenderer';

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span
      data-testid="icon"
      data-icon={icon?.name || 'icon'}
      data-size={size}
      className={className}
    >
      Icon
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: { name: 'Info' },
}));

describe('TooltipRenderer', () => {
  it('should render the component', () => {
    render(<TooltipRenderer value="Test Value" />);

    expect(screen.getByText('Test Value')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render value', () => {
    render(<TooltipRenderer value="Tooltip Text" />);

    expect(screen.getByText('Tooltip Text')).toBeInTheDocument();
  });

  it('should render Info icon', () => {
    render(<TooltipRenderer value="Value" />);

    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-icon', 'Info');
  });

  it('should render icon with small size', () => {
    render(<TooltipRenderer value="Value" />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-size', 'small');
  });

  it('should render icon with tooltip-icon className', () => {
    render(<TooltipRenderer value="Value" />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('tooltip-icon');
  });

  it('should render with empty value', () => {
    render(<TooltipRenderer value="" />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render with numeric value', () => {
    render(<TooltipRenderer value="123" />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render value and icon in correct order', () => {
    const { container } = render(<TooltipRenderer value="First" />);

    const content = container.textContent;
    expect(content).toContain('First');
    expect(content).toContain('Icon');
  });

  it('should render with long value', () => {
    const longValue = 'This is a very long tooltip text that might wrap';
    render(<TooltipRenderer value={longValue} />);

    expect(screen.getByText(longValue)).toBeInTheDocument();
  });
});
