import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Accordion } from './Accordion';
import { AccordionItem } from './AccordionItem';

jest.mock('./Accordion.styles', () => ({
  AccordionContainer: ({
    children,
    className,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    className?: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId} className={className}>
      {children}
    </div>
  ),
}));

jest.mock('./AccordionItem', () => ({
  AccordionItem: ({
    id,
    title,
    children,
    isOpen = false,
    onToggle,
  }: {
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
  }) => (
    <div data-testid={`item-${id}`}>
      <button type="button" onClick={onToggle} aria-expanded={isOpen}>
        {title}
      </button>
      {isOpen ? <div>{children}</div> : null}
    </div>
  ),
}));

describe('Accordion', () => {
  it('should render container with data-testid when provided', () => {
    render(
      <Accordion dataTestId="faq">
        <AccordionItem id="1" title="Item 1">
          Content 1
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId('accordion-faq')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('should open item on toggle in single mode', () => {
    render(
      <Accordion>
        <AccordionItem id="a" title="Title A">
          Content A
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole('button', { name: /title a/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should respect defaultOpen', () => {
    render(
      <Accordion defaultOpen={['b']}>
        <AccordionItem id="a" title="Title A">
          Content A
        </AccordionItem>
        <AccordionItem id="b" title="Title B">
          Content B
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: /title a/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: /title b/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('should allow multiple items open in multiple mode', () => {
    render(
      <Accordion mode="multiple">
        <AccordionItem id="a" title="Title A">
          Content A
        </AccordionItem>
        <AccordionItem id="b" title="Title B">
          Content B
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole('button', { name: /title a/i }));
    fireEvent.click(screen.getByRole('button', { name: /title b/i }));

    expect(screen.getByRole('button', { name: /title a/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /title b/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('should expose expandAll, collapseAll and openItems via ref', () => {
    const ref = React.createRef<React.ElementRef<typeof Accordion>>();

    render(
      <Accordion ref={ref} mode="multiple">
        <AccordionItem id="x" title="X">
          Content X
        </AccordionItem>
        <AccordionItem id="y" title="Y">
          Content Y
        </AccordionItem>
      </Accordion>,
    );

    expect(ref.current?.openItems).toEqual([]);

    ref.current?.expandAll();
    expect(ref.current?.openItems).toEqual(['x', 'y']);

    ref.current?.collapseAll();
    expect(ref.current?.openItems).toEqual([]);
  });

  it('should apply className to container', () => {
    const { container } = render(
      <Accordion className="custom-class">
        <AccordionItem id="1" title="Item">
          Content
        </AccordionItem>
      </Accordion>,
    );

    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });
});
