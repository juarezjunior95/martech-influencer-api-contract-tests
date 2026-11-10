import { fireEvent, render, screen } from '@testing-library/react';
import { GroupCellRendererParams } from 'ag-grid-community';

import { BrandCellRenderer } from './BrandCellRenderer';

jest.mock('components', () => ({
  CustomTooltip: ({ children, backgroundStyle }: any) => (
    <div data-testid="custom-tooltip" data-background-style={backgroundStyle}>
      {children}
    </div>
  ),
}));

jest.mock(
  'shared/Styles/shared.styles',
  () => ({
    StyledBlackTooltipContainer: ({ children, className }: any) => (
      <span data-testid="tooltip-container" className={className}>
        {children}
      </span>
    ),
  }),
  { virtual: true },
);

jest.mock('./BrandCellRenderer.styles', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');
  return {
    StyledContainer: mockReact.forwardRef(
      ({ children, className, onMouseEnter, onMouseLeave }: any, ref: any) => (
        <button
          data-testid="styled-container"
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={ref}
          type="button"
        >
          {children}
        </button>
      ),
    ),
    StyledImgContainer: ({ children, hasPortolioColor }: any) => (
      <div
        data-testid="styled-img-container"
        data-has-portfolio-color={String(hasPortolioColor)}
      >
        {children}
      </div>
    ),
    StyledBorderLeft: ({ portfolioColor, ...props }: any) => (
      <div
        data-testid="styled-border-left"
        data-portfolio-color={portfolioColor}
        {...props}
      />
    ),
    StyledImgContent: ({ children, hasPortolioColor }: any) => (
      <div
        data-testid="styled-img-content"
        data-has-portfolio-color={String(hasPortolioColor)}
      >
        {children}
      </div>
    ),
    StyledImg: ({ src, alt, onError }: any) => (
      <img data-testid="styled-img" src={src} alt={alt} onError={onError} />
    ),
    StyledFallback: ({ children }: any) => (
      <div data-testid="styled-fallback">{children}</div>
    ),
  };
});

describe('BrandCellRenderer', () => {
  const createMockParams = (config: {
    src?: string;
    value?: string;
    portfolio?: string;
  }): GroupCellRendererParams =>
    ({
      colDef: { field: 'brand' },
      data: {
        brand_config: {
          src: config.src,
          value: config.value ?? 'Brand Name',
          portfolio: config.portfolio,
        },
      },
    }) as unknown as GroupCellRendererParams;

  it('renders container with correct class', () => {
    render(
      <BrandCellRenderer {...createMockParams({ value: 'Test Brand' })} />,
    );
    expect(screen.getByTestId('styled-container')).toHaveClass(
      'ag-cell-content',
    );
  });

  it('renders image container with border and tooltip when src is provided', () => {
    render(
      <BrandCellRenderer
        {...createMockParams({
          value: 'Test Brand',
          src: 'https://assets.example.com/brand-table.png',
        })}
      />,
    );
    expect(screen.getByTestId('styled-img-container')).toBeInTheDocument();
    expect(screen.getByTestId('styled-border-left')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('custom-tooltip')).toHaveAttribute(
      'data-background-style',
      'transparent',
    );
    expect(screen.getByTestId('styled-img')).toHaveAttribute(
      'src',
      'https://assets.example.com/brand-table.png',
    );
  });

  it('renders text fallback when no image src is provided', () => {
    render(
      <BrandCellRenderer {...createMockParams({ value: 'Test Brand' })} />,
    );
    expect(screen.getByTestId('styled-fallback')).toHaveTextContent(
      'Test Brand',
    );
    expect(screen.queryByTestId('styled-img')).not.toBeInTheDocument();
  });

  it('handles mouse enter and leave events', () => {
    render(
      <BrandCellRenderer {...createMockParams({ value: 'Test Brand' })} />,
    );
    const container = screen.getByTestId('styled-container');
    expect(() => fireEvent.mouseEnter(container)).not.toThrow();
    expect(() => fireEvent.mouseLeave(container)).not.toThrow();
  });
});
