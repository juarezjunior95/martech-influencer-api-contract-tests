import { render, screen, waitFor } from '@testing-library/react';
import { getAssetHostForServices } from 'config/api';

const mockGetCountry = jest.fn();

jest.mock('services', () => ({
  ImagesService: {
    getInstance: jest.fn(() => ({
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
    })),
  },
}));

jest.mock('assets/logo.png', () => 'logo.png');

jest.mock('components', () => ({
  Skeleton: ({ width, height, length, dataTestId }: any) => (
    <div
      className="skeleton"
      data-testid={dataTestId}
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Loading...
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledFlag: ({ src, alt, 'data-testid': testId, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      data-testid={testId}
      className="country-flag"
      {...props}
    />
  ),
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => (
    <a href={to} data-testid="cover-link">
      {children}
    </a>
  ),
}));

jest.mock('./Cover.styles', () => ({
  StyledCoverContainer: ({ children, 'data-testid': testId }: any) => (
    <div className="cover-container" data-testid={testId}>
      {children}
    </div>
  ),
  StyledCoverMainSection: ({
    children,
    className,
    'data-testid': testId,
  }: any) => (
    <div className={`main-section ${className}`} data-testid={testId}>
      {children}
    </div>
  ),
  StyledCoverParagraph: ({
    children,
    style,
    centerText,
    'data-testid': testId,
  }: any) => (
    <p
      className="cover-paragraph"
      data-testid={testId}
      style={style}
      data-center-text={String(centerText)}
    >
      {children}
    </p>
  ),
  StyledCoverHeading: ({
    children,
    size,
    style,
    centerText,
    'data-testid': testId,
  }: any) => (
    <h2
      className="cover-heading"
      data-testid={testId}
      data-size={size}
      style={style}
      data-center-text={String(centerText)}
    >
      {children}
    </h2>
  ),
  StyledCoverCountrySection: ({ children, 'data-testid': testId }: any) => (
    <div className="country-section" data-testid={testId}>
      {children}
    </div>
  ),
  StyledCoverCountryItem: ({ children, 'data-testid': testId }: any) => (
    <div className="country-item" data-testid={testId}>
      {children}
    </div>
  ),
  StyledCoverCountryItemSeparator: () => <div className="country-separator" />,
  StyledCoverBlackParagraph: ({ children, 'data-testid': testId }: any) => (
    <p className="country-name" data-testid={testId}>
      {children}
    </p>
  ),
  StyledCoverFooter: ({ children, 'data-testid': testId }: any) => (
    <div className="cover-footer" data-testid={testId}>
      {children}
    </div>
  ),
  StyledLogoContainer: ({
    children,
    centerLogo,
    'data-testid': testId,
  }: any) => (
    <div
      className="logo-container"
      data-testid={testId}
      data-center-logo={String(centerLogo)}
    >
      {children}
    </div>
  ),
  StyledSmallCoverParagraph: ({ children, 'data-testid': testId }: any) => (
    <p className="small-paragraph" data-testid={testId}>
      {children}
    </p>
  ),
  StyledCoverLink: ({ children, to }: any) => (
    <a href={to} className="styled-link">
      {children}
    </a>
  ),
}));

import { Cover } from './Cover';

describe('Cover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should render Skeleton when loading is true', () => {
      const { container } = render(<Cover loading={true} />);

      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('should render Skeleton with correct dimensions', () => {
      const { container } = render(<Cover loading={true} />);

      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toHaveAttribute('data-width', '1668px');
      expect(skeleton).toHaveAttribute('data-height', '938px');
      expect(skeleton).toHaveAttribute('data-length', '1');
    });

    it('should not render content when loading', () => {
      const { container } = render(<Cover loading={true} name="Test" />);

      expect(
        container.querySelector('.cover-container'),
      ).not.toBeInTheDocument();
    });
  });

  describe('category', () => {
    it('should render category when provided', () => {
      render(<Cover category="Test Category" />);

      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    it('should not render category paragraph when not provided', () => {
      const { container } = render(<Cover name="Test Name" />);

      const paragraphs = container.querySelectorAll('.cover-paragraph');
      const categoryParagraph = Array.from(paragraphs).find(
        (p) => p.textContent === 'Test Category',
      );
      expect(categoryParagraph).toBeUndefined();
    });

    it('should apply no-category class when category is not provided', () => {
      const { container } = render(<Cover name="Test" />);

      const mainSection = container.querySelector('.main-section');
      expect(mainSection).toHaveClass('no-category');
    });

    it('should apply category-and-name class when both are provided', () => {
      const { container } = render(<Cover category="Category" name="Name" />);

      const mainSection = container.querySelector('.main-section');
      expect(mainSection).toHaveClass('category-and-name');
    });
  });

  describe('name', () => {
    it('should render name when provided', () => {
      render(<Cover name="Test Name" />);

      expect(screen.getByText('Test Name')).toBeInTheDocument();
    });

    it('should render name with H2 size', () => {
      render(<Cover name="Test Name" />);

      const heading = screen.getByText('Test Name');
      expect(heading).toHaveAttribute('data-size', 'H2');
    });

    it('should render name with 96px font size', () => {
      render(<Cover name="Test Name" />);

      const heading = screen.getByText('Test Name');
      expect(heading).toHaveStyle({ fontSize: '96px' });
    });
  });

  describe('subname', () => {
    it('should render subname when provided', () => {
      render(<Cover subname="Test Subname" />);

      expect(screen.getByText('Test Subname')).toBeInTheDocument();
    });

    it('should render subname with 64px font size', () => {
      render(<Cover subname="Test Subname" />);

      const heading = screen.getByText('Test Subname');
      expect(heading).toHaveStyle({ fontSize: '64px' });
    });
  });

  describe('countries', () => {
    const countries = [
      { code: 'BRA', name: 'Brazil' },
      { code: 'USA', name: 'United States' },
    ];

    beforeEach(() => {
      mockGetCountry.mockImplementation(({ name }: { name: string }) =>
        Promise.resolve({
          data: {
            url: `${getAssetHostForServices()}/countries/rounded_flags/${name}.png`,
          },
        }),
      );
    });

    it('should render countries section when countries provided', () => {
      const { container } = render(<Cover countries={countries} />);

      expect(container.querySelector('.country-section')).toBeInTheDocument();
    });

    it('should render country flags', async () => {
      const { container } = render(<Cover countries={countries} />);

      await waitFor(() => {
        expect(container.querySelectorAll('.country-flag')).toHaveLength(2);
      });
    });

    it('should render country flags with correct src', async () => {
      const { container } = render(<Cover countries={countries} />);
      const assetHost = getAssetHostForServices();

      await waitFor(() => {
        const flags = container.querySelectorAll('.country-flag');
        expect(flags).toHaveLength(2);
        expect(flags[0]).toHaveAttribute(
          'src',
          `${assetHost}/countries/rounded_flags/BRA.png`,
        );
        expect(flags[1]).toHaveAttribute(
          'src',
          `${assetHost}/countries/rounded_flags/USA.png`,
        );
      });
    });

    it('should render country names in uppercase', () => {
      render(<Cover countries={countries} />);

      expect(screen.getByText('BRAZIL')).toBeInTheDocument();
      expect(screen.getByText('UNITED STATES')).toBeInTheDocument();
    });

    it('should render separator between countries', () => {
      const { container } = render(<Cover countries={countries} />);

      const separators = container.querySelectorAll('.country-separator');
      expect(separators).toHaveLength(1);
    });

    it('should not render separator before first country', () => {
      const { container } = render(
        <Cover countries={[{ code: 'BRA', name: 'Brazil' }]} />,
      );

      expect(
        container.querySelector('.country-separator'),
      ).not.toBeInTheDocument();
    });

    it('should not render country without code', () => {
      render(<Cover countries={[{ code: '', name: 'Unknown' }]} />);

      expect(screen.queryByText('UNKNOWN')).not.toBeInTheDocument();
    });
  });

  describe('period', () => {
    it('should render period when provided', () => {
      render(<Cover period="Q1 2024" />);

      expect(screen.getByText('Q1 2024')).toBeInTheDocument();
    });

    it('should render period with 36px font size', () => {
      render(<Cover period="Q1 2024" />);

      const period = screen.getByText('Q1 2024');
      expect(period).toHaveStyle({ fontSize: '36px' });
    });
  });

  describe('showLogo', () => {
    it('should render logo when showLogo is true', () => {
      const { container } = render(<Cover showLogo={true} />);

      expect(container.querySelector('.logo-container')).toBeInTheDocument();
      expect(screen.getByAltText('One Way')).toBeInTheDocument();
    });

    it('should not render logo when showLogo is false', () => {
      const { container } = render(<Cover showLogo={false} />);

      expect(
        container.querySelector('.logo-container'),
      ).not.toBeInTheDocument();
    });

    it('should not render logo when showLogo is not provided', () => {
      const { container } = render(<Cover />);

      expect(
        container.querySelector('.logo-container'),
      ).not.toBeInTheDocument();
    });
  });

  describe('showLink', () => {
    it('should render link by default when showLogo is true', () => {
      const { container } = render(<Cover showLogo={true} />);

      expect(container.querySelector('.styled-link')).toBeInTheDocument();
      expect(screen.getByText('Click here')).toBeInTheDocument();
    });

    it('should not render link when showLink is false', () => {
      const { container } = render(<Cover showLogo={true} showLink={false} />);

      expect(container.querySelector('.styled-link')).not.toBeInTheDocument();
    });

    it('should render link with correct text', () => {
      render(<Cover showLogo={true} showLink={true} />);

      expect(
        screen.getByText(/unlock insights on the One Way Platform/),
      ).toBeInTheDocument();
    });
  });

  describe('centerLogo', () => {
    it('should pass centerLogo false by default', () => {
      const { container } = render(<Cover showLogo={true} />);

      const logoContainer = container.querySelector('.logo-container');
      expect(logoContainer).toHaveAttribute('data-center-logo', 'false');
    });

    it('should pass centerLogo true when provided', () => {
      const { container } = render(<Cover showLogo={true} centerLogo={true} />);

      const logoContainer = container.querySelector('.logo-container');
      expect(logoContainer).toHaveAttribute('data-center-logo', 'true');
    });
  });

  describe('centerText', () => {
    it('should pass centerText false by default', () => {
      render(<Cover category="Test" />);

      const paragraph = screen.getByText('Test');
      expect(paragraph).toHaveAttribute('data-center-text', 'false');
    });

    it('should pass centerText true when provided', () => {
      render(<Cover category="Test" centerText={true} />);

      const paragraph = screen.getByText('Test');
      expect(paragraph).toHaveAttribute('data-center-text', 'true');
    });

    it('should apply centerText to name heading', () => {
      render(<Cover name="Test Name" centerText={true} />);

      const heading = screen.getByText('Test Name');
      expect(heading).toHaveAttribute('data-center-text', 'true');
    });

    it('should apply centerText to subname heading', () => {
      render(<Cover subname="Test Subname" centerText={true} />);

      const heading = screen.getByText('Test Subname');
      expect(heading).toHaveAttribute('data-center-text', 'true');
    });
  });

  describe('footer', () => {
    it('should always render footer', () => {
      const { container } = render(<Cover />);

      expect(container.querySelector('.cover-footer')).toBeInTheDocument();
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(<Cover dataTestId="cover-powerbook" />);

      expect(screen.getByTestId('cover-powerbook')).toBeInTheDocument();
    });

    it('should apply data-testid to main section when dataTestId prop is provided', () => {
      render(<Cover dataTestId="cover-powerbook" name="Test" />);

      expect(
        screen.getByTestId('main-section-cover-powerbook'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to footer when dataTestId prop is provided', () => {
      render(<Cover dataTestId="cover-powerbook" />);

      expect(screen.getByTestId('footer-cover-powerbook')).toBeInTheDocument();
    });

    it('should apply data-testid to skeleton when loading', () => {
      render(<Cover loading={true} dataTestId="cover-powerbook" />);

      expect(
        screen.getByTestId('skeleton-cover-powerbook'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(<Cover />);

      expect(container.querySelector('.cover-container')).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="cover-powerbook"]'),
      ).not.toBeInTheDocument();
    });
  });
});
