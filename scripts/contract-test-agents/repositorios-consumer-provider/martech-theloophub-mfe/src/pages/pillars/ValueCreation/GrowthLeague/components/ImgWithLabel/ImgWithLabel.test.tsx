import { render, screen } from '@testing-library/react';

import { ImgWithLabel } from './ImgWithLabel';

describe('ImgWithLabel Component', () => {
  it('renders the correct image and value for country variant', () => {
    const imgSrc = 'https://example.com/flag.png';
    const value = 'USA';

    render(<ImgWithLabel value={value} img={imgSrc} variant="country" />);

    const imageElement = screen.getByAltText(`Flag ${value}`);
    expect(imageElement).toHaveAttribute('src', imgSrc);
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it('renders the correct image and value for brand variant', () => {
    const imgSrc = 'https://example.com/brand-logo.png';
    const value = 'Brahma';

    render(<ImgWithLabel value={value} img={imgSrc} variant="brand" />);

    const imageElement = screen.getByAltText(`${value} logo`);
    expect(imageElement).toHaveAttribute('src', imgSrc);
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it('renders with a number value and defaults to country variant', () => {
    const imgSrc = 'https://example.com/flag.png';
    const value = 100;

    render(<ImgWithLabel value={value} img={imgSrc} />);

    const imageElement = screen.getByAltText(`Flag ${value}`);
    expect(imageElement).toHaveAttribute('src', imgSrc);
    expect(screen.getByText(String(value))).toBeInTheDocument();
  });

  it('activates truncation styles when colDef.field is "brand"', () => {
    render(
      <ImgWithLabel
        value="Brahma"
        img="https://example.com/brand-logo.png"
        variant="brand"
        colDef={{ field: 'brand' }}
        dataTestId="brand"
      />,
    );

    const text = screen.getByTestId(
      'brand-img-with-label-text-dynamic-truncation',
    );
    expect(text).toHaveStyle({
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    });
  });

  it('does not activate truncation styles when colDef is absent', () => {
    render(
      <ImgWithLabel
        value="Brazil"
        img="https://example.com/flag.png"
        dataTestId="country"
      />,
    );

    const text = screen.getByTestId(
      'country-img-with-label-text-dynamic-truncation',
    );
    expect(text).toHaveStyle({
      textOverflow: 'clip',
      overflow: 'visible',
      whiteSpace: 'normal',
    });
  });
});

describe('data-testid Rendering', () => {
  it('renders all testid anchors when dataTestId is provided', () => {
    render(
      <ImgWithLabel
        value="Brazil"
        img="https://example.com/flag.png"
        dataTestId="country"
      />,
    );

    expect(screen.getByTestId('img-with-label-country')).toBeInTheDocument();
    expect(
      screen.getByTestId('img-with-label-img-country'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('country-img-with-label-text-dynamic-truncation'),
    ).toBeInTheDocument();
  });

  it('renders no data-testid attributes when dataTestId is not provided', () => {
    const { container } = render(
      <ImgWithLabel value="Brazil" img="https://example.com/flag.png" />,
    );

    expect(container.querySelectorAll('[data-testid]')).toHaveLength(0);
  });

  it('renders all testid anchors for brand variant', () => {
    render(
      <ImgWithLabel
        value="Toyota"
        img="https://example.com/logo.png"
        variant="brand"
        dataTestId="brand"
      />,
    );

    expect(screen.getByTestId('img-with-label-brand')).toBeInTheDocument();
    expect(screen.getByTestId('img-with-label-img-brand')).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-img-with-label-text-dynamic-truncation'),
    ).toBeInTheDocument();
  });
});
