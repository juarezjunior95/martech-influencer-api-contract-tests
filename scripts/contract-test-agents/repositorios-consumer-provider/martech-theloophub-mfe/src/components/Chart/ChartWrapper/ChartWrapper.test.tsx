import { cleanup, render, screen } from '@testing-library/react';

import { ChartWrapper } from './ChartWrapper';

describe('ChartWrapper Component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ChartWrapper />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders header content when provided', () => {
    const headerContent = <h1>Chart Header</h1>;
    render(<ChartWrapper header={headerContent} />);

    expect(screen.getByText('Chart Header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders children content when provided', () => {
    const childContent = <div data-testid="chart-content">Chart Content</div>;
    render(<ChartWrapper>{childContent}</ChartWrapper>);

    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
    expect(screen.getByText('Chart Content')).toBeInTheDocument();
  });

  it('renders both header and children together', () => {
    const headerContent = <h2>Header</h2>;
    const childContent = <p>Body Content</p>;

    render(<ChartWrapper header={headerContent}>{childContent}</ChartWrapper>);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('renders without header or children', () => {
    const { container } = render(<ChartWrapper />);

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders header inside a container div', () => {
    const headerContent = <div data-testid="test-header">Test Header</div>;
    const { container } = render(<ChartWrapper header={headerContent} />);

    const styledWrapper = container.firstChild as HTMLElement;
    const headerWrapper = styledWrapper.querySelector('div');

    expect(headerWrapper).toBeInTheDocument();
    expect(headerWrapper).toContainElement(screen.getByTestId('test-header'));
  });

  it('does not render header div when header prop is not provided', () => {
    const { container } = render(<ChartWrapper />);

    const styledWrapper = container.firstChild as HTMLElement;
    expect(styledWrapper.children.length).toBe(0);
  });

  it('renders the StyledChartWrapper with data-testid when dataTestId is provided', () => {
    render(<ChartWrapper dataTestId="styled-chart-wrapper" />);

    expect(screen.getByTestId('styled-chart-wrapper')).toBeInTheDocument();
  });

  it('calls onClick handler when wrapper is clicked and onClick is provided', () => {
    const onClickMock = jest.fn();
    render(
      <ChartWrapper onClick={onClickMock} dataTestId="styled-chart-wrapper" />,
    );

    const wrapper = screen.getByTestId('styled-chart-wrapper');
    wrapper.click();

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when clicked without onClick handler', () => {
    render(<ChartWrapper dataTestId="styled-chart-wrapper" />);

    const wrapper = screen.getByTestId('styled-chart-wrapper');

    expect(() => wrapper.click()).not.toThrow();
  });

  it('does not apply data-testid when dataTestId is not provided', () => {
    const { container } = render(<ChartWrapper />);

    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('sets clickable variant when onClick is provided', () => {
    const { container } = render(<ChartWrapper onClick={jest.fn()} />);

    const styledWrapper = container.firstChild as HTMLElement;
    expect(styledWrapper).toBeInTheDocument();
  });
});
