import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { setApiICBaseURL } from 'Api';
import { useEnvContext } from 'components/EnvProvider';
import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import type { SmartFlowSendParams } from 'models/InsightsCopilot';

import {
  CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  CLARA_CATEGORY_PROJECT_KEY,
} from '../../constants/projectKeys';
import {
  useClaraDomain,
  useConversationHistory,
  useConversations,
  useFAQs,
  useFeedback,
  useMessaging,
  useSmartFlow,
} from '../../hooks';
import { Button } from '../atoms/Button';
import { AddCommentAlt, ErrorStateIcon, Sparkles } from '../atoms/Icon';
import { SmartFlowButton } from '../atoms/SmartFlowButton';
import { Toaster } from '../atoms/Toaster';
import { ChatHeader } from '../molecules/ChatHeader';
import { ClaraDomainDropdown } from '../molecules/ClaraDomainDropdown';
import type { ClaraDomainOption } from '../molecules/ClaraDomainDropdown';
import { DeleteConfirmationModal } from '../molecules/DeleteConfirmationModal';
import { EmptyState } from '../molecules/EmptyState';
import { FeedbackModal } from '../molecules/FeedbackModal';
import { SmartFlowDiagnosis } from '../molecules/SmartFlowDiagnosis';
import { ChatArea } from '../organisms/ChatArea';
import { Drawer, DrawerContent, DrawerTrigger } from '../organisms/Drawer';
import { Sidebar } from '../organisms/Sidebar';
import { SmartFlowOverlay } from '../organisms/SmartFlowOverlay';
import {
  StyledCopilotBody,
  StyledSidebarOverlay,
} from './InsightsCopilot.styles';

export interface InsightsCopilotProps {
  defaultOpen?: boolean;
}

const CLARA_DOMAIN_OPTIONS: ClaraDomainOption[] = [
  {
    label: 'Clara: Category',
    value: CLARA_CATEGORY_PROJECT_KEY,
    description:
      'Gain Brand Participation Insights from Atlantia and Kantar surveys',
  },
  {
    label: 'Clara: Brand Guidance',
    value: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
    description:
      "Gain global insights from Kantar to better understand your Brand's marketing power.",
  },
];

