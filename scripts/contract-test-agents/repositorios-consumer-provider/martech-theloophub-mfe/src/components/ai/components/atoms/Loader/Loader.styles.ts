import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import type { LoaderSize } from './Loader.types';

/* ── shared size maps ── */

const dotSizes: Record<LoaderSize, { gap: string; size: string }> = {
  xs: { gap: '2px', size: '3px' },
  sm: { gap: '2px', size: '4px' },
  md: { gap: '3px', size: '6px' },
  lg: { gap: '4px', size: '8px' },
};

const spinnerSizes: Record<LoaderSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
};

/* ── dots variant ── */

const dot1 = keyframes`
  0%, 100% { background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1)); }
  0%, 33%  { background-color: var(--ai-chat-color-spinner-active, #E5B611); }
  34%, 100% { background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1)); }
`;

const dot2 = keyframes`
  0%, 33%  { background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1)); }
  34%, 66% { background-color: var(--ai-chat-color-spinner-active, #E5B611); }
  67%, 100% { background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1)); }
`;

const dot3 = keyframes`
  0%, 66%  { background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1)); }
  67%, 100% { background-color: var(--ai-chat-color-spinner-active, #E5B611); }
`;

export const DotsWrapper = styled.span<{ $size: LoaderSize }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => dotSizes[$size].gap};
`;

export const Dot = styled.span<{ $size: LoaderSize }>`
  width: ${({ $size }) => dotSizes[$size].size};
  height: ${({ $size }) => dotSizes[$size].size};
  background-color: var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1));
  border-radius: 50%;

  &:nth-of-type(1) {
    animation: ${dot1} 1.2s ease-in-out infinite;
  }
  &:nth-of-type(2) {
    animation: ${dot2} 1.2s ease-in-out infinite;
  }
  &:nth-of-type(3) {
    animation: ${dot3} 1.2s ease-in-out infinite;
  }
`;

/* ── spinner variant ── */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const SpinnerWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ai-chat-space-2, 8px);
`;

export const SpinnerCircle = styled.span<{ $size: LoaderSize }>`
  display: inline-block;
  width: ${({ $size }) => spinnerSizes[$size]};
  height: ${({ $size }) => spinnerSizes[$size]};
  border-radius: 50%;
  border: 2px solid var(--ai-chat-color-spinner-inactive, rgba(0, 0, 0, 0.1));
  border-top-color: var(--ai-chat-color-spinner-active, #e5b611);
  animation: ${spin} 0.8s linear infinite;
`;

export const SpinnerText = styled.span`
  font-family: var(--ai-chat-font-family, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-sm, 14px);
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
`;
