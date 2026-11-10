import styled from '@emotion/styled';

import type { SandboxBackground, SandboxDevice } from './Sandbox.types';

const deviceMaxWidth: Record<SandboxDevice, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
  auto: '100%',
};

export const StyledSandbox = styled.div<{ $device: SandboxDevice }>`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.03);
  max-width: ${({ $device }) => deviceMaxWidth[$device]};
  ${({ $device }) =>
    ($device === 'tablet' || $device === 'mobile') && 'margin: 0 auto;'}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h4`
  font-family: var(--ai-chat-font-family, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.01em;
`;

export const Description = styled.p`
  font-family: var(--ai-chat-font-family, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 400;
  color: #6b6b6b;
  margin: 0;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: background 0.15s ease;

  &:nth-of-type(1) {
    background: #ff5f57;
  }
  &:nth-of-type(2) {
    background: #febc2e;
  }
  &:nth-of-type(3) {
    background: #28c840;
  }
`;

const backgroundCss: Record<SandboxBackground, string> = {
  light: 'background: #ffffff;',
  dark: 'background: #1a1a1a;',
  transparent: `
    background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    background-color: #fafafa;
  `,
  grid: `
    background-color: #fafafa;
    background-image: linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  `,
  dots: `
    background-color: #fafafa;
    background-image: radial-gradient(
      circle,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px
    );
    background-size: 16px 16px;
  `,
};

export const Viewport = styled.div<{ $background: SandboxBackground }>`
  position: relative;
  flex: none;
  min-height: 200px;
  overflow: hidden;
  ${({ $background }) => backgroundCss[$background]}
`;

export const Content = styled.div`
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Frame = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 16px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;
