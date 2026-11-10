import { render, screen } from '@testing-library/react';

import { ResponsiveWarning } from './ResponsiveWarning';

describe('Responsive Warning', () => {
  it('should render the component', () => {
    render(<ResponsiveWarning />);

    expect(
      screen.queryByText('Mobile version coming soon'),
    ).toBeInTheDocument();
  });

  it('should render the image', () => {
    render(<ResponsiveWarning />);

    const image = screen.getByAltText('Descrição');
    expect(image).toBeInTheDocument();
  });
});

describe('data-testid Rendering', () => {
  it('should render all elements with data-testid when dataTestId is provided', () => {
    render(<ResponsiveWarning dataTestId="custom" />);

    expect(screen.getByTestId('responsive-warning-custom')).toBeInTheDocument();
    expect(
      screen.getByTestId('responsive-warning-img-custom'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('responsive-warning-heading-custom'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('responsive-warning-paragraph-custom'),
    ).toBeInTheDocument();
  });

  it('should not render data-testid when dataTestId is not provided', () => {
    const { container } = render(<ResponsiveWarning />);

    const elementsWithTestId = container.querySelectorAll(
      '[data-testid^="responsive-warning-"]',
    );
    expect(elementsWithTestId.length).toBe(0);

    expect(screen.getByText('Mobile version coming soon')).toBeInTheDocument();
  });
});
