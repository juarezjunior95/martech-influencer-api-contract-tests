import { lazy, Suspense, useCallback, useState } from 'react';

import { useLazyGetBlobMarkdownQuery } from 'redux/api/insightsCopilot';

import { DEFAULT_CLARA_PROJECT_KEY } from '../../../constants/projectKeys';
import type { Message } from '../../../types';
import { Loader } from '../../atoms/Loader';
import { MarkdownRenderer } from '../../atoms/MarkdownRenderer';
import { MARKDOWN_CHAT_MESSAGE_CLASS } from '../../atoms/MarkdownRenderer/constants';
import { ArtifactModal } from '../ArtifactModal';

const ArtifactCards = lazy(() =>
  import('../ArtifactCards').then((m) => ({ default: m.ArtifactCards })),
);

interface MessageContentProps {
  message: Message;
  projectKey?: string;
}

export const MessageContent = ({
  message,
  projectKey = DEFAULT_CLARA_PROJECT_KEY,
}: MessageContentProps) => {
  const validArtifacts = message.artifacts?.filter((a) => a.url) ?? [];
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState(false);
  const [selectedArtifactUrl, setSelectedArtifactUrl] = useState<string | null>(
    null,
  );

  const [
    triggerGetBlob,
    { data: blobContent, isLoading: blobLoading, isError: blobError },
  ] = useLazyGetBlobMarkdownQuery();

  const handleArtifactClick = (artifact: { url: string; question: string }) => {
    setSelectedArtifactUrl(artifact.url);
    setIsArtifactModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsArtifactModalOpen(false);
    setSelectedArtifactUrl(null);
  };

  const handleLoadBlob = useCallback(
    (blobPath: string) => {
      triggerGetBlob({ blobPath, projectKey });
    },
    [triggerGetBlob, projectKey],
  );

  return (
    <>
      <MarkdownRenderer
        content={message.content}
        className={MARKDOWN_CHAT_MESSAGE_CLASS}
      />
      {validArtifacts.length > 0 && (
        <Suspense fallback={<Loader size="sm" />}>
          <ArtifactCards
            artifacts={validArtifacts}
            onArtifactClick={handleArtifactClick}
          />
        </Suspense>
      )}
      <ArtifactModal
        title={validArtifacts[0]?.question ?? ''}
        open={isArtifactModalOpen}
        onClose={handleCloseModal}
        blobPath={selectedArtifactUrl ?? undefined}
        blobContent={blobContent ?? null}
        blobLoading={blobLoading}
        blobError={blobError}
        onLoadBlob={handleLoadBlob}
      />
    </>
  );
};
