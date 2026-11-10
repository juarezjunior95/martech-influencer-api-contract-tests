import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ImgRenderer } from './ImgRenderer';

jest.mock('components', () => ({
  TooltipImage: ({ src, name, width, height, dataTestId }: any) => (
    <img
      data-testid={dataTestId || 'tooltip-image'}
      src={src}
      alt={name}
      data-width={width}
      data-height={height}
    />
  ),
}));

describe('ImgRenderer', () => {
  it('should render the component', () => {
    const { getByTestId } = render(
      <ImgRenderer src="image.png" name="Test Image" />,
    );

    expect(getByTestId('tooltip-image')).toBeInTheDocument();
  });

  it('should pass through non-absolute src unchanged', () => {
    const { getByTestId } = render(
      <ImgRenderer src="path/to/image.png" name="Test" />,
    );

    const img = getByTestId('tooltip-image');
    expect(img).toHaveAttribute('src', 'path/to/image.png');
  });

  it('should keep absolute http src', () => {
    const { getByTestId } = render(
      <ImgRenderer src="http://external.com/image.png" name="Test" />,
    );

    const img = getByTestId('tooltip-image');
    expect(img).toHaveAttribute('src', 'http://external.com/image.png');
  });

  it('should not prepend asset host when src includes https', () => {
    const { getByTestId } = render(
      <ImgRenderer src="https://external.com/image.png" name="Test" />,
    );

    const img = getByTestId('tooltip-image');
    expect(img).toHaveAttribute('src', 'https://external.com/image.png');
  });

  it('should pass name prop to TooltipImage', () => {
    const { getByAltText } = render(
      <ImgRenderer src="image.png" name="My Image" />,
    );

    expect(getByAltText('My Image')).toBeInTheDocument();
  });

  it('should pass width as auto to TooltipImage', () => {
    const { getByTestId } = render(<ImgRenderer src="image.png" name="Test" />);

    const img = getByTestId('tooltip-image');
    expect(img).toHaveAttribute('data-width', 'auto');
  });

  it('should pass height as 100% to TooltipImage', () => {
    const { getByTestId } = render(<ImgRenderer src="image.png" name="Test" />);

    const img = getByTestId('tooltip-image');
    expect(img).toHaveAttribute('data-height', '100%');
  });

  it('should render with data-testid when provided', () => {
    const { getByTestId } = render(
      <ImgRenderer src="image.png" name="Test" dataTestId="custom-image" />,
    );

    const img = getByTestId('custom-image');
    expect(img).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { getByTestId } = render(<ImgRenderer src="image.png" name="Test" />);

    const img = getByTestId('tooltip-image');
    expect(img).toBeInTheDocument();
  });
});
