import React from 'react';

import { render, screen } from '@testing-library/react';

import { CustomSlider, CustomSliderProps } from './CustomSlider';

describe('Custom Slider', () => {
  const mockCallback = jest.fn();

  const defaultProps: CustomSliderProps = {
    type: 'slider',
    min: 0,
    max: 100,
    maxInput: 80,
    value: [0, 75],
    callback: mockCallback,
    dataTestId: 'custom-slider',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with default props', () => {
    render(<CustomSlider {...defaultProps} />);

    const sliderRoot = screen.getByTestId('custom-slider');
    expect(sliderRoot).toBeInTheDocument();

    const firstThumb = screen.getByLabelText('first-value');
    const lastThumb = screen.getByLabelText('last-value');

    expect(firstThumb).toBeInTheDocument();
    expect(lastThumb).toBeInTheDocument();
  });

  it('renders range elements when type is range', () => {
    render(<CustomSlider {...defaultProps} type="range" />);

    const rangeElement = screen.getByTestId('custom-slider-track');
    expect(rangeElement).toBeInTheDocument();
  });

  it('renders range elements when type is range', () => {
    render(<CustomSlider {...defaultProps} type="fixedRange" />);

    const firstThumb = screen.getByLabelText('first-value');
    const lastThumb = screen.getByLabelText('last-value');

    expect(firstThumb).toBeInTheDocument();
    expect(lastThumb).toBeInTheDocument();
  });

  it('applies correct styles based on maxInput', () => {
    render(<CustomSlider {...defaultProps} />);

    const sliderTrack = screen.getByTestId('custom-slider-track');
    const percentage = (defaultProps.maxInput / defaultProps.max) * 100 + '%';

    expect(sliderTrack).toHaveStyle(
      `background: linear-gradient(to right, #b4cee9 0 ${percentage}, #ededed 0)`,
    );
  });

  it('should not render data-testid if prop is not provided', () => {
    const propsWithoutId = { ...defaultProps, dataTestId: undefined };
    const { container } = render(<CustomSlider {...propsWithoutId} />);

    expect(container.firstChild).not.toHaveAttribute('data-testid');
  });
});
