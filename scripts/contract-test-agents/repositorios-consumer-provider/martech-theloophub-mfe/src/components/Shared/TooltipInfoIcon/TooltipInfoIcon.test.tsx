import { render } from '@testing-library/react';

import { StyledTooltipInfoIcon } from './TooltipInfoIcon.styles';

describe('StyledTooltipInfoIcon', () => {
  it('renders with default icon size of 16px', () => {
    const { container } = render(
      <StyledTooltipInfoIcon>
        <svg />
      </StyledTooltipInfoIcon>,
    );
    expect(container.firstChild).toHaveStyle({ width: '16px', height: '16px' });
  });

  it('renders with custom icon size', () => {
    const { container } = render(
      <StyledTooltipInfoIcon iconSize={26}>
        <svg />
      </StyledTooltipInfoIcon>,
    );
    expect(container.firstChild).toHaveStyle({ width: '26px', height: '26px' });
  });
});
