import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CustomAgGridTooltip } from './CustomAgGridTooltip';

jest.mock('components/HeaderContent', () => ({
  HeaderContent: ({ items }: any) => (
    <div data-testid="header-content">
      {items[0]?.content?.map((item: any) => (
        <div key={`tooltip-${item?.key}`}>{item}</div>
      ))}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

jest.mock('./CustomAgGridTooltip.styles', () => ({
  StyledCustomAgGridTooltip: ({ children, darkMode, style }: any) => (
    <div data-testid="styled-tooltip" data-dark-mode={darkMode} style={style}>
      {children}
    </div>
  ),
}));

describe('CustomAgGridTooltip', () => {
  const mockProps: any = {
    value: 'Test tooltip',
    api: {},
    column: {
      getDefinition: () => ({}),
    },
    location: 'cell',
  };

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 100,
      y: 200,
      width: 150,
      height: 50,
      top: 200,
      right: 250,
      bottom: 250,
      left: 100,
      toJSON: jest.fn(),
    }));
  });

  it('should render the component', () => {
    const { getByTestId } = render(<CustomAgGridTooltip {...mockProps} />);

    expect(getByTestId('styled-tooltip')).toBeInTheDocument();
    expect(getByTestId('header-content')).toBeInTheDocument();
  });

  it('should render tooltip value', () => {
    const { container } = render(<CustomAgGridTooltip {...mockProps} />);

    expect(container.textContent).toContain('Test tooltip');
  });

  it('should process string value with dots', () => {
    const propsWithDots = {
      ...mockProps,
      value: 'First sentence. Second sentence. Third sentence.',
    };

    const { container } = render(<CustomAgGridTooltip {...propsWithDots} />);

    expect(container.textContent).toContain('First sentence.');
    expect(container.textContent).toContain('Second sentence.');
  });

  it('should handle non-string value', () => {
    const propsWithNumber = {
      ...mockProps,
      value: 123,
    };

    const { container } = render(<CustomAgGridTooltip {...propsWithNumber} />);

    expect(container.textContent).toContain('123');
  });

  it('should apply dark mode style when tooltipCellStyle is dark', () => {
    const propsWithDarkStyle = {
      ...mockProps,
      column: {
        getDefinition: () => ({
          headerComponentParams: {
            tooltipCellStyle: 'dark',
          },
        }),
      },
    };

    const { getByTestId } = render(
      <CustomAgGridTooltip {...propsWithDarkStyle} />,
    );

    expect(getByTestId('styled-tooltip')).toHaveAttribute(
      'data-dark-mode',
      'true',
    );
  });

  it('should use tooltipHeaderStyle when location is header', () => {
    const propsWithHeaderLocation = {
      ...mockProps,
      location: 'header',
      column: {
        getDefinition: () => ({
          headerComponentParams: {
            tooltipHeaderStyle: 'dark',
          },
        }),
      },
    };

    const { getByTestId } = render(
      <CustomAgGridTooltip {...propsWithHeaderLocation} />,
    );

    expect(getByTestId('styled-tooltip')).toBeInTheDocument();
  });

  it('should handle empty value', () => {
    const propsWithEmptyValue = {
      ...mockProps,
      value: '',
    };

    const { getByTestId } = render(
      <CustomAgGridTooltip {...propsWithEmptyValue} />,
    );

    expect(getByTestId('styled-tooltip')).toBeInTheDocument();
  });

  it('should apply whiteSpace pre-line style', () => {
    const { getByTestId } = render(<CustomAgGridTooltip {...mockProps} />);

    const tooltip = getByTestId('styled-tooltip');
    expect(tooltip).toHaveStyle({ whiteSpace: 'pre-line' });
  });

  it('should handle props without column', () => {
    const propsWithoutColumn = {
      ...mockProps,
      column: undefined,
    };

    const { getByTestId } = render(
      <CustomAgGridTooltip {...propsWithoutColumn} />,
    );

    expect(getByTestId('styled-tooltip')).toBeInTheDocument();
  });
});
