import React from 'react';

import { render, screen } from '@testing-library/react';

import { CustomMultiValueContainer } from './CustomMultiValueContainer';

jest.mock('react-select', () => ({
  components: {
    MultiValueContainer: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid'] || 'multi-value-container'}>
        {children}
      </div>
    ),
  },
}));

jest.mock('../../Select.styles', () => ({
  StyledChipsPlaceholder: ({ children }: any) => (
    <span data-testid="styled-chips-placeholder">{children}</span>
  ),
}));

describe('CustomMultiValueContainer', () => {
  const createProps = (
    extraSelectProps = {},
    data = { label: 'Apple', value: 'apple' },
    getChipPlaceholder?: any,
  ) => {
    return {
      children: <span>Chip Content</span>,
      data,
      getChipPlaceholder,
      selectProps: {
        ...extraSelectProps,
      },
      innerProps: {},
      cx: jest.fn(),
      clearValue: jest.fn(),
      getValue: jest.fn(),
      hasValue: true,
      isMulti: true,
      isRtl: false,
      options: [],
      selectOption: jest.fn(),
      setValue: jest.fn(),
      theme: {} as any,
    } as any;
  };

  it('should render children correctly', () => {
    render(<CustomMultiValueContainer {...createProps()} />);

    expect(screen.getByText('Chip Content')).toBeInTheDocument();
  });

  it('should render placeholder when getChipPlaceholder is provided', () => {
    const mockGetPlaceholder = jest.fn(() => 'Custom Placeholder');
    render(
      <CustomMultiValueContainer
        {...createProps({}, undefined, mockGetPlaceholder)}
      />,
    );

    expect(screen.getByText('Custom Placeholder')).toBeInTheDocument();
    expect(screen.getByTestId('styled-chips-placeholder')).toBeInTheDocument();
  });

  it('should NOT render placeholder when getChipPlaceholder is missing', () => {
    render(<CustomMultiValueContainer {...createProps()} />);

    expect(
      screen.queryByTestId('styled-chips-placeholder'),
    ).not.toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid based on option value', () => {
      const props = createProps(
        { dataTestId: 'my-select' },
        { label: 'Apple', value: 'apple' },
      );

      render(<CustomMultiValueContainer {...props} />);

      expect(
        screen.getByTestId('my-select-multi-value-apple'),
      ).toBeInTheDocument();
    });

    it('should render dynamic data-testid for a different value', () => {
      const props = createProps(
        { dataTestId: 'user-filter' },
        { label: 'Admin', value: 'admin' },
      );

      render(<CustomMultiValueContainer {...props} />);

      expect(
        screen.getByTestId('user-filter-multi-value-admin'),
      ).toBeInTheDocument();
    });

    it('should NOT render dynamic data-testid if prop is not provided (Clean Code)', () => {
      render(<CustomMultiValueContainer {...createProps()} />);

      const container = screen.getByTestId('multi-value-container');
      expect(container.getAttribute('data-testid')).toBe(
        'multi-value-container',
      );
    });
  });
});
