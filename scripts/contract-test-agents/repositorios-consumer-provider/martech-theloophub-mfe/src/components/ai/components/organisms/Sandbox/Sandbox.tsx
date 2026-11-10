import { forwardRef, useMemo } from 'react';

import {
  Content,
  Controls,
  Description,
  Dot,
  Frame,
  Header,
  HeaderContent,
  StyledSandbox,
  Title,
  Viewport,
} from './Sandbox.styles';
import type { SandboxProps } from './Sandbox.types';

export const Sandbox = forwardRef<HTMLDivElement, SandboxProps>(
  (
    {
      children,
      title,
      description,
      background = 'grid',
      device = 'auto',
      height = 400,
      width,
      padding = 24,
      showFrame = false,
      className,
      style,
    },
    ref,
  ) => {
    const formatDimension = (value?: number | string): string | undefined => {
      if (!value) return undefined;
      return typeof value === 'number' ? `${value}px` : value;
    };

    const viewportStyle = useMemo(
      () => ({
        height: typeof height === 'number' ? `${height}px` : height,
        width: formatDimension(width),
      }),
      [height, width],
    );

    const contentStyle = useMemo(
      () => ({
        padding: typeof padding === 'number' ? `${padding}px` : padding,
      }),
      [padding],
    );

    const hasHeader = title || description;

    return (
      <StyledSandbox
        ref={ref}
        $device={device}
        className={className}
        style={style}
      >
        {hasHeader && (
          <Header>
            <HeaderContent>
              {title && <Title>{title}</Title>}
              {description && <Description>{description}</Description>}
            </HeaderContent>
            <Controls>
              <Dot />
              <Dot />
              <Dot />
            </Controls>
          </Header>
        )}

        <Viewport
          $background={background}
          style={viewportStyle}
          data-sandbox-viewport
        >
          {showFrame ? (
            <Frame>
              <Content style={contentStyle}>{children}</Content>
            </Frame>
          ) : (
            <Content style={contentStyle}>{children}</Content>
          )}
        </Viewport>
      </StyledSandbox>
    );
  },
);

Sandbox.displayName = 'Sandbox';
