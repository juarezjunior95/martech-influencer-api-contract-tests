import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, size }: any) => (
    <p data-testid="paragraph" data-size={size}>
      {children}
    </p>
  ),
}));

jest.mock('./Footer.styles', () => ({
  StyledFooterItems: ({ children }: any) => (
    <div data-testid="footer-items">{children}</div>
  ),
  StyledFootnotesContent: ({ children }: any) => (
    <span data-testid="footnotes-content">{children}</span>
  ),
  StyledFootnotesText: ({ children }: any) => (
    <span data-testid="footnotes-text">{children}</span>
  ),
  StyledHorizontalDivider: () => <hr data-testid="horizontal-divider" />,
}));

import { Footer } from './Footer';

describe('Footer', () => {
  it('should render footer container with data-footer attribute', () => {
    render(<Footer />);

    const footer = document.querySelector('[data-footer]');
    expect(footer).toBeInTheDocument();
  });

  it('should render StyledHorizontalDivider', () => {
    render(<Footer />);

    expect(screen.getByTestId('horizontal-divider')).toBeInTheDocument();
  });

  it('should render StyledFooterItems', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-items')).toBeInTheDocument();
  });

  it('should render StyledFootnotesText with "Footnotes:" label', () => {
    render(<Footer />);

    expect(screen.getByTestId('footnotes-text')).toHaveTextContent(
      'Footnotes:',
    );
  });

  it('should render footnotes content when provided', () => {
    render(<Footer footnotes="Test footnote content" />);

    expect(screen.getByTestId('footnotes-content')).toHaveTextContent(
      'Test footnote content',
    );
  });

  it('should render empty footnotes content when not provided', () => {
    render(<Footer />);

    expect(screen.getByTestId('footnotes-content')).toBeInTheDocument();
    expect(screen.getByTestId('footnotes-content')).toHaveTextContent('');
  });

  it('should render page number when provided', () => {
    render(<Footer page={5} />);

    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('5');
    expect(paragraph).toHaveAttribute('data-size', 'small');
  });

  it('should not render page number when not provided', () => {
    render(<Footer />);

    expect(screen.queryByTestId('paragraph')).not.toBeInTheDocument();
  });

  it('should not render page number when page is 0', () => {
    render(<Footer page={0} />);

    expect(screen.queryByTestId('paragraph')).not.toBeInTheDocument();
  });

  it('should render page number when page is positive', () => {
    render(<Footer page={1} />);

    expect(screen.getByTestId('paragraph')).toHaveTextContent('1');
  });

  it('should have correct container styles', () => {
    render(<Footer />);

    const footer = document.querySelector('[data-footer]');
    expect(footer).toHaveStyle({ paddingTop: '16px', marginTop: 'auto' });
  });

  it('should render both footnotes and page when both provided', () => {
    render(<Footer footnotes="Some footnotes" page={10} />);

    expect(screen.getByTestId('footnotes-content')).toHaveTextContent(
      'Some footnotes',
    );
    expect(screen.getByTestId('paragraph')).toHaveTextContent('10');
  });
});
