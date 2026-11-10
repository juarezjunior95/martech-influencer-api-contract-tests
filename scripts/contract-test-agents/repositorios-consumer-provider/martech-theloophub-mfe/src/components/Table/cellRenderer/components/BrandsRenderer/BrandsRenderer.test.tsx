import { render, screen } from '@testing-library/react';
import { getAssetHostForServices } from 'config/api';

import { BrandCellType } from '../../../types';
import { BrandsRenderer } from './BrandsRenderer';

const assetHost = getAssetHostForServices();

const brands = [
  {
    src: '/sites/g/files/wnfebl11871/files/brands/corona.svg',
    name: 'Corona',
    variation: '4.3',
    variationMeasure: '%',
    variationDirection: 'up',
    country: 'BRA',
    country_src: `${assetHost}/countries/rounded_flags/BRA.png`,
  },
] as BrandCellType[];

describe('Ag Grid BrandsRenderer', () => {
  test('render correctly', () => {
    render(<BrandsRenderer brands={brands} />);

    const logo = screen.getByAltText(brands[0].name);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', brands[0].src);
    expect(screen.getByAltText('BRA')).toHaveAttribute(
      'src',
      `${assetHost}/countries/rounded_flags/BRA.png`,
    );
  });

  describe('data-testid', () => {
    it('should render with data-testid when provided', () => {
      render(<BrandsRenderer brands={brands} dataTestId="test-brands" />);

      expect(screen.getByTestId('brands-test-brands')).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-item-test-brands-0'),
      ).toBeInTheDocument();
      expect(screen.getByAltText('Corona')).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-country-test-brands-0'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-variation-test-brands-0'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when not provided', () => {
      const { container } = render(<BrandsRenderer brands={brands} />);

      const elementsWithTestId = container.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });

    it('should render multiple brands with correct indices', () => {
      const multipleBrands = [
        ...brands,
        {
          src: '/sites/g/files/wnfebl11871/files/brands/budweiser.svg',
          name: 'Budweiser',
          variation: '2.1',
          variationMeasure: '%',
          variationDirection: 'down',
          country: 'USA',
          country_src: `${assetHost}/countries/rounded_flags/USA.png`,
        },
      ] as BrandCellType[];

      render(<BrandsRenderer brands={multipleBrands} dataTestId="multi" />);

      expect(screen.getByTestId('brand-item-multi-0')).toBeInTheDocument();
      expect(screen.getByTestId('brand-item-multi-1')).toBeInTheDocument();
      expect(screen.getByAltText('Corona')).toBeInTheDocument();
      expect(screen.getByAltText('Budweiser')).toBeInTheDocument();
    });
  });
});
