import { fireEvent, render, screen } from '@testing-library/react';

import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  it('renders children', () => {
    render(
      <BottomSheet
        isClosing={false}
        onCloseClick={jest.fn()}
        onAnimationEnd={jest.fn()}
      >
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <BottomSheet
        isClosing={false}
        onCloseClick={jest.fn()}
        onAnimationEnd={jest.fn()}
        title={<span>My Title</span>}
      >
        Content
      </BottomSheet>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders as dialog with aria-label', () => {
    render(
      <BottomSheet
        isClosing={false}
        onCloseClick={jest.fn()}
        onAnimationEnd={jest.fn()}
        ariaLabel="Test sheet"
      >
        Content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Test sheet');
  });

  it('calls onCloseClick when close button is clicked', () => {
    const onCloseClick = jest.fn();
    render(
      <BottomSheet
        isClosing={false}
        onCloseClick={onCloseClick}
        onAnimationEnd={jest.fn()}
      >
        Content
      </BottomSheet>,
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });

  it('calls onAnimationEnd when animation ends', () => {
    const onAnimationEnd = jest.fn();
    render(
      <BottomSheet
        isClosing={true}
        onCloseClick={jest.fn()}
        onAnimationEnd={onAnimationEnd}
      >
        Content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.animationEnd(dialog);
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('renders into portal when container is provided', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <BottomSheet
        isClosing={false}
        onCloseClick={jest.fn()}
        onAnimationEnd={jest.fn()}
        container={container}
      >
        Portal content
      </BottomSheet>,
    );

    expect(container.textContent).toContain('Portal content');
    document.body.removeChild(container);
  });
});
