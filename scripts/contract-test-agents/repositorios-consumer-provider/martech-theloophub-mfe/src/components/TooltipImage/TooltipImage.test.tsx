import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components2', () => ({
  Tooltip: ({ children, content, position }: any) => (
    <div data-testid="tooltip" data-position={position}>
      <div data-testid="tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('./TooltipImage.styles', () => ({
  StyledImage: ({ src, alt, style, 'data-testid': dataTestId }: any) => (
    <img
      data-testid={dataTestId || 'styled-image'}
      src={src}
      alt={alt}
      style={style}
    />
  ),
  StyledTooltipContainer: ({ children }: any) => (
    <span data-testid="tooltip-container">{children}</span>
  ),
}));

import { TooltipImage } from './TooltipImage';

describe('TooltipImage', () => {
  it('should render image without Tooltip when name is not provided', () => {
    render(<TooltipImage src="test-image.png" />);

    expect(screen.getByTestId('styled-image')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('should render image with alt "image" when name is not provided', () => {
    render(<TooltipImage src="test-image.png" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveAttribute('alt', 'image');
  });

  it('should render image with Tooltip when name is provided', () => {
    render(<TooltipImage src="test-image.png" name="Test Image" />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('styled-image')).toBeInTheDocument();
  });

  it('should render Tooltip with position top', () => {
    render(<TooltipImage src="test-image.png" name="Test Image" />);

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-position', 'top');
  });

  it('should render tooltip content with name', () => {
    render(<TooltipImage src="test-image.png" name="Test Image" />);

    expect(screen.getByTestId('tooltip-container')).toHaveTextContent(
      'Test Image',
    );
  });

  it('should render image with name as alt when name is provided', () => {
    render(<TooltipImage src="test-image.png" name="Test Image" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('should render image with correct src', () => {
    render(<TooltipImage src="test-image.png" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveAttribute('src', 'test-image.png');
  });

  it('should render image with default width 100%', () => {
    render(<TooltipImage src="test-image.png" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ width: '100%' });
  });

  it('should render image with default height 100%', () => {
    render(<TooltipImage src="test-image.png" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ height: '100%' });
  });

  it('should render image with custom width', () => {
    render(<TooltipImage src="test-image.png" width="200px" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ width: '200px' });
  });

  it('should render image with custom height', () => {
    render(<TooltipImage src="test-image.png" height="150px" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ height: '150px' });
  });

  it('should render image with custom width and height', () => {
    render(<TooltipImage src="test-image.png" width="300px" height="200px" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ width: '300px', height: '200px' });
  });

  it('should render image with custom dimensions when name is provided', () => {
    render(
      <TooltipImage
        src="test-image.png"
        name="Test"
        width="50px"
        height="50px"
      />,
    );

    const image = screen.getByTestId('styled-image');
    expect(image).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('should not render Tooltip when name is empty string', () => {
    render(<TooltipImage src="test-image.png" name="" />);

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    expect(screen.getByTestId('styled-image')).toBeInTheDocument();
  });

  it('should not render Tooltip when name is undefined', () => {
    render(<TooltipImage src="test-image.png" name={undefined} />);

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('should render with data-testid when provided', () => {
    render(<TooltipImage src="test-image.png" dataTestId="test-image" />);

    const image = screen.getByTestId('tooltip-image-test-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
  });

  it('should render without data-testid when not provided', () => {
    render(<TooltipImage src="test-image.png" />);

    const image = screen.getByTestId('styled-image');
    expect(image).toBeInTheDocument();
  });
});
