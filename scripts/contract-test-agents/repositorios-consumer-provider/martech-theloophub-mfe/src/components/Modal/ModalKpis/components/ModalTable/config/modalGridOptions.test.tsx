import { render, screen } from '@testing-library/react';

jest.mock('components/Table/config/columnDefs', () => ({
  gridOptions: {
    suppressRowTransform: true,
    components: {
      customHeader: () => null,
      customAgGridTooltip: () => null,
    },
  },
}));

jest.mock('../ModalTable.styles', () => ({
  StyledModalTooltip: ({ children }: any) => (
    <div data-testid="modal-tooltip">{children}</div>
  ),
}));

import { modalGridOptions } from './modalGridOptions';

const ModalTooltip = modalGridOptions.components!.customAgGridTooltip as any;

describe('modalGridOptions', () => {
  it('should override customAgGridTooltip while keeping base components', () => {
    const base = jest.requireMock('components/Table/config/columnDefs');

    expect(modalGridOptions.components?.customAgGridTooltip).not.toBe(
      base.gridOptions.components.customAgGridTooltip,
    );
    expect((modalGridOptions.components as any)?.customHeader).toBeDefined();
  });
});

describe('ModalTooltip', () => {
  it('should render empty fragment when value is false', () => {
    const { container } = render(<ModalTooltip value="" />);

    expect(container.innerHTML).toBe('');
  });

  it('should render value with line breaks from \\n', () => {
    render(<ModalTooltip value="Line 1\nLine 2\nLine 3" />);

    const tooltip = screen.getByTestId('modal-tooltip');

    expect(tooltip.querySelectorAll('br')).toHaveLength(2);
    expect(tooltip).toHaveTextContent('Line 1');
    expect(tooltip).toHaveTextContent('Line 3');
  });

  it('should render value without br when no \\n', () => {
    render(<ModalTooltip value="Single line" />);

    const tooltip = screen.getByTestId('modal-tooltip');

    expect(tooltip.querySelectorAll('br')).toHaveLength(0);
    expect(tooltip).toHaveTextContent('Single line');
  });
});