export const InsightsCopilot = ({
  defaultOpen = false,
}: InsightsCopilotProps) => {
  // Set Insights copilot URL
  const { INSIGHTS_COPILOT_BASE_URL } = useEnvContext();
  useMemo(() => {
    setApiICBaseURL(INSIGHTS_COPILOT_BASE_URL || '');
  }, [INSIGHTS_COPILOT_BASE_URL]);

  // UI state
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [domainDropdownToggle, isDomainDropdownToggleLoading] =
    useFeatureToggle(featureToggles.aiChat.domain_dropdown);
  const showClaraDomainDropdown =
    !isDomainDropdownToggleLoading && Boolean(domainDropdownToggle);
  const { selectedClaraDomain, setSelectedClaraDomain, projectKey } =
    useClaraDomain({
      options: CLARA_DOMAIN_OPTIONS,
      isEnabled: showClaraDomainDropdown,
    });
  const previousProjectKeyRef = useRef(projectKey);

  // Domain hooks
  const history = useConversationHistory({ projectKey });

  const {
    sendMessage,
    retryLastMessage,
    newChat,
    loadConversation,
    messages,
    conversationId,
    loading,
    streamingSteps,
    streamingStatus,
    isAbandoned,
    isWebSocketConnected,
  } = useMessaging({
    projectKey,
    enableAsyncControl: true,
    enableWebSocket: true,
    onNewConversation: history.refetch,
  });

  const conversations = useConversations({
    projectKey,
    onDeleted: (id) => {
      if (id === conversationId) newChat();
    },
  });

  const send = useCallback(
    (content: string, params?: SmartFlowSendParams) => {
      sendMessage(content, params);
      setInputValue('');
    },
    [sendMessage],
  );

  const feedback = useFeedback();

  const faqs = useFAQs({ projectKey, onSelect: send });
  const smartFlow = useSmartFlow({ projectKey, onSend: send });

  useEffect(() => {
    if (previousProjectKeyRef.current === projectKey) return;

    previousProjectKeyRef.current = projectKey;
    setInputValue('');
    smartFlow.clearFlow();
    newChat();
    setIsSidebarOpen(false);
  }, [newChat, projectKey, smartFlow]);

  const handleDrawerChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setIsSidebarOpen(false);
        feedback.handleModalClose();
      }
    },
    [feedback],
  );

  const handleNewChat = useCallback(() => {
    newChat();
    setInputValue('');
    setIsSidebarOpen(false);
  }, [newChat]);

  const handleConversationClick = useCallback(
    async (conversation: { id: string; title: string }) => {
      await loadConversation(conversation.id);
      setIsSidebarOpen(false);
    },
    [loadConversation],
  );

  const handleFAQClick = useCallback(
    (faq: { query: string }) => {
      smartFlow.clearFlow();
      send(faq.query);
    },
    [smartFlow, send],
  );

  const handleSubmit = useCallback(
    (content: string) => {
      if (smartFlow.trySend()) return;
      if (!content.trim()) return;
      smartFlow.clearFlow();
      send(content);
    },
    [smartFlow, send],
  );

  const diagnosisContent = smartFlow.activeFlow ? (
    <SmartFlowDiagnosis
      flow={smartFlow.activeFlow}
      selectedParams={smartFlow.selectedParams}
      onParamChange={smartFlow.setParamValues}
      projectKey={projectKey}
    />
  ) : undefined;

  const canSubmitSmartFlow = smartFlow.activeFlow
    ? smartFlow.isReadyToSend
    : undefined;

  // General error: server unreachable (WS down + API down)
  // If WS fails but API responds (FAQs/SmartFlows load), polling works — no block.
  // If WS fails AND API fails — nothing works, block the chat.
  const hasGeneralError =
    !isWebSocketConnected && faqs.isError && smartFlow.isItemsError;

  const handleRetryAll = useCallback(() => {
    faqs.refetch();
    smartFlow.refetchItems();
  }, [faqs, smartFlow]);

  const retryAllLoading = faqs.isLoading || smartFlow.loadingItems;

  const smartFlowButton = (
    <SmartFlowButton
      active={!!smartFlow.activeFlow}
      activeTitle={smartFlow.activeFlow?.title}
      onClick={() => smartFlow.setShowOverlay(!smartFlow.showOverlay)}
      onClose={smartFlow.clearFlow}
      disabled={loading}
    />
  );

  const claraDomainDropdown = (
    <ClaraDomainDropdown
      options={CLARA_DOMAIN_OPTIONS}
      selected={selectedClaraDomain}
      onChange={setSelectedClaraDomain}
      disabled={loading}
    />
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleDrawerChange}>
      <DrawerContent width={557}>
        <DrawerTrigger>
          <Sparkles size={37} style={{ transform: 'rotate(180deg)' }} />
          Ask Clara
        </DrawerTrigger>
        <StyledCopilotBody>
          {isSidebarOpen && (
            <StyledSidebarOverlay>
              <Sidebar
                conversations={history.sidebarConversations}
                activeConversationId={conversationId ?? undefined}
                onNewChat={handleNewChat}
                onConversationClick={handleConversationClick}
                onConversationRename={conversations.rename}
                onConversationDelete={conversations.requestDelete}
                onClose={() => setIsSidebarOpen(false)}
                newChatIcon={<AddCommentAlt size={18} />}
                hasHistoryError={history.isError}
                onRetryLoadHistory={history.refetch}
                loadingHistory={history.isRetrying}
                onLoadMore={history.loadMore}
                hasMore={history.hasMore}
                loadingMore={history.loadingMore}
              />
            </StyledSidebarOverlay>
          )}

          <ChatHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            actionButton={
              <Button
                variant="action"
                iconMode
                startContent={<AddCommentAlt size={18} />}
                onClick={handleNewChat}
                aria-label="New Chat"
              />
            }
          />
          {hasGeneralError ? (
            <EmptyState
              icon={<ErrorStateIcon />}
              title="Chat couldn't be loaded"
              description="We are experiencing service instability. Please try again in a few minutes."
              onRetry={handleRetryAll}
              retryLabel="Try Again"
              loading={retryAllLoading}
            />
          ) : (
            <ChatArea
              messages={messages}
              projectKey={projectKey}
              isLoading={loading}
              isAbandoned={isAbandoned}
            >
              <ChatArea.Content>
                <ChatArea.Welcome
                  faqs={faqs.items}
                  onFAQClick={handleFAQClick}
                  smartFlows={smartFlow.items}
                  onSmartFlowClick={smartFlow.selectFlow}
                  onRetryFAQs={faqs.refetch}
                  onRetrySmartFlows={smartFlow.refetchItems}
                  loadingFAQs={faqs.isLoading}
                  loadingSmartFlows={smartFlow.loadingItems}
                />
                <ChatArea.Messages
                  onRetry={retryLastMessage}
                  feedback={{
                    getSentiment: feedback.getSentiment,
                    onThumbUp: feedback.handleThumbUp,
                    onThumbDown: feedback.handleThumbDown,
                  }}
                  streamingSteps={streamingSteps}
                  streamingStatus={streamingStatus}
                />
                {smartFlow.showOverlay && smartFlow.items.length > 0 && (
                  <SmartFlowOverlay
                    smartFlows={smartFlow.items}
                    onSelect={smartFlow.selectFlow}
                    onClose={() => smartFlow.setShowOverlay(false)}
                  />
                )}
              </ChatArea.Content>
              <ChatArea.Input
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSubmit}
                onNewChat={handleNewChat}
                showDiagnosis={smartFlow.showDiagnosis}
                diagnosisContent={diagnosisContent}
                smartFlowButton={smartFlowButton}
                claraDomainDropdown={
                  showClaraDomainDropdown ? claraDomainDropdown : undefined
                }
                canSubmit={canSubmitSmartFlow}
              />
            </ChatArea>
          )}

          <DeleteConfirmationModal
            open={conversations.isDeleteModalOpen}
            onConfirm={conversations.confirmDelete}
            onCancel={conversations.cancelDelete}
          />

          {feedback.modalState && (
            <FeedbackModal
              open
              onOpenChange={(open) => {
                if (!open) feedback.handleModalClose();
              }}
              sentiment={feedback.modalState.sentiment}
              onSubmit={feedback.handleModalSubmit}
            />
          )}

          <Toaster />
        </StyledCopilotBody>
      </DrawerContent>
    </Drawer>
  );
};

export default InsightsCopilot;
