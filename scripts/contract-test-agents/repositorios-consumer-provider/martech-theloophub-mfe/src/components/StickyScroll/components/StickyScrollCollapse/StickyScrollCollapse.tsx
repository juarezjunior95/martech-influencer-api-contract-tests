import { ReactNode } from 'react';

import { StickyScrollCollapseStyles } from './StickyScrollCollapse.styles';

export interface StickyScrollCollapseProps {
  children: ReactNode;
  show?: boolean;
}

export const StickyScrollCollapse = ({
  children,
  show,
}: StickyScrollCollapseProps) => (
  <StickyScrollCollapseStyles show={show}>
    {children}
  </StickyScrollCollapseStyles>
);
