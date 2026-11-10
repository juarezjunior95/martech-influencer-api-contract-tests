import { render, screen } from '@testing-library/react';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => {
      const messages: Record<string, string> = {
        'header.title': 'No Results Found',
        'description.text': 'Please try different filters',
        'button.text': 'Open Filters',
      };
      return messages[id] || id;
    },
  }),
}));

jest.mock('assets/Search-Empty.svg', () => 'search-empty.svg');

jest.mock('@hexa-ui/components', () => ({
  Button: ({
    children,
    onClick,
    elevated,
    size,
    variant,
    'data-testid': dataTestId,
  }: any) => (
    <button
      data-testid={dataTestId || 'action-button'}
      onClick={onClick}
      data-elevated={String(elevated)}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  ),
  Heading: ({ children, size, 'data-testid': dataTestId }: any) => (
    <h3 data-testid={dataTestId || 'heading'} data-size={size}>
      {children}
    </h3>
  ),
}));

jest.mock('components/BasicContainer/BasicContainer.styles', () => ({
  StyledBasicContainer: ({
    children,
    border,
    shadow,
    borderRadius,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'basic-container'}
      data-border={border}
      data-shadow={shadow}
      data-border-radius={borderRadius}
    >
      {children}
    </div>
  ),
}));

jest.mock('./NoResultsState.styles', () => ({
  StyledButtonsWrapper: ({ children }: any) => <div>{children}</div>,
  StyledNoResultsWrapper: ({
    children,
    css,
    style,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div
      data-testid={dataTestId || 'results-wrapper'}
      data-height={css?.height || style?.height}
      {...props}
    >
      {children}
    </div>
  ),
  StyledImage: ({ src, alt, 'data-testid': dataTestId }: any) => (
    <img data-testid={dataTestId || 'empty-image'} src={src} alt={alt} />
  ),
  StyledParagraph: ({
    children,
    colortype,
    css,
    'data-testid': dataTestId,
  }: any) => (
    <p
      data-testid={dataTestId || 'description'}
      data-colortype={colortype}
      data-width={css?.width}
    >
      {children}
    </p>
  ),
}));

import { NoResultsState } from './NoResultsState';

describe('NoResultsState', () => {
  const defaultProps = {
    type: 'investmentBreakdown',
    openModal: jest.fn(),
    headerTitleId: 'header.title',
    descriptionId: 'description.text',
    buttonTextId: 'button.text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<NoResultsState {...defaultProps} />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('should render image', () => {
      render(<NoResultsState {...defaultProps} />);

      const image = screen.getByTestId('empty-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'search-empty.svg');
    });

    it('should render heading with formatted message', () => {
      render(<NoResultsState {...defaultProps} />);

      expect(screen.getByText('No Results Found')).toBeInTheDocument();
    });

    it('should render heading with H3 size', () => {
      render(<NoResultsState {...defaultProps} />);

      const heading = screen.getByTestId('heading');
      expect(heading).toHaveAttribute('data-size', 'H3');
    });

    it('should render description with formatted message', () => {
      render(<NoResultsState {...defaultProps} />);

      expect(
        screen.getByText('Please try different filters'),
      ).toBeInTheDocument();
    });

    it('should render description with secondary color', () => {
      render(<NoResultsState {...defaultProps} />);

      const description = screen.getByTestId('description');
      expect(description).toHaveAttribute('data-colortype', 'secondary');
    });

    it('should render button with formatted message', () => {
      render(<NoResultsState {...defaultProps} />);

      expect(screen.getByText('Open Filters')).toBeInTheDocument();
    });

    it('should render button with correct props', () => {
      render(<NoResultsState {...defaultProps} />);

      const button = screen.getByTestId('action-button');
      expect(button).toHaveAttribute('data-elevated', 'true');
      expect(button).toHaveAttribute('data-size', 'medium');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });
  });

  describe('button click', () => {
    it('should call openModal when button is clicked', () => {
      const openModal = jest.fn();
      render(<NoResultsState {...defaultProps} openModal={openModal} />);

      screen.getByTestId('action-button').click();

      expect(openModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('type: investmentBreakdown', () => {
    it('should apply correct container styles', () => {
      render(<NoResultsState {...defaultProps} type="investmentBreakdown" />);

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
      expect(container).toHaveAttribute('data-shadow', 'none');
      expect(container).toHaveAttribute('data-border-radius', 'none');
    });

    it('should apply correct wrapper height', () => {
      render(<NoResultsState {...defaultProps} type="investmentBreakdown" />);

      const wrapper = screen.getByTestId('results-wrapper');
      expect(wrapper).toHaveAttribute('data-height', '47rem');
    });

    it('should apply correct image alt', () => {
      render(<NoResultsState {...defaultProps} type="investmentBreakdown" />);

      const image = screen.getByTestId('empty-image');
      expect(image).toHaveAttribute('alt', 'No Country Selected');
    });

    it('should apply correct paragraph width', () => {
      render(<NoResultsState {...defaultProps} type="investmentBreakdown" />);

      const description = screen.getByTestId('description');
      expect(description).toHaveAttribute('data-width', '30rem');
    });
  });

  describe('type: brandPower', () => {
    it('should apply correct container styles', () => {
      render(<NoResultsState {...defaultProps} type="brandPower" />);

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'small');
      expect(container).toHaveAttribute('data-shadow', 'large');
      expect(container).toHaveAttribute('data-border-radius', 'large');
    });

    it('should apply correct wrapper height', () => {
      render(<NoResultsState {...defaultProps} type="brandPower" />);

      const wrapper = screen.getByTestId('results-wrapper');
      expect(wrapper).toHaveAttribute('data-height', '26.5rem');
    });

    it('should apply correct image alt', () => {
      render(<NoResultsState {...defaultProps} type="brandPower" />);

      const image = screen.getByTestId('empty-image');
      expect(image).toHaveAttribute('alt', 'No brand Selected');
    });

    it('should apply correct paragraph width', () => {
      render(<NoResultsState {...defaultProps} type="brandPower" />);

      const description = screen.getByTestId('description');
      expect(description).toHaveAttribute('data-width', '35rem');
    });
  });

  describe('type: brandPnl', () => {
    it('should apply correct container styles', () => {
      render(<NoResultsState {...defaultProps} type="brandPnl" />);

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
      expect(container).toHaveAttribute('data-shadow', 'none');
      expect(container).toHaveAttribute('data-border-radius', 'none');
    });

    it('should apply correct wrapper height', () => {
      render(<NoResultsState {...defaultProps} type="brandPnl" />);

      const wrapper = screen.getByTestId('results-wrapper');
      expect(wrapper).toHaveAttribute('data-height', '47rem');
    });
  });

  describe('invalid type', () => {
    it('should return null for invalid type', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { container } = render(
        <NoResultsState {...defaultProps} type="invalidType" />,
      );

      expect(container.firstChild).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should log error for invalid type', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<NoResultsState {...defaultProps} type="invalidType" />);

      expect(consoleSpy).toHaveBeenCalledWith(
        'NoResultsState: "invalidType" type not found in componentStyleTab',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid to container when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(screen.getByTestId('custom-no-results')).toBeInTheDocument();
    });

    it('should apply data-testid to wrapper when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(
        screen.getByTestId('custom-no-results-wrapper'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to image when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(screen.getByTestId('custom-no-results-image')).toBeInTheDocument();
    });

    it('should apply data-testid to heading when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(
        screen.getByTestId('custom-no-results-heading'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to description when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(
        screen.getByTestId('custom-no-results-description'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to button when dataTestId is provided', () => {
      render(
        <NoResultsState {...defaultProps} dataTestId="custom-no-results" />,
      );

      expect(
        screen.getByTestId('custom-no-results-button'),
      ).toBeInTheDocument();
    });

    it('should not apply data-testid to wrapper when dataTestId is not provided', () => {
      render(<NoResultsState {...defaultProps} type="investmentBreakdown" />);

      expect(screen.getByTestId('results-wrapper')).toBeInTheDocument();
    });

    it('should not apply data-testid to other elements when dataTestId is not provided', () => {
      render(<NoResultsState {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-no-results-image'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-no-results-heading'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-no-results-description'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('custom-no-results-button'),
      ).not.toBeInTheDocument();
    });
  });

  describe('custom imageSrc', () => {
    it('should render custom image src when provided', () => {
      render(<NoResultsState {...defaultProps} imageSrc="/custom-image.png" />);

      const image = screen.getByTestId('empty-image');
      expect(image).toHaveAttribute('src', '/custom-image.png');
    });

    it('should render default SearchEmpty when imageSrc is not provided', () => {
      render(<NoResultsState {...defaultProps} />);

      const image = screen.getByTestId('empty-image');
      expect(image).toHaveAttribute('src', 'search-empty.svg');
    });
  });

  describe('secondary button', () => {
    it('should render both buttons when buttonTextId and secondaryButtonTextId are provided', () => {
      render(
        <NoResultsState
          {...defaultProps}
          secondaryButtonTextId="button.text"
          onSecondaryClick={jest.fn()}
        />,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('should call onSecondaryClick when secondary button is clicked', () => {
      const onSecondaryClick = jest.fn();

      render(
        <NoResultsState
          {...defaultProps}
          secondaryButtonTextId="button.text"
          onSecondaryClick={onSecondaryClick}
          dataTestId="nr"
        />,
      );

      screen.getByTestId('nr-secondary-button').click();

      expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    });

    it('should render primary button with secondary variant when both buttons are present', () => {
      render(
        <NoResultsState
          {...defaultProps}
          secondaryButtonTextId="button.text"
          onSecondaryClick={jest.fn()}
          dataTestId="nr"
        />,
      );

      const primaryBtn = screen.getByTestId('nr-button');
      expect(primaryBtn).toHaveAttribute('data-variant', 'secondary');
    });

    it('should apply secondaryButtonVariant to secondary button', () => {
      render(
        <NoResultsState
          {...defaultProps}
          secondaryButtonTextId="button.text"
          secondaryButtonVariant="primary"
          onSecondaryClick={jest.fn()}
          dataTestId="nr"
        />,
      );

      const secondaryBtn = screen.getByTestId('nr-secondary-button');
      expect(secondaryBtn).toHaveAttribute('data-variant', 'primary');
    });
  });

  describe('buttonVariant', () => {
    it('should use primary variant by default', () => {
      render(<NoResultsState {...defaultProps} />);

      const button = screen.getByTestId('action-button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('should apply secondary variant when specified', () => {
      render(<NoResultsState {...defaultProps} buttonVariant="secondary" />);

      const button = screen.getByTestId('action-button');
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('optional content', () => {
    it('should not render heading when headerTitleId is not provided', () => {
      render(<NoResultsState {...defaultProps} headerTitleId={undefined} />);

      expect(screen.queryByText('No Results Found')).not.toBeInTheDocument();
    });

    it('should not render description when descriptionId is not provided', () => {
      render(<NoResultsState {...defaultProps} descriptionId={undefined} />);

      expect(
        screen.queryByText('Please try different filters'),
      ).not.toBeInTheDocument();
    });

    it('should not render button when buttonTextId is not provided', () => {
      render(<NoResultsState {...defaultProps} buttonTextId={undefined} />);

      expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
    });
  });

  describe('type: strategicInnovationPillars', () => {
    it('should apply correct container styles', () => {
      render(
        <NoResultsState {...defaultProps} type="strategicInnovationPillars" />,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
      expect(container).toHaveAttribute('data-shadow', 'none');
      expect(container).toHaveAttribute('data-border-radius', 'none');
    });
  });

  describe('type: audienceTargeting', () => {
    it('should apply correct container styles', () => {
      render(<NoResultsState {...defaultProps} type="audienceTargeting" />);

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'small');
      expect(container).toHaveAttribute('data-shadow', 'large');
      expect(container).toHaveAttribute('data-border-radius', 'large');
    });

    it('should apply correct wrapper height', () => {
      render(<NoResultsState {...defaultProps} type="audienceTargeting" />);

      const wrapper = screen.getByTestId('results-wrapper');
      expect(wrapper).toHaveAttribute('data-height', '30rem');
    });

    it('should apply correct image alt', () => {
      render(<NoResultsState {...defaultProps} type="audienceTargeting" />);

      const image = screen.getByTestId('empty-image');
      expect(image).toHaveAttribute('alt', 'No Audience Data Available');
    });
  });
});
