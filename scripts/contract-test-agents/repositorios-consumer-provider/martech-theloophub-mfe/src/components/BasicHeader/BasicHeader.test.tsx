import { render, screen } from '@testing-library/react';

import { BasicHeader } from './BasicHeader';

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, dataTestId }: any) => (
    <div data-testid={dataTestId}>{children}</div>
  ),
}));

describe('BasicHeader', () => {
  it('should render the BasicHeader component', () => {
    render(<BasicHeader title="Teste" dataTestId="header-overview" />);

    const content = screen.getByTestId('header-overview');
    expect(content).toBeInTheDocument();
  });

  it('should render without data-testid when dataTestId is not provided', () => {
    const { container } = render(<BasicHeader title="Teste" />);

    expect(container.querySelector('[data-testid]')).not.toBeInTheDocument();
  });

  it('should render data-testid on title element', () => {
    render(<BasicHeader title="Teste" dataTestId="header-overview" />);

    expect(screen.getByTestId('header-overview-title')).toBeInTheDocument();
  });

  it('should render data-testid on subtitle element when subtitle is provided', () => {
    render(
      <BasicHeader
        title="Teste"
        subtitle="Subtítulo"
        dataTestId="header-overview"
      />,
    );

    expect(screen.getByTestId('header-overview-subtitle')).toBeInTheDocument();
  });

  it('should render data-testid on tooltip when tooltip is provided', () => {
    render(
      <BasicHeader
        title="Teste"
        tooltip="Tooltip content"
        dataTestId="header-overview"
      />,
    );

    expect(screen.getByTestId('header-overview-tooltip')).toBeInTheDocument();
  });
});
