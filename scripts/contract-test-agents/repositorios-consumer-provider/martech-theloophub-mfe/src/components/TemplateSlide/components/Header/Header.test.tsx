import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size }: any) => (
    <h3 data-testid="heading" data-size={size}>
      {children}
    </h3>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Calendar: () => <span>CalendarIcon</span>,
}));

jest.mock('hooks', () => ({
  useBrandImage: jest.fn((brandId?: string) =>
    brandId ? 'https://cdn.example.com/brands/brand-123/square.png' : '',
  ),
}));

jest.mock('components/BrandImg', () => ({
  BrandImg: ({ src, width, height }: any) => (
    <img
      data-testid="brand-img"
      data-src={src}
      data-width={width}
      data-height={height}
      alt="brand"
    />
  ),
}));

jest.mock('utils', () => ({
  getCountryAssetImageUrl: jest.fn((countryId?: string) =>
    countryId
      ? Promise.resolve(
          `https://cdn.example.com/countries/rounded_flags/${countryId}.png`,
        )
      : Promise.resolve(null),
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledRowContainer: ({ children, marginBottom }: any) => (
    <div data-testid="row-container" data-margin-bottom={marginBottom}>
      {children}
    </div>
  ),
}));

jest.mock('./Header.styles', () => ({
  StyledCalendarIcon: ({ icon: Icon }: any) => (
    <span data-testid="calendar-icon">
      <Icon />
    </span>
  ),
  StyledDivider: () => <div data-testid="divider" />,
  StyledDot: () => <span data-testid="dot" />,
  StyledFlagContainer: ({ children }: any) => (
    <div data-testid="flag-container">{children}</div>
  ),
  StyledHeaderFlag: ({ src, alt, ...props }: any) => (
    <img data-testid={props['data-testid']} src={src} alt={alt} />
  ),
  StyledHeadlineText: ({ children, size }: any) => (
    <span data-testid="headline-text" data-size={size}>
      {children}
    </span>
  ),
  StyledHorizontalDivider: () => <hr data-testid="horizontal-divider" />,
  StyledMeasureText: ({ children }: any) => (
    <span data-testid="measure-text">{children}</span>
  ),
  StyledPeriodText: ({ children }: any) => (
    <span data-testid="period-text">{children}</span>
  ),
  StyledSpacedContainer: ({ children }: any) => (
    <div data-testid="spaced-container">{children}</div>
  ),
  StyledVerticalDivider: () => <div data-testid="vertical-divider" />,
}));

import { Header } from './Header';

describe('Header', () => {
  it('should render title in Heading', () => {
    render(<Header title="Test Title" />);

    const heading = screen.getByTestId('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
    expect(heading).toHaveAttribute('data-size', 'H3');
  });

  it('should render measure when provided', () => {
    render(<Header title="Title" measure="Test Measure" />);

    expect(screen.getByTestId('measure-text')).toHaveTextContent(
      'Test Measure',
    );
  });

  it('should not render measure when not provided', () => {
    render(<Header title="Title" />);

    expect(screen.queryByTestId('measure-text')).not.toBeInTheDocument();
  });

  it('should render period with calendar icon when provided', () => {
    render(<Header title="Title" period="Q1 2024" />);

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('period-text')).toHaveTextContent('Q1 2024');
    expect(screen.getByTestId('vertical-divider')).toBeInTheDocument();
  });

  it('should not render period elements when not provided', () => {
    render(<Header title="Title" />);

    expect(screen.queryByTestId('calendar-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('period-text')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vertical-divider')).not.toBeInTheDocument();
  });

  it('should render horizontal divider when divider is true (default)', () => {
    render(<Header title="Title" />);

    expect(screen.getByTestId('horizontal-divider')).toBeInTheDocument();
  });

  it('should not render horizontal divider when divider is false', () => {
    render(<Header title="Title" divider={false} />);

    expect(screen.queryByTestId('horizontal-divider')).not.toBeInTheDocument();
  });

  it('should render headline when provided', () => {
    render(<Header title="Title" headline="Test Headline" />);

    expect(screen.getByTestId('dot')).toBeInTheDocument();
    expect(screen.getByTestId('headline-text')).toHaveTextContent(
      'Test Headline',
    );
    expect(screen.getByTestId('headline-text')).toHaveAttribute(
      'data-size',
      'H5',
    );
  });

  it('should not render headline when not provided', () => {
    render(<Header title="Title" />);

    expect(screen.queryByTestId('dot')).not.toBeInTheDocument();
    expect(screen.queryByTestId('headline-text')).not.toBeInTheDocument();
  });

  it('should render countryId flag when provided', async () => {
    render(<Header title="Title" countryId="BRA" />);

    const flags = await waitFor(() => screen.getAllByTestId('country-flag'));
    expect(flags).toHaveLength(1);
    expect(flags[0]).toHaveAttribute(
      'src',
      'https://cdn.example.com/countries/rounded_flags/BRA.png',
    );
    expect(flags[0]).toHaveAttribute('alt', 'BRA flag');
  });

  it('should render countryId2 flag when provided', async () => {
    render(<Header title="Title" countryId2="USA" />);

    const flags = await waitFor(() => screen.getAllByTestId('country-flag'));
    expect(flags).toHaveLength(1);
    expect(flags[0]).toHaveAttribute(
      'src',
      'https://cdn.example.com/countries/rounded_flags/USA.png',
    );
    expect(flags[0]).toHaveAttribute('alt', 'USA flag');
  });

  it('should render both country flags when both provided', async () => {
    render(<Header title="Title" countryId="BRA" countryId2="USA" />);

    const flags = await waitFor(() => screen.getAllByTestId('country-flag'));
    expect(flags).toHaveLength(2);
  });

  it('should render brandId image when provided', async () => {
    render(<Header title="Title" brandId="brand-123" />);

    const brandImg = await waitFor(() => screen.getByTestId('brand-img'));
    expect(brandImg).toBeInTheDocument();
    expect(brandImg).toHaveAttribute(
      'data-src',
      'https://cdn.example.com/brands/brand-123/square.png',
    );
    expect(brandImg).toHaveAttribute('data-width', '32px');
    expect(brandImg).toHaveAttribute('data-height', '32px');
  });

  it('should not render brandId image when not provided', () => {
    render(<Header title="Title" />);

    expect(screen.queryByTestId('brand-img')).not.toBeInTheDocument();
  });

  it('should render divider between brand/countryId2 and countryId', async () => {
    render(<Header title="Title" brandId="brand-123" countryId="BRA" />);

    await waitFor(() => {
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });
  });

  it('should render divider between countryId2 and countryId', async () => {
    render(<Header title="Title" countryId2="USA" countryId="BRA" />);

    await waitFor(() => {
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });
  });

  it('should not render divider when only countryId is provided', () => {
    render(<Header title="Title" countryId="BRA" />);

    expect(screen.queryByTestId('divider')).not.toBeInTheDocument();
  });

  it('should render StyledSpacedContainer', () => {
    render(<Header title="Title" />);

    expect(screen.getByTestId('spaced-container')).toBeInTheDocument();
  });

  it('should render StyledFlagContainer', () => {
    render(<Header title="Title" />);

    expect(screen.getByTestId('flag-container')).toBeInTheDocument();
  });

  it('should render row container with marginBottom sm for headline', () => {
    render(<Header title="Title" headline="Headline" />);

    const rowContainers = screen.getAllByTestId('row-container');
    const headlineContainer = rowContainers.find(
      (el) => el.dataset.marginBottom === 'sm',
    );
    expect(headlineContainer).toBeInTheDocument();
  });
});
