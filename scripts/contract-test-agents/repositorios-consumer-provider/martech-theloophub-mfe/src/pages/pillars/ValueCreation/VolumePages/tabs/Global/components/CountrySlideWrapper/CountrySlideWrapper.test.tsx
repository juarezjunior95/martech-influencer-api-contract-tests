import { render } from '@testing-library/react';

import { CountrySlideWrapper } from './CountrySlideWrapper';

const mockUseCountrySlideData = jest.fn();
const mockCountrySlide = jest.fn();

jest.mock('pages/pillars/ValueCreation/VolumePages/contexts', () => ({
  useRegisterLoading: jest.fn(),
  useVolumePagesKpi: jest.fn(() => ({
    kpi: 'volume',
    kpiName: 'Volume',
  })),
}));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/hooks/useCountrySlideData',
  () => ({
    useCountrySlideData: (kpi: unknown, subFilters: unknown) =>
      mockUseCountrySlideData(kpi, subFilters),
  }),
);

jest.mock('pages/pillars/ValueCreation/VolumePages/components', () => ({
  CountrySlide: (props: any) => {
    mockCountrySlide(props);
    return (
      <div data-testid="country-slide" data-country-code={props.countryCode} />
    );
  },
}));

const mockCountryData = {
  data: { 'big-numbers': [] },
  loading: false,
  error: null,
};

const mockConfig = {
  mainCoverSection: 'bra-cover',
  pages: [],
  subFilters: {
    country: 'BRA',
    zone: 'SAZ',
  },
};

const defaultProps = {
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  countryCode: 'BRA',
  subFilters: { country: 'BRA', zone: 'SAZ' },
  config: mockConfig as any,
  period: "JAN'25",
  dataTestId: 'test',
};

describe('CountrySlideWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCountrySlideData.mockReturnValue(mockCountryData);
  });

  it('calls useCountrySlideData with the provided subFilters', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockUseCountrySlideData).toHaveBeenCalledWith(
      'volume',
      defaultProps.subFilters,
    );
  });

  it('renders CountrySlide', () => {
    const { getByTestId } = render(<CountrySlideWrapper {...defaultProps} />);

    expect(getByTestId('country-slide')).toBeInTheDocument();
  });

  it('passes countryCode to CountrySlide', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockCountrySlide).toHaveBeenCalledWith(
      expect.objectContaining({ countryCode: 'BRA' }),
    );
  });

  it('passes countryData returned from useCountrySlideData to CountrySlide', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockCountrySlide).toHaveBeenCalledWith(
      expect.objectContaining({ countryData: mockCountryData }),
    );
  });

  it('passes period to CountrySlide', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockCountrySlide).toHaveBeenCalledWith(
      expect.objectContaining({ period: "JAN'25" }),
    );
  });

  it('passes config to CountrySlide', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockCountrySlide).toHaveBeenCalledWith(
      expect.objectContaining({ config: mockConfig }),
    );
  });

  it('passes getPageByName to CountrySlide', () => {
    render(<CountrySlideWrapper {...defaultProps} />);

    expect(mockCountrySlide).toHaveBeenCalledWith(
      expect.objectContaining({
        getPageByName: defaultProps.getPageByName,
      }),
    );
  });

  it('re-calls useCountrySlideData when subFilters change', () => {
    const { rerender } = render(<CountrySlideWrapper {...defaultProps} />);

    const newSubFilters = { country: 'USA', zone: 'AMER' };
    rerender(
      <CountrySlideWrapper {...defaultProps} subFilters={newSubFilters} />,
    );

    expect(mockUseCountrySlideData).toHaveBeenCalledWith(
      'volume',
      newSubFilters,
    );
  });
});
