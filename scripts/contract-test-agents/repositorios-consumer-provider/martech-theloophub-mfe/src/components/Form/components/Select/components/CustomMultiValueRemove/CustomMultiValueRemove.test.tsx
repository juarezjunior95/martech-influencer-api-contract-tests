import { MultiValueRemoveProps } from 'react-select';

import { render, screen } from '@testing-library/react';

import { CustomMultiValueRemove } from './CustomMultiValueRemove';

jest.mock('react-select', () => ({
  components: {
    MultiValueRemove: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid'] || 'multi-value-remove'}>
        {children}
      </div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent, size }: any) => (
    <span data-testid="icon" data-size={size}>
      <IconComponent />
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Close: () => <span data-testid="close-icon">Close</span>,
}));

jest.mock('../../Select.styles', () => ({
  MultiValueRemove: ({ children }: any) => (
    <div data-testid="styled-multi-value-remove">{children}</div>
  ),
}));

describe('CustomMultiValueRemove', () => {
  const createProps = (extraSelectProps = {}) => {
    return {
      data: { label: 'Option 1', value: 'opt1' },
      innerProps: {},
      selectProps: { ...extraSelectProps },
      clearValue: jest.fn(),
      cx: jest.fn(),
      getValue: jest.fn(),
      hasValue: true,
      isMulti: true,
      isRtl: false,
      options: [],
      selectOption: jest.fn(),
      setValue: jest.fn(),
      theme: {} as any,
    } as unknown as MultiValueRemoveProps;
  };

  it('should render MultiValueRemove component', () => {
    render(<CustomMultiValueRemove {...createProps()} />);

    expect(screen.getByTestId('multi-value-remove')).toBeInTheDocument();
  });

  it('should render styled MultiValueRemove', () => {
    render(<CustomMultiValueRemove {...createProps()} />);

    expect(screen.getByTestId('styled-multi-value-remove')).toBeInTheDocument();
  });

  it('should render Close icon', () => {
    render(<CustomMultiValueRemove {...createProps()} />);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should render Icon with small size', () => {
    render(<CustomMultiValueRemove {...createProps()} />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-size', 'small');
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid based on option value', () => {
      const props = createProps({ dataTestId: 'my-select' });
      render(<CustomMultiValueRemove {...props} />);

      expect(screen.getByTestId('my-select-remove-opt1')).toBeInTheDocument();
    });

    it('should not render dynamic data-testid if not provided', () => {
      render(<CustomMultiValueRemove {...createProps()} />);

      const element = screen.getByTestId('multi-value-remove');
      expect(element.getAttribute('data-testid')).toBe('multi-value-remove');
    });
  });
});
