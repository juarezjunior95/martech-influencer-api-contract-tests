import { fireEvent, render, screen } from '@testing-library/react';

import { CustomValueContainer } from './CustomValueContainer';

jest.mock('react-select', () => ({
  components: {
    ValueContainer: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid'] || 'value-container'}>
        {children}
      </div>
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

jest.mock('../../Select.styles', () => ({
  MultiValueRemove: ({
    children,
    onClick,
    onMouseDown,
    style,
    ...props
  }: any) => (
    <button
      data-testid={props['data-testid'] || 'multi-value-remove'}
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={style}
    >
      {children}
    </button>
  ),
  StyledChips: ({ children, className, style, ...props }: any) => (
    <div
      data-testid={props['data-testid'] || 'styled-chips'}
      className={className}
      style={style}
    >
      {children}
    </div>
  ),
  StyledChipsPlaceholder: ({ children }: any) => (
    <div data-testid="styled-chips-placeholder">{children}</div>
  ),
}));

jest.mock('./CustomValueContainer.styles', () => ({
  StyledMoreCount: ({ children, ...props }: any) => (
    <span data-testid={props['data-testid'] || 'styled-more-count'}>
      {children}
    </span>
  ),
}));

describe('CustomValueContainer', () => {
  const createMockProps = (overrides = {}) => ({
    children: <span data-testid="children">Children</span>,
    isMulti: false,
    getClassNames: jest.fn(),
    selectProps: {},
    hasValue: false,
    isDisabled: false,
    clearValue: jest.fn(),
    cx: jest.fn(),
    getStyles: jest.fn(),
    getValue: jest.fn(() => []),
    isRtl: false,
    options: [],
    selectOption: jest.fn(),
    setValue: jest.fn(),
    theme: {} as any,
    ...overrides,
  });

  const defaultCustomProps = {
    id: 'test-select',
    chips: false,
    someValueSelected: false,
    showValueSelected: true,
  };

  it('should render ValueContainer component', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({ ...defaultCustomProps }) as any)}
      />,
    );

    expect(screen.getByTestId('value-container')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({ ...defaultCustomProps }) as any)}
      />,
    );

    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const IconComponent = () => <span data-testid="custom-icon">Icon</span>;

    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          icon: IconComponent,
        }) as any)}
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render valueLabel when provided', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          valueLabel: 'Selected:',
        }) as any)}
      />,
    );

    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });

  it('should render StyledChips when chips is true and someValueSelected', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: true,
        }) as any)}
      />,
    );

    expect(screen.getByTestId('styled-chips')).toBeInTheDocument();
  });

  it('should not render StyledChips when chips is false', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: false,
          someValueSelected: true,
        }) as any)}
      />,
    );

    expect(screen.queryByTestId('styled-chips')).not.toBeInTheDocument();
  });

  it('should not render StyledChips when someValueSelected is false', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: false,
        }) as any)}
      />,
    );

    expect(screen.queryByTestId('styled-chips')).not.toBeInTheDocument();
  });

  it('should render MultiValueRemove when onClearSingle is provided with chips', () => {
    const onClearSingle = jest.fn();

    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: true,
          onClearSingle,
        }) as any)}
      />,
    );

    expect(screen.getByTestId('multi-value-remove')).toBeInTheDocument();
  });

  it('should call onClearSingle when remove button is clicked', () => {
    const onClearSingle = jest.fn();

    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: true,
          onClearSingle,
        }) as any)}
      />,
    );

    const removeButton = screen.getByTestId('multi-value-remove');
    fireEvent.click(removeButton);

    expect(onClearSingle).toHaveBeenCalled();
  });

  it('should prevent default on remove button mouse down', () => {
    const onClearSingle = jest.fn();

    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: true,
          onClearSingle,
        }) as any)}
      />,
    );

    const removeButton = screen.getByTestId('multi-value-remove');
    const preventDefault = jest.spyOn(Event.prototype, 'preventDefault');
    fireEvent.mouseDown(removeButton);

    expect(preventDefault).toHaveBeenCalled();
    preventDefault.mockRestore();
  });

  it('should stop propagation on click', () => {
    const onClearSingle = jest.fn();

    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          chips: true,
          someValueSelected: true,
          onClearSingle,
        }) as any)}
      />,
    );

    const removeButton = screen.getByTestId('multi-value-remove');
    const stopPropagation = jest.spyOn(Event.prototype, 'stopPropagation');
    fireEvent.click(removeButton);

    expect(stopPropagation).toHaveBeenCalled();
    stopPropagation.mockRestore();
  });

  it('should have correct className for StyledChips', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          id: 'my-select',
          chips: true,
          someValueSelected: true,
        }) as any)}
      />,
    );

    const chips = screen.getByTestId('styled-chips');
    expect(chips).toHaveClass('my-select-select__chips');
  });

  it('should set opacity 0 when showValueSelected is false', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          showValueSelected: false,
        }) as any)}
      />,
    );

    const valueContainer = screen
      .getByTestId('value-container')
      .querySelector('.test-select-select__value-container');
    expect(valueContainer).toHaveStyle({ opacity: 0 });
  });

  it('should set opacity 1 when showValueSelected is true', () => {
    render(
      <CustomValueContainer
        {...(createMockProps({
          ...defaultCustomProps,
          showValueSelected: true,
        }) as any)}
      />,
    );

    const valueContainer = screen
      .getByTestId('value-container')
      .querySelector('.test-select-select__value-container');
    expect(valueContainer).toHaveStyle({ opacity: 1 });
  });

  describe('data-testid', () => {
    it('should apply dynamic data-testid to container', () => {
      render(
        <CustomValueContainer
          {...(createMockProps({
            ...defaultCustomProps,
            selectProps: { dataTestId: 'my-select' },
          }) as any)}
        />,
      );

      expect(
        screen.getByTestId('my-select-value-container'),
      ).toBeInTheDocument();
    });

    it('should apply dynamic data-testid to StyledChips', () => {
      render(
        <CustomValueContainer
          {...(createMockProps({
            ...defaultCustomProps,
            chips: true,
            someValueSelected: true,
            selectProps: { dataTestId: 'my-select' },
          }) as any)}
        />,
      );

      expect(screen.getByTestId('my-select-chips')).toBeInTheDocument();
    });

    it('should apply dynamic data-testid to clear single button', () => {
      const onClearSingle = jest.fn();
      render(
        <CustomValueContainer
          {...(createMockProps({
            ...defaultCustomProps,
            chips: true,
            someValueSelected: true,
            onClearSingle,
            selectProps: { dataTestId: 'my-select' },
          }) as any)}
        />,
      );

      expect(screen.getByTestId('my-select-clear-single')).toBeInTheDocument();
    });

    it('should apply dynamic data-testid to value container div (not chips)', () => {
      render(
        <CustomValueContainer
          {...(createMockProps({
            ...defaultCustomProps,
            chips: false,
            selectProps: { dataTestId: 'my-select' },
          }) as any)}
        />,
      );

      expect(screen.getByTestId('my-select-values')).toBeInTheDocument();
    });
  });
});
