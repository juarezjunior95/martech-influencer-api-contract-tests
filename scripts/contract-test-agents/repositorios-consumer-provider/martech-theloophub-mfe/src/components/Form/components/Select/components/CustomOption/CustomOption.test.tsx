import { render, screen } from '@testing-library/react';

import { CustomOption } from './CustomOption';

jest.mock('react-select', () => ({
  components: {
    Option: ({ children, isDisabled, ...props }: any) => (
      <div
        data-testid={props['data-testid'] || 'option'}
        data-disabled={isDisabled}
      >
        {children}
      </div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent, style }: any) => (
    <span data-testid="icon" style={style}>
      <IconComponent />
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Check: () => <span data-testid="check-icon">Check</span>,
}));

jest.mock('../../utils', () => ({
  getSizeStyles: jest.fn(() => ({
    getCheckSize: () => '20px',
  })),
}));

jest.mock('./CustomOption.styles', () => ({
  StyledCheckInput: ({ children, checked, style }: any) => (
    <div data-testid="check-input" data-checked={checked} style={style}>
      {children}
    </div>
  ),
  StyledCustomOption: ({ children, isDisabled }: any) => (
    <div data-testid="styled-custom-option" data-disabled={isDisabled}>
      {children}
    </div>
  ),
  StyledCustomReactSelectOption: ({ children, isDisabled, ...props }: any) => (
    <div
      data-testid={props['data-testid'] || 'option'}
      data-disabled={isDisabled}
    >
      {children}
    </div>
  ),
}));

describe('CustomOption', () => {
  const createMockProps = (overrides = {}) => {
    return {
      data: { label: 'Option 1', value: 'opt1' },
      isSelected: false,
      isDisabled: false,
      isFocused: false,
      innerRef: jest.fn(),
      innerProps: {},
      selectProps: {},
      multiple: false,
      size: 'medium' as const,
      allSelected: false,
      clearValue: jest.fn(),
      cx: jest.fn(),
      getClassNames: jest.fn(),
      getStyles: jest.fn(),
      getValue: jest.fn(),
      hasValue: false,
      isMulti: false,
      isRtl: false,
      options: [],
      selectOption: jest.fn(),
      setValue: jest.fn(),
      theme: {} as any,
      type: 'option' as const,
      ...overrides,
    };
  };

  it('should render Option component', () => {
    render(<CustomOption {...(createMockProps() as any)} />);

    expect(screen.getByTestId('option')).toBeInTheDocument();
  });

  it('should render StyledCustomOption', () => {
    render(<CustomOption {...(createMockProps() as any)} />);

    expect(screen.getByTestId('styled-custom-option')).toBeInTheDocument();
  });

  it('should render option label', () => {
    render(<CustomOption {...(createMockProps() as any)} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should render Check icon when single select and selected', () => {
    render(
      <CustomOption {...(createMockProps({ isSelected: true }) as any)} />,
    );

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should not render Check icon when single select and not selected', () => {
    render(
      <CustomOption {...(createMockProps({ isSelected: false }) as any)} />,
    );

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('should render checkbox when multiple is true', () => {
    render(<CustomOption {...(createMockProps({ multiple: true }) as any)} />);

    expect(screen.getByTestId('check-input')).toBeInTheDocument();
  });

  it('should mark checkbox as checked when selected in multiple mode', () => {
    render(
      <CustomOption
        {...(createMockProps({ isSelected: true, multiple: true }) as any)}
      />,
    );

    const checkInput = screen.getByTestId('check-input');
    expect(checkInput).toHaveAttribute('data-checked', 'selected');
  });

  it('should mark checkbox as checked when allSelected is true', () => {
    render(
      <CustomOption
        {...(createMockProps({
          isSelected: false,
          multiple: true,
          allSelected: true,
        }) as any)}
      />,
    );

    const checkInput = screen.getByTestId('check-input');
    expect(checkInput).toHaveAttribute('data-checked', 'selected');
  });

  it('should render option icon when provided', () => {
    const IconComponent = () => <span data-testid="option-icon">Icon</span>;
    const propsWithIcon = createMockProps({
      data: { label: 'Option 1', value: 'opt1', icon: IconComponent },
    });

    render(<CustomOption {...(propsWithIcon as any)} />);

    expect(screen.getByTestId('option-icon')).toBeInTheDocument();
  });

  it('should pass disabled state to StyledCustomOption', () => {
    render(
      <CustomOption {...(createMockProps({ isDisabled: true }) as any)} />,
    );

    const styledOption = screen.getByTestId('styled-custom-option');
    expect(styledOption).toHaveAttribute('data-disabled', 'true');
  });

  it('should render Check icon with correct color style in single mode', () => {
    render(
      <CustomOption {...(createMockProps({ isSelected: true }) as any)} />,
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ color: '#0a0a0a' });
  });

  it('should render checkbox with Check icon when checked in multiple mode', () => {
    render(
      <CustomOption
        {...(createMockProps({ isSelected: true, multiple: true }) as any)}
      />,
    );

    expect(screen.getByTestId('check-input')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should not render Check icon inside checkbox when not selected in multiple mode', () => {
    render(
      <CustomOption
        {...(createMockProps({
          isSelected: false,
          multiple: true,
          allSelected: false,
        }) as any)}
      />,
    );

    expect(screen.getByTestId('check-input')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid based on option value', () => {
      const props = createMockProps({
        selectProps: { dataTestId: 'my-select' },
        data: { label: 'Banana', value: 'banana' },
      });

      render(<CustomOption {...(props as any)} />);

      expect(screen.getByTestId('my-select-option-banana')).toBeInTheDocument();
    });

    it('should not render dynamic data-testid if not provided', () => {
      const props = createMockProps({
        data: { label: 'Banana', value: 'banana' },
      });

      render(<CustomOption {...(props as any)} />);

      const element = screen.getByTestId('option');
      expect(element.getAttribute('data-testid')).toBe('option');
    });
  });
});
