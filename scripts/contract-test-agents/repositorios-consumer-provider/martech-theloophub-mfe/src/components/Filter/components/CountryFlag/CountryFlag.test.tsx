import { render, screen } from '@testing-library/react';
import { getAssetHostForServices } from 'config/api';
import * as hooks from 'hooks';
import * as filterUtils from 'utils/filter';

import { CountryFlag } from './CountryFlag';

const mockGetCountry = jest.fn();

jest.mock('services', () => ({
  ImagesService: {
    getInstance: jest.fn(() => ({
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
    })),
  },
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
}));
jest.mock('utils/filter', () => {
  const actual =
    jest.requireActual<typeof import('utils/filter')>('utils/filter');
  return {
    ...actual,
    getRegionIdentifier: jest.fn(),
  };
});
jest.mock('shared/Styles', () => ({
  StyledFlag: ({
    src,
    alt,
    'data-testid': dataTestId,
    ...props
  }: {
    src: string;
    alt: string;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <img
      src={src}
      alt={alt}
      data-testid={dataTestId || 'country-flag'}
      {...props}
    />
  ),
}));

describe('CountryFlag', () => {
  let mockUseCurrentPage: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;
  let mockGetRegionIdentifier: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetCountry.mockResolvedValue({
      data: {
        url: `${getAssetHostForServices()}/countries/rounded_flags/BRA.png`,
      },
    });

    mockUseCurrentPage = jest.spyOn(hooks, 'useCurrentPage');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');
    mockGetRegionIdentifier = jest.spyOn(filterUtils, 'getRegionIdentifier');

    mockUseCurrentPage.mockReturnValue({ currentPage: 'test-page' });
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        zone: 'LATAM',
        country: 'BRA',
      },
    });
    mockGetRegionIdentifier.mockReturnValue('BRA');
  });

  it('renders flag image with asset URL and alt', async () => {
    render(<CountryFlag />);

    const flag = await screen.findByTestId('country-flag');
    expect(flag).toHaveAttribute(
      'src',
      `${getAssetHostForServices()}/countries/rounded_flags/BRA.png`,
    );
    expect(flag).toHaveAttribute('alt', 'BRA');
  });

  it('uses current page to read applied filters', () => {
    render(<CountryFlag />);

    expect(mockUseCurrentPage).toHaveBeenCalled();
    expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
    expect(mockGetRegionIdentifier).toHaveBeenCalledWith('LATAM', 'BRA');
  });

  it('returns null when region is empty', () => {
    mockGetRegionIdentifier.mockReturnValue('');
    const { container } = render(<CountryFlag />);
    expect(container.firstChild).toBeNull();
  });

  it('supports custom data-testid', async () => {
    render(<CountryFlag dataTestId="custom" />);
    expect(
      await screen.findByTestId('country-flag-custom'),
    ).toBeInTheDocument();
  });

  it('updates when current page changes', () => {
    const { rerender } = render(<CountryFlag />);
    mockUseCurrentPage.mockReturnValue({ currentPage: 'new-page' });
    rerender(<CountryFlag />);
    expect(mockUsePageFilterApplied).toHaveBeenCalledWith('new-page');
  });
});
