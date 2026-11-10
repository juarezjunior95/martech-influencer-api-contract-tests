import { render, screen } from '@testing-library/react';

jest.mock('hooks', () => ({
  usePngCopyFeedback: () => ({
    copyElementAsPng: jest.fn().mockResolvedValue(undefined),
    isExporting: false,
    isActionVisible: false,
    feedbackMessage: '',
  }),
}));

jest.mock('components', () => ({
  CopyIcon: () => <svg data-testid="copy-icon" />,
}));

jest.mock('./components', () => ({
  Header: ({
    title,
    measure,
    headline,
    period,
    countryId,
    countryId2,
    brandId,
    divider,
  }: any) => (
    <div
      data-testid="header"
      data-title={title}
      data-measure={measure}
      data-headline={headline}
      data-period={period}
      data-country-id={countryId}
      data-country-id2={countryId2}
      data-brand-id={brandId}
      data-divider={divider}
    >
      Header
    </div>
  ),
  Footer: ({ footnotes, page }: any) => (
    <div data-testid="footer" data-footnotes={footnotes} data-page={page}>
      Footer
    </div>
  ),
}));

jest.mock('./TemplateSlide.styles', () => ({
  StyledTemplateContainer: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'template-container'}>{children}</div>
  ),
  StyledTemplateContent: ({ children }: any) => (
    <div data-testid="template-content">{children}</div>
  ),
  StyledFlexContainer: ({ children }: any) => (
    <div data-testid="flex-container">{children}</div>
  ),
  StyledPngCopyActions: ({ children }: any) => (
    <div data-testid="png-copy-actions">{children}</div>
  ),
  StyledPngCopyButton: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

import { TemplateSlide } from './TemplateSlide';

describe('TemplateSlide', () => {
  const defaultProps = {
    title: 'Test Title',
    children: <div data-testid="children">Children Content</div>,
  };

  it('should render StyledTemplateContainer', () => {
    render(<TemplateSlide {...defaultProps} />);

    expect(screen.getByTestId('template-container')).toBeInTheDocument();
  });

  it('should render StyledTemplateContent', () => {
    render(<TemplateSlide {...defaultProps} />);

    expect(screen.getByTestId('template-content')).toBeInTheDocument();
  });

  it('should render Header with title', () => {
    render(<TemplateSlide {...defaultProps} />);

    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('data-title', 'Test Title');
  });

  it('should render Header with measure', () => {
    render(<TemplateSlide {...defaultProps} measure="Test Measure" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-measure', 'Test Measure');
  });

  it('should render Header with headline', () => {
    render(<TemplateSlide {...defaultProps} headline="Test Headline" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-headline', 'Test Headline');
  });

  it('should render Header with period', () => {
    render(<TemplateSlide {...defaultProps} period="Q1 2024" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-period', 'Q1 2024');
  });

  it('should render Header with countryId', () => {
    render(<TemplateSlide {...defaultProps} countryId="BR" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-country-id', 'BR');
  });

  it('should render Header with countryId2', () => {
    render(<TemplateSlide {...defaultProps} countryId2="US" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-country-id2', 'US');
  });

  it('should render Header with brandId', () => {
    render(<TemplateSlide {...defaultProps} brandId="brand-123" />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-brand-id', 'brand-123');
  });

  it('should render Header with divider true by default', () => {
    render(<TemplateSlide {...defaultProps} />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-divider', 'true');
  });

  it('should render Header with divider false when headerDivider is false', () => {
    render(<TemplateSlide {...defaultProps} headerDivider={false} />);

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-divider', 'false');
  });

  it('should render children inside StyledFlexContainer', () => {
    render(<TemplateSlide {...defaultProps} />);

    const flexContainer = screen.getByTestId('flex-container');
    expect(flexContainer).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('should render Footer with footnotes', () => {
    render(<TemplateSlide {...defaultProps} footnotes="Test footnotes" />);

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('data-footnotes', 'Test footnotes');
  });

  it('should render Footer with page', () => {
    render(
      <TemplateSlide {...defaultProps} footnotes="Test footnotes" page={5} />,
    );

    const footer = screen.getByTestId('footer');
    expect(footer).toHaveAttribute('data-page', '5');
  });

  it('should render all components in correct order', () => {
    render(
      <TemplateSlide
        {...defaultProps}
        measure="Measure"
        headline="Headline"
        period="Period"
        footnotes="Footnotes"
        page={1}
      />,
    );

    const templateContent = screen.getByTestId('template-content');
    const header = screen.getByTestId('header');
    const flexContainer = screen.getByTestId('flex-container');
    const footer = screen.getByTestId('footer');

    expect(templateContent).toContainElement(header);
    expect(templateContent).toContainElement(flexContainer);
    expect(templateContent).toContainElement(footer);
  });

  it('should render with data-testid when dataTestId prop is provided', () => {
    render(
      <TemplateSlide {...defaultProps} dataTestId="country-volume-report" />,
    );

    expect(
      screen.getByTestId('template-slide-country-volume-report'),
    ).toBeInTheDocument();
  });

  it('should render without data-testid when dataTestId prop is not provided', () => {
    render(<TemplateSlide {...defaultProps} />);

    expect(screen.getByTestId('template-container')).toBeInTheDocument();
    expect(screen.queryByTestId(/^template-slide-/)).not.toBeInTheDocument();
  });

  it('should apply correct data-testid format with prefix', () => {
    render(<TemplateSlide {...defaultProps} dataTestId="test-section" />);

    const container = screen.getByTestId('template-slide-test-section');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute(
      'data-testid',
      'template-slide-test-section',
    );
  });

  it('should not render PNG copy action by default', () => {
    render(<TemplateSlide {...defaultProps} />);
    expect(screen.queryByTestId('png-copy-actions')).not.toBeInTheDocument();
  });

  it('should render PNG copy action when enablePngCopy is true', () => {
    render(<TemplateSlide {...defaultProps} enablePngCopy />);
    expect(screen.getByTestId('png-copy-actions')).toBeInTheDocument();
  });
});
