import { render, screen } from '@testing-library/react';

jest.mock('react-select', () => ({
  components: {
    ClearIndicator: ({ children }: any) => (
      <div data-testid="clear-indicator">{children}</div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent }: any) => (
    <span data-testid="icon">
      <IconComponent />
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Close: () => <span data-testid="close-icon">Close</span>,
}));

jest.mock('./CustomClearIndicator.styles', () => ({
  StyledClearIndicator: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] || 'styled-clear-indicator'}>
      {children}
    </div>
  ),
}));

import { CustomClearIndicator } from './CustomClearIndicator';

describe('CustomClearIndicator', () => {
  const mockProps = {
    innerProps: {},
    selectProps: {},
    getStyles: jest.fn(),
    getValue: jest.fn(),
    hasValue: true,
    isMulti: false,
    isRtl: false,
    options: [],
    clearValue: jest.fn(),
    cx: jest.fn(),
    getClassNames: jest.fn(),
    selectOption: jest.fn(),
    setValue: jest.fn(),
    theme: {} as any,
  };

  it('should render ClearIndicator component', () => {
    render(<CustomClearIndicator {...(mockProps as any)} />);
    expect(screen.getByTestId('clear-indicator')).toBeInTheDocument();
  });

  it('should render StyledClearIndicator default ID when no prop passed', () => {
    render(<CustomClearIndicator {...(mockProps as any)} />);
    expect(screen.getByTestId('styled-clear-indicator')).toBeInTheDocument();
  });

  it('should render Close icon', () => {
    render(<CustomClearIndicator {...(mockProps as any)} />);
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should render Icon component', () => {
    render(<CustomClearIndicator {...(mockProps as any)} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid when provided in selectProps', () => {
      const propsWithId = {
        ...mockProps,
        selectProps: { dataTestId: 'test-select' },
      };

      render(<CustomClearIndicator {...(propsWithId as any)} />);

      expect(
        screen.getByTestId('test-select-clear-indicator'),
      ).toBeInTheDocument();
    });

    it('should NOT render dynamic data-testid if not provided', () => {
      render(<CustomClearIndicator {...(mockProps as any)} />);
      const element = screen.getByTestId('styled-clear-indicator');
      expect(element.getAttribute('data-testid')).toBe(
        'styled-clear-indicator',
      );
    });
  });
});
