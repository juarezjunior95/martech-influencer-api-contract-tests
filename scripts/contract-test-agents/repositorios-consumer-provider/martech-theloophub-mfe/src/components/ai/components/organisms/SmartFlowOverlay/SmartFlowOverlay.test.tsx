import { fireEvent, render, screen } from '@testing-library/react';
import type { SmartFlowConfig } from 'models/InsightsCopilot';

import { SmartFlowOverlay } from './SmartFlowOverlay';

const mockFlows: SmartFlowConfig[] = [
  {
    id: 1,
    engine_domain: 'test',
    function_name: 'get_sales',
    title: 'Sales Report',
    query: 'Show sales for @brand',
    example_query: 'Show sales for Budweiser',
  },
  {
    id: 2,
    engine_domain: 'test',
    function_name: 'get_highlights',
    title: 'Country Highlights',
    query: 'Show highlights for @country',
    example_query: 'Show highlights for US',
  },
];

describe('SmartFlowOverlay', () => {
  it('renders all flow cards', () => {
    render(
      <SmartFlowOverlay
        smartFlows={mockFlows}
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Sales Report')).toBeInTheDocument();
    expect(screen.getByText('Country Highlights')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <SmartFlowOverlay
        smartFlows={mockFlows}
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(
      screen.getByText('Get Started with Smart Flows'),
    ).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = jest.fn();
    render(
      <SmartFlowOverlay
        smartFlows={mockFlows}
        onSelect={onSelect}
        onClose={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Sales Report'));
    const container = screen.getByRole('dialog');
    fireEvent.animationEnd(container);
    expect(onSelect).toHaveBeenCalledWith(mockFlows[0]);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <SmartFlowOverlay
        smartFlows={mockFlows}
        onSelect={jest.fn()}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByLabelText('Close'));
    // Close triggers after animation ends
    const container = screen.getByRole('dialog');
    fireEvent.animationEnd(container);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows example_query in card description', () => {
    render(
      <SmartFlowOverlay
        smartFlows={mockFlows}
        onSelect={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Show sales for Budweiser')).toBeInTheDocument();
  });
});
