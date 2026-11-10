import React from 'react';

import { render, screen } from '@testing-library/react';

import { InfoTooltip } from './InfoTooltip';

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => <span data-testid="info-icon-svg" />,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent, ...props }: any) => (
    <span data-testid="icon-wrapper" {...props}>
      {IconComponent && <IconComponent />}
    </span>
  ),
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content, dataTestId }: any) => (
    <div data-testid={dataTestId || 'custom-tooltip'}>
      <div data-testid="tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('./InfoTooltip.styles', () => ({
  StyledTooltipText: ({ children, size, ...props }: any) => (
    <p data-testid="tooltip-text" data-size={size} {...props}>
      {children}
    </p>
  ),
  StyledInfoIcon: ({ children, tooltipSize, ...props }: any) => (
    <span
      data-testid="styled-info-icon"
      data-tooltip-size={tooltipSize}
      {...props}
    >
      {children}
    </span>
  ),
}));

describe('InfoTooltip', () => {
  it('should render tooltip with provided content', () => {
    render(<InfoTooltip content="Help text" />);

    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('should use "small" as default size', () => {
    render(<InfoTooltip content="Help text" />);

    const tooltipText = screen.getByTestId('tooltip-text');
    expect(tooltipText).toHaveAttribute('data-size', 'small');
  });

  it('should apply "default" size when provided', () => {
    render(<InfoTooltip content="Help text" size="default" />);

    const tooltipText = screen.getByTestId('tooltip-text');
    expect(tooltipText).toHaveAttribute('data-size', 'default');
  });

  it('should pass size to StyledInfoIcon as tooltipSize', () => {
    render(<InfoTooltip content="Help text" size="default" />);

    const icon = screen.getByTestId('styled-info-icon');
    expect(icon).toHaveAttribute('data-tooltip-size', 'default');
  });

  it('should pass "small" size to icon by default', () => {
    render(<InfoTooltip content="Help text" />);

    const icon = screen.getByTestId('styled-info-icon');
    expect(icon).toHaveAttribute('data-tooltip-size', 'small');
  });

  it('should pass dataTestId to CustomTooltip', () => {
    render(<InfoTooltip content="Help text" dataTestId="my-tooltip" />);

    expect(screen.getByTestId('my-tooltip')).toBeInTheDocument();
  });

  it('should not pass dataTestId when not provided', () => {
    render(<InfoTooltip content="Help text" />);

    expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
  });

  it('should render the Info icon', () => {
    render(<InfoTooltip content="Help text" />);

    expect(screen.getByTestId('styled-info-icon')).toBeInTheDocument();
  });
});
