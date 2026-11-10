import { render, screen } from '@testing-library/react';

jest.mock('react-select', () => ({
  components: {
    DropdownIndicator: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid'] || 'dropdown-indicator'}>
        {children}
      </div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent, style, ...props }: any) => (
    <span data-testid={props['data-testid'] || 'icon'} style={style}>
      <IconComponent />
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  ChevronDown: () => <span data-testid="chevron-down">ChevronDown</span>,
  ChevronUp: () => <span data-testid="chevron-up">ChevronUp</span>,
}));

import { CustomDropdownIndicator } from './CustomDropdownIndicator';

describe('CustomDropdownIndicator', () => {
  const createMockProps = (menuIsOpen: boolean, extraProps = {}) => ({
    innerProps: {},
    selectProps: { menuIsOpen, ...extraProps },
    getStyles: jest.fn(),
    getValue: jest.fn(),
    hasValue: false,
    isMulti: false,
    isRtl: false,
    options: [],
    clearValue: jest.fn(),
    cx: jest.fn(),
    getClassNames: jest.fn(),
    selectOption: jest.fn(),
    setValue: jest.fn(),
    theme: {} as any,
    isDisabled: false,
    isFocused: false,
  });

  it('should render DropdownIndicator component', () => {
    render(<CustomDropdownIndicator {...(createMockProps(false) as any)} />);
    expect(screen.getByTestId('dropdown-indicator')).toBeInTheDocument();
  });

  it('should render both ChevronDown and ChevronUp icons', () => {
    render(<CustomDropdownIndicator {...(createMockProps(false) as any)} />);
    // Verifica conteúdo interno (mock dos ícones)
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
  });

  it('should show ChevronDown when menu is closed', () => {
    render(<CustomDropdownIndicator {...(createMockProps(false) as any)} />);
    const icons = screen.getAllByTestId('icon');
    expect(icons[0]).toHaveStyle({ display: 'flex' });
    expect(icons[1]).toHaveStyle({ display: 'none' });
  });

  it('should show ChevronUp when menu is open', () => {
    render(<CustomDropdownIndicator {...(createMockProps(true) as any)} />);
    const icons = screen.getAllByTestId('icon');
    expect(icons[0]).toHaveStyle({ display: 'none' });
    expect(icons[1]).toHaveStyle({ display: 'flex' });
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid on wrapper and icons when provided', () => {
      const mockProps = createMockProps(false, { dataTestId: 'my-select' });

      render(<CustomDropdownIndicator {...(mockProps as any)} />);

      expect(
        screen.getByTestId('my-select-dropdown-indicator'),
      ).toBeInTheDocument();

      expect(screen.getByTestId('my-select-caret-down')).toBeInTheDocument();
      expect(screen.getByTestId('my-select-caret-up')).toBeInTheDocument();
    });

    it('should NOT render dynamic data-testid if not provided', () => {
      render(<CustomDropdownIndicator {...(createMockProps(false) as any)} />);

      const wrapper = screen.getByTestId('dropdown-indicator');
      expect(wrapper.getAttribute('data-testid')).toBe('dropdown-indicator');

      const icons = screen.getAllByTestId('icon');
      expect(icons[0].getAttribute('data-testid')).toBe('icon');
    });
  });
});
