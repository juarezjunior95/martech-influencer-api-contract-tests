import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useBodyScrollLock } from 'hooks';

import { PillarResourcesFilterModal } from './PillarResourcesFilterModal';
import type { OrderByOption } from './types';

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  orderBy: 'a-z' as OrderByOption,
  onSetFilter: jest.fn(),
};

jest.mock('@hexa-ui/components', () => ({
  TextButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} data-testid="text-button">
      {children}
    </button>
  ),
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  Heading: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="modal-heading">{children}</h3>
  ),
  SearchField: { Root: 'div' },
  styled: (component: unknown, _styles: unknown) => component,
}));

jest.mock('@hexa-ui/icons', () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
}));

jest.mock('components/Form', () => ({
  Select: ({
    id,
    value,
    options,
    onValueChange,
  }: {
    id: string;
    value: { value: string; label: string };
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: { value: string; label: string }) => void;
  }) => (
    <div data-testid="order-by-select">
      <select
        data-testid={id}
        value={value?.value ?? ''}
        onChange={(e) => {
          const opt = options.find((o) => o.value === e.target.value);
          if (opt) onValueChange(opt);
        }}
        aria-label="Order by"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useBodyScrollLock: jest.fn(),
}));

jest.mock('./PillarResourcesFilterModal.styles', () => ({
  ModalOverlay: ({
    isOpen,
    onMouseDown,
  }: {
    isOpen: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
  }) => (
    <button
      type="button"
      data-testid="modal-overlay"
      data-is-open={String(isOpen)}
      onMouseDown={onMouseDown}
      aria-label="Close overlay"
    />
  ),
  StyledModalFilter: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (
    <div
      data-testid="pillar-resources-filter-modal"
      data-is-open={String(isOpen)}
    >
      {children}
    </div>
  ),
  HeaderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-container">{children}</div>
  ),
  HeaderTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="header-title">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  ),
  OrderByField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="order-by-field">{children}</div>
  ),
  OrderByLabel: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
  FooterButton: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      data-testid={
        variant === 'primary' ? 'set-filter-button' : 'close-footer-button'
      }
    >
      {children}
    </button>
  ),
}));

describe('PillarResourcesFilterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal with title Filter when isOpen is true', () => {
      render(<PillarResourcesFilterModal {...defaultProps} />);

      expect(
        screen.getByTestId('pillar-resources-filter-modal'),
      ).toBeInTheDocument();
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should render Order by label and select when open', () => {
      render(<PillarResourcesFilterModal {...defaultProps} />);

      expect(screen.getByLabelText('Order by')).toBeInTheDocument();
      expect(
        screen.getByTestId('pillar-resources-order-by'),
      ).toBeInTheDocument();
    });

    it('should render Close and Set Filter buttons in footer', () => {
      render(<PillarResourcesFilterModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Set Filter' }),
      ).toBeInTheDocument();
    });

    it('should display current orderBy in select when open', () => {
      render(<PillarResourcesFilterModal {...defaultProps} orderBy="a-z" />);

      const select = screen.getByTestId('pillar-resources-order-by');
      expect(select).toHaveValue('a-z');
    });

    it('should display z-a in select when orderBy is z-a', () => {
      render(<PillarResourcesFilterModal {...defaultProps} orderBy="z-a" />);

      const select = screen.getByTestId('pillar-resources-order-by');
      expect(select).toHaveValue('z-a');
    });
  });

  describe('Close behavior', () => {
    it('should call onClose when header close button is clicked', async () => {
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal {...defaultProps} onClose={onClose} />,
      );

      const closeButton = screen.getByTestId('text-button');
      await userEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when footer Close button is clicked', async () => {
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal {...defaultProps} onClose={onClose} />,
      );

      const closeFooterButton = screen.getByTestId('close-footer-button');
      await userEvent.click(closeFooterButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal {...defaultProps} onClose={onClose} />,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal {...defaultProps} onClose={onClose} />,
      );

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.mouseDown(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Set Filter behavior', () => {
    it('should call onSetFilter with current orderBy and onClose when Set Filter is clicked', async () => {
      const onSetFilter = jest.fn();
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal
          {...defaultProps}
          orderBy="a-z"
          onSetFilter={onSetFilter}
          onClose={onClose}
        />,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Set Filter' }));

      expect(onSetFilter).toHaveBeenCalledWith('a-z');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onSetFilter with z-a when user changes select to Z-A and clicks Set Filter', async () => {
      const onSetFilter = jest.fn();
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal
          {...defaultProps}
          orderBy="a-z"
          onSetFilter={onSetFilter}
          onClose={onClose}
        />,
      );

      const select = screen.getByTestId('pillar-resources-order-by');
      await userEvent.selectOptions(select, 'z-a');

      await userEvent.click(screen.getByRole('button', { name: 'Set Filter' }));

      expect(onSetFilter).toHaveBeenCalledWith('z-a');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onSetFilter when user only changes select and clicks Close', async () => {
      const onSetFilter = jest.fn();
      const onClose = jest.fn();
      render(
        <PillarResourcesFilterModal
          {...defaultProps}
          orderBy="a-z"
          onSetFilter={onSetFilter}
          onClose={onClose}
        />,
      );

      const select = screen.getByTestId('pillar-resources-order-by');
      await userEvent.selectOptions(select, 'z-a');

      await userEvent.click(screen.getByTestId('close-footer-button'));

      expect(onSetFilter).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('useBodyScrollLock', () => {
    it('should call useBodyScrollLock with isOpen', () => {
      render(<PillarResourcesFilterModal {...defaultProps} isOpen={true} />);

      expect(useBodyScrollLock).toHaveBeenCalledWith(true);
    });

    it('should call useBodyScrollLock with false when isOpen is false', () => {
      render(<PillarResourcesFilterModal {...defaultProps} isOpen={false} />);

      expect(useBodyScrollLock).toHaveBeenCalledWith(false);
    });
  });
});
