import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { ChipsSelect } from './ChipsSelect';

const mockOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
];

describe('ChipsSelect Component', () => {
  it('should render all options correctly', () => {
    const handleChange = jest.fn();
    render(
      <ChipsSelect options={mockOptions} value="" onChange={handleChange} />,
    );

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('should call onChange with the correct option when clicked', () => {
    const handleChange = jest.fn();
    render(
      <ChipsSelect options={mockOptions} value="" onChange={handleChange} />,
    );

    const bananaOption = screen.getByText('Banana');
    fireEvent.click(bananaOption);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(mockOptions[1]);
  });

  describe('data-testid behavior', () => {
    it('should render container and options with generated data-testid when prop is provided', () => {
      const handleChange = jest.fn();
      const testId = 'my-fruit-select';

      render(
        <ChipsSelect
          options={mockOptions}
          value="apple"
          onChange={handleChange}
          dataTestId={testId}
        />,
      );

      const container = screen.getByTestId(testId);
      expect(container).toBeInTheDocument();

      const appleChip = screen.getByTestId(`${testId}-option-apple`);
      const bananaChip = screen.getByTestId(`${testId}-option-banana`);

      expect(appleChip).toBeInTheDocument();
      expect(bananaChip).toBeInTheDocument();

      expect(appleChip).toHaveTextContent('Apple');
    });

    it('should NOT render data-testid on container or options if prop is NOT provided', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <ChipsSelect
          options={mockOptions}
          value="apple"
          onChange={handleChange}
        />,
      );

      expect(container.firstChild).not.toHaveAttribute('data-testid');

      const button = screen.getByText('Apple');
      expect(button).not.toHaveAttribute('data-testid');
    });
  });
});
