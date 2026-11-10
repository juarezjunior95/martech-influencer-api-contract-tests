import React from 'react';

import { render, screen } from '@testing-library/react';

jest.mock('../CustomValueContainer.styles', () => ({
  StyledMoreCount: ({ children, ...props }: any) => (
    <span data-testid={props['data-testid'] || 'styled-more-count'}>
      {children}
    </span>
  ),
}));

import {
  buildRenderedChildren,
  MAX_CHIPS_DISPLAY,
} from './CustomValueContainer.utils';

describe('buildRenderedChildren', () => {
  it('returns non-array children unchanged', () => {
    const node = <span data-testid="leaf">x</span>;
    expect(buildRenderedChildren(node, true, true, 10, 'select')).toStrictEqual(
      node,
    );
  });

  it('returns array children unchanged when not multi', () => {
    const children = [[<span key="a">a</span>]] as unknown as React.ReactNode;
    expect(buildRenderedChildren(children, false, true, 10, 'select')).toBe(
      children,
    );
  });

  it('returns array children unchanged when chips disabled', () => {
    const children = [[<span key="a">a</span>]] as unknown as React.ReactNode;
    expect(buildRenderedChildren(children, true, false, 10, 'select')).toBe(
      children,
    );
  });

  it('returns array children unchanged when within chip limit', () => {
    const inner = Array.from({ length: MAX_CHIPS_DISPLAY }, (_, i) => (
      <span key={i}>{i}</span>
    ));
    const children = [inner] as unknown as React.ReactNode;
    expect(buildRenderedChildren(children, true, true, MAX_CHIPS_DISPLAY)).toBe(
      children,
    );
  });

  it('truncates chips and renders more count when over limit', () => {
    const inner = Array.from({ length: MAX_CHIPS_DISPLAY + 2 }, (_, i) => (
      <span key={i}>{i}</span>
    ));
    const children = [inner] as unknown as React.ReactNode;
    const result = buildRenderedChildren(
      children,
      true,
      true,
      MAX_CHIPS_DISPLAY + 3,
      'my-select',
    ) as React.ReactNode[];

    expect(result).toHaveLength(MAX_CHIPS_DISPLAY + 1);
    render(<>{result[MAX_CHIPS_DISPLAY]}</>);
    expect(screen.getByTestId('my-select-more-count')).toHaveTextContent('+3');
  });
});
