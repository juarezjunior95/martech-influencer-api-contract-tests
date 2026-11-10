import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(
    to right,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: var(--ai-chat-radius-xl, 16px);
`;

export const HeaderSkeleton = styled(SkeletonBase)`
  height: 22px;
  width: 60%;
  margin-bottom: var(--ai-chat-space-4, 16px);
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitleSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 35%;
  margin-bottom: var(--ai-chat-space-3, 12px);
`;

export const ParagraphSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2, 8px);
`;

export const LineSkeleton = styled(SkeletonBase)<{ width?: string }>`
  height: 14px;
  width: ${({ width }) => width || '100%'};
`;

export const AccordionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const AccordionItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  padding: var(--ai-chat-space-4, 16px);
  border-bottom: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));

  &:last-child {
    border-bottom: none;
  }
`;

export const AccordionHeaderSkeleton = styled(SkeletonBase)`
  height: 16px;
  width: 65%;
`;
