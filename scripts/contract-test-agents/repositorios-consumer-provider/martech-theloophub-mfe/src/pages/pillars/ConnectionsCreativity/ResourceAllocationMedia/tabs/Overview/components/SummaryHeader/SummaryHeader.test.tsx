import { render, screen } from '@testing-library/react';

import { SummaryHeader } from './SummaryHeader';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, ...props }: any) => (
    <p data-testid={props['data-testid']} style={props.style}>
      {children}
    </p>
  ),
}));

jest.mock('./SummaryHeader.styles', () => ({
  SummaryHeaderContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
}));

describe('SummaryHeader', () => {
  const mockFormatMessage = jest.fn(
    ({ id }: { id: string }) => `translated-${id}`,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls formatMessage with the correct id', () => {
    render(<SummaryHeader formatMessage={mockFormatMessage} />);

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.title',
    });
  });

  it('renders with custom dataTestId', () => {
    render(
      <SummaryHeader
        formatMessage={mockFormatMessage}
        dataTestId="test-summary-header"
      />,
    );

    const container = screen.getByTestId('test-summary-header');
    const title = screen.getByTestId('test-summary-header-title');

    expect(container).toContainElement(title);
  });

  it('renders without custom dataTestId', () => {
    const { container } = render(
      <SummaryHeader formatMessage={mockFormatMessage} />,
    );

    const divs = container.querySelectorAll('div');
    const paragraphs = container.querySelectorAll('p');

    divs.forEach((div) => {
      expect(div.getAttribute('data-testid')).toBeNull();
    });
    paragraphs.forEach((p) => {
      expect(p.getAttribute('data-testid')).toBeNull();
    });
  });
});
