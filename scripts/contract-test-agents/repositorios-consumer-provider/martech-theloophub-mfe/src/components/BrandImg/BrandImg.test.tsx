import { fireEvent, screen } from '@testing-library/react';
import { render } from 'utils/test/test-utils';

import { BrandImg } from './BrandImg';

describe('BrandImg Component', () => {
  it('should render with provided src', () => {
    render(
      <BrandImg
        src="/brands/skol-square.png"
        alt="Skol"
        dataTestId="test-id"
      />,
    );

    const img = screen.getByTestId('brand-img-active-test-id');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/brands/skol-square.png');
    expect(img).toHaveAttribute('alt', 'Skol');
  });

  it('should not render when src is empty', () => {
    render(<BrandImg src="" alt="Skol" dataTestId="test-id" />);

    expect(
      screen.queryByTestId('brand-img-active-test-id'),
    ).not.toBeInTheDocument();
  });

  it('should render divider with custom dataTestId when divider is true', () => {
    render(
      <BrandImg
        src="/brands/skol-square.png"
        alt="Skol"
        divider={true}
        dataTestId="custom-brand"
      />,
    );

    expect(
      screen.getByTestId('brand-img-divider-custom-brand'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-img-active-custom-brand'),
    ).toBeInTheDocument();
  });

  it('should keep same image when load fails', () => {
    render(
      <BrandImg
        src="/brands/skol-square.png"
        alt="Skol"
        dataTestId="brand-error"
      />,
    );

    const img = screen.getByTestId('brand-img-active-brand-error');
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', '/brands/skol-square.png');
  });
});
