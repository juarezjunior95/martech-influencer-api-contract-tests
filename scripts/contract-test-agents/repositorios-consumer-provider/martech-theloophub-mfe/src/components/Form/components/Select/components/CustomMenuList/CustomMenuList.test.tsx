import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { CustomMenuList } from './CustomMenuList';

// --- MOCKS CORRIGIDOS ---
jest.mock('react-select', () => ({
  components: {
    // Agora repassa {...props} para a div, permitindo refs e eventos se necessário
    MenuList: ({ children, ...props }: any) => (
      <div {...props} data-testid={props['data-testid'] || 'menu-list'}>
        {children}
      </div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: () => <span data-testid="search-icon">Icon</span>,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Search: 'SearchIcon',
}));

jest.mock('./CustomMenuList.styles', () => ({
  // CORREÇÃO CRÍTICA AQUI: {...props} adicionado na div!
  // Isso garante que onClick, onMouseEnter, etc. funcionem no teste.
  StyledSearchOption: ({ children, ...props }: any) => (
    <div
      {...props}
      data-testid={props['data-testid'] || 'styled-search-option'}
    >
      {children}
    </div>
  ),
}));

describe('CustomMenuList', () => {
  const mockOnInputChange = jest.fn();

  const createProps = (searchable = false, extraSelectProps = {}) => {
    return {
      children: <div>Options List</div>,
      searchable,
      isMouseOverSearchRef: { current: false },
      menuListScrollRef: { current: 0 },
      selectProps: {
        onInputChange: mockOnInputChange,
        inputValue: '',
        ...extraSelectProps,
      },
      cx: jest.fn(),
      getValue: jest.fn(),
      getStyles: jest.fn(),
      getClassNames: jest.fn(),
      clearValue: jest.fn(),
      hasValue: false,
      isMulti: false,
      isRtl: false,
      options: [],
      selectOption: jest.fn(),
      setValue: jest.fn(),
      theme: {} as any,
    } as any;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering behavior', () => {
    it('should render children and MenuList when not searchable', () => {
      render(<CustomMenuList {...createProps(false)} />);

      expect(screen.getByText('Options List')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('should render search input when searchable is true', () => {
      render(<CustomMenuList {...createProps(true)} />);

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByText('Options List')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should call onInputChange when typing in search input', () => {
      render(<CustomMenuList {...createProps(true)} />);

      const input = screen.getByPlaceholderText('Search');
      fireEvent.change(input, { target: { value: 'apple' } });

      expect(mockOnInputChange).toHaveBeenCalledWith('apple', {
        action: 'input-change',
        prevInputValue: '',
      });
    });

    it('should update mouseOver ref on mouse enter/leave', () => {
      const props = createProps(true);
      render(<CustomMenuList {...props} />);

      const searchContainer = screen.getByTestId('styled-search-option');

      // Agora isso vai funcionar porque o mock repassa o onMouseEnter
      fireEvent.mouseEnter(searchContainer);
      expect(props.isMouseOverSearchRef.current).toBe(true);

      fireEvent.mouseLeave(searchContainer);
      expect(props.isMouseOverSearchRef.current).toBe(false);
    });
  });

  describe('data-testid', () => {
    it('should apply dynamic IDs when dataTestId is provided (Searchable)', () => {
      const props = createProps(true, { dataTestId: 'my-select' });
      render(<CustomMenuList {...props} />);

      expect(screen.getByTestId('my-select-menu-list')).toBeInTheDocument();
      expect(
        screen.getByTestId('my-select-search-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('my-select-search-input')).toBeInTheDocument();
    });

    it('should apply dynamic IDs when dataTestId is provided (Not Searchable)', () => {
      const props = createProps(false, { dataTestId: 'my-select' });
      render(<CustomMenuList {...props} />);

      expect(screen.getByTestId('my-select-menu-list')).toBeInTheDocument();
      expect(
        screen.queryByTestId('my-select-search-container'),
      ).not.toBeInTheDocument();
    });

    it('should NOT apply dynamic IDs when not provided (Clean Code)', () => {
      render(<CustomMenuList {...createProps(true)} />);

      const menuList = screen.getByTestId('menu-list');
      const searchContainer = screen.getByTestId('styled-search-option');
      const input = screen.getByPlaceholderText('Search');

      expect(menuList.getAttribute('data-testid')).toBe('menu-list');
      expect(searchContainer.getAttribute('data-testid')).toBe(
        'styled-search-option',
      );
      expect(input).not.toHaveAttribute('data-testid');
    });
  });
});
