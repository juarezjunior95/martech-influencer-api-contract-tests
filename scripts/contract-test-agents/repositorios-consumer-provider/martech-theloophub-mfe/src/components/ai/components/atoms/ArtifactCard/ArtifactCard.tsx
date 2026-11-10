import styled from '@emotion/styled';

import type { Artifact } from '../../../types';

interface ArtifactCardProps {
  artifact: Artifact;
  onClick?: () => void;
}

const cardStyles = `
  display: flex;
  align-items: center;
  padding: 0 var(--ai-chat-space-2, 8px);
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
  border-radius: var(--ai-chat-radius-md, 8px);
  text-decoration: none;
  color: var(--ai-chat-color-text-primary, #141414);
  background-color: rgba(20, 20, 20, 0.04);
  cursor: pointer;
  transition: border-color 300ms ease-in-out,
    background-color 300ms ease-in-out;

  &:hover {
    border-color: var(--ai-chat-color-bd-secondary, rgba(0, 0, 0, 0.16));
    background-color: rgba(20, 20, 20, 0.06);
    text-decoration: none;
  }
`;

const Card = styled.div`
  ${cardStyles}
`;

const CardLink = styled.a`
  ${cardStyles}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: var(--ai-chat-space-2, 8px) 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--ai-chat-space-2, 8px);
`;

const Title = styled.span`
  flex: 1;
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-body-md, 16px);
  font-weight: var(--ai-chat-font-weight-bold, 700);
  line-height: var(--ai-chat-line-height-snug, 1.4);
  color: var(--ai-chat-color-fg-default, #141414);
`;

const Arrow = styled.span`
  flex-shrink: 0;
  font-size: var(--ai-chat-font-size-2xl, 20px);
  line-height: var(--ai-chat-line-height-tight, 1);
  color: var(--ai-chat-color-fg-tertiary, #adadad);
  align-self: flex-start;
  margin-top: 2px;
  margin-right: var(--ai-chat-space-2, 8px);
`;

export const ArtifactCard = ({ artifact, onClick }: ArtifactCardProps) => {
  const content = (
    <Content>
      <TitleRow>
        <Title>{artifact.question}</Title>
        <Arrow>&#8599;</Arrow>
      </TitleRow>
    </Content>
  );

  if (artifact.url && !onClick) {
    return (
      <CardLink href={artifact.url} target="_blank" rel="noopener noreferrer">
        {content}
      </CardLink>
    );
  }

  return <Card onClick={onClick}>{content}</Card>;
};
