import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Expand } from './Expand';

describe('Expand Component', () => {
  it('renders the correct icon based on the value', () => {
    const mockOnValueChange = jest.fn();

    render(
      <Expand
        onValueChange={mockOnValueChange}
        value={true}
        dataTestId="expand-test"
      />,
    );

    const expandButton = screen.getByTestId('expand-test');

    expect(expandButton).toBeInTheDocument();
    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByTestId('expand-test-minimize')).toBeInTheDocument();
  });

  it('toggles value when clicked', () => {
    const mockOnValueChange = jest.fn();

    render(
      <Expand
        onValueChange={mockOnValueChange}
        value={false}
        dataTestId="expand-test"
      />,
    );

    const expandButton = screen.getByTestId('expand-test');

    expect(expandButton).toBeInTheDocument();
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByTestId('expand-test-maximize')).toBeInTheDocument();

    fireEvent.click(expandButton);

    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('dont toggles value when clicked on disabled expand', () => {
    const mockOnValueChange = jest.fn();

    render(
      <Expand
        onValueChange={mockOnValueChange}
        value={false}
        disabled
        dataTestId="expand-test"
      />,
    );

    const expandButton = screen.getByTestId('expand-test');

    expect(expandButton).toBeInTheDocument();
    expect(screen.getByTestId('expand-test-maximize')).toBeInTheDocument();

    fireEvent.click(expandButton);

    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('should not render data-testid if prop is not provided', () => {
    const mockOnValueChange = jest.fn();
    const { container } = render(
      <Expand onValueChange={mockOnValueChange} value={false} />,
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('data-testid');
  });
});
