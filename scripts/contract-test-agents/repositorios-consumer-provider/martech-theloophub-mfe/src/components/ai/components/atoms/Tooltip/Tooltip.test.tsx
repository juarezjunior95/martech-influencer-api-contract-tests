import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('should render children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('should hide tooltip when mouse leaves', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(button);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('should not show tooltip when hidden', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" hidden>
        <button>Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    await waitFor(
      () => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  it('should apply correct position', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip text" position="top">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <Tooltip content="Tooltip text" position="bottom">
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render only children when hidden', () => {
    render(
      <Tooltip content="Tooltip text" hidden>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Tooltip content="Tooltip text" className="custom-class">
        <button>Trigger</button>
      </Tooltip>,
    );

    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });
});
