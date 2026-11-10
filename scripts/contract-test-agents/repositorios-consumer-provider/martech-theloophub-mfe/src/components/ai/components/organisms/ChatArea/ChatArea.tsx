import type { ReactNode } from 'react';
import { useMemo } from 'react';

import type { SmartFlowConfig } from 'models/InsightsCopilot';

import { DEFAULT_CLARA_PROJECT_KEY } from '../../../constants/projectKeys';
import type { FAQ, Message } from '../../../types';
import { ErrorStateIcon, Lightbulb, SmartFlow } from '../../atoms/Icon';
import { SkeletonLoader } from '../../atoms/SkeletonLoader';
import { BottomBar } from '../../molecules/BottomBar';
import { EmptyState } from '../../molecules/EmptyState';
import type { FeedbackSentiment } from '../../molecules/FeedbackActions';
import { MessagesList } from '../../molecules/MessagesList';
import { SuggestionCarousel } from '../../molecules/SuggestionCarousel';
import { TemplateCard } from '../../molecules/TemplateCard';
import type { AgentStepEvent } from '../../organisms/ExecutionLog';
import {
  Container,
  ContentArea,
  FAQContent,
  FAQGrid,
  FAQHeader,
  FAQSection,
  FAQTitle,
  MessagesArea,
  SmartFlowGrid,
  SmartFlowHeader,
  SmartFlowHeaderLeft,
  SmartFlowSection,
  SmartFlowTitle,
} from './ChatArea.styles';
import { ChatAreaContext, useChatAreaContext } from './ChatAreaContext';

export interface FeedbackHandlers {
  getSentiment?: (
    messageId: string,
    serverSentiment?: FeedbackSentiment,
  ) => FeedbackSentiment;
  onThumbUp?: (messageId: string, requestId: string) => void;
  onThumbDown?: (messageId: string, requestId: string) => void;
}

interface ChatAreaRootProps {
  messages: Message[];
  projectKey?: string;
  isLoading?: boolean;
  isAbandoned?: boolean;
  children: ReactNode;
  className?: string;
}

function ChatAreaRoot({
  messages,
  projectKey = DEFAULT_CLARA_PROJECT_KEY,
  isLoading = false,
  isAbandoned = false,
  children,
  className,
}: Readonly<ChatAreaRootProps>) {
  const contextValue = useMemo(
    () => ({
      messages,
      projectKey,
      isLoading,
      hasMessages: messages.length > 0,
      isAbandoned,
    }),
    [messages, projectKey, isLoading, isAbandoned],
  );

  return (
    <ChatAreaContext.Provider value={contextValue}>
      <Container className={className}>{children}</Container>
    </ChatAreaContext.Provider>
  );
}

interface ChatAreaContentProps {
  children: ReactNode;
}

function ChatAreaContent({ children }: Readonly<ChatAreaContentProps>) {
  return (
    <ContentArea>
      <MessagesArea>{children}</MessagesArea>
    </ContentArea>
  );
}

interface ChatAreaWelcomeProps {
  faqs?: FAQ[];
  onFAQClick?: (faq: FAQ) => void;
  smartFlows?: SmartFlowConfig[];
  onSmartFlowClick?: (flow: SmartFlowConfig) => void;
  onRetryFAQs?: () => void;
  onRetrySmartFlows?: () => void;
  loadingFAQs?: boolean;
  loadingSmartFlows?: boolean;
}

function ChatAreaWelcome({
  faqs = [],
  onFAQClick,
  smartFlows = [],
  onSmartFlowClick,
  onRetryFAQs,
  onRetrySmartFlows,
  loadingFAQs = false,
  loadingSmartFlows = false,
}: Readonly<ChatAreaWelcomeProps>) {
  const { hasMessages } = useChatAreaContext();

  const showFAQs = faqs.length > 0;
  const showSmartFlows = smartFlows.length > 0;
  const showSmartFlowsEmpty = smartFlows.length === 0 && !loadingSmartFlows;
  const showFAQsEmpty = faqs.length === 0 && !loadingFAQs;

  const smartFlowLoading = useMemo(() => {
    if (!loadingSmartFlows) return null;
    return (
      <SmartFlowSection>
        <SmartFlowHeader>
          <SmartFlowHeaderLeft>
            <SmartFlow size={16} />
            <SmartFlowTitle>Suggested Smart Flows</SmartFlowTitle>
          </SmartFlowHeaderLeft>
        </SmartFlowHeader>
        <SmartFlowGrid>
          <SkeletonLoader count={2} size="sm" showAvatar={false} />
        </SmartFlowGrid>
      </SmartFlowSection>
    );
  }, [loadingSmartFlows]);

  const smartFlowEmpty = useMemo(() => {
    if (!showSmartFlowsEmpty) return null;
    return (
      <SmartFlowSection>
        <SmartFlowHeader>
          <SmartFlowHeaderLeft>
            <SmartFlow size={16} />
            <SmartFlowTitle>Suggested Smart Flows</SmartFlowTitle>
          </SmartFlowHeaderLeft>
        </SmartFlowHeader>
        <EmptyState
          icon={<ErrorStateIcon size={81} />}
          title="Suggestions unavailable."
          description="Please, try again."
          onRetry={onRetrySmartFlows}
          retryLabel="Try Again"
          loading={loadingSmartFlows}
          variant="compact"
        />
      </SmartFlowSection>
    );
  }, [showSmartFlowsEmpty, onRetrySmartFlows, loadingSmartFlows]);

  const faqLoading = useMemo(() => {
    if (!loadingFAQs) return null;
    return (
      <>
        <FAQHeader>
          <Lightbulb size={24} />
          <FAQTitle>Some questions you can ask</FAQTitle>
        </FAQHeader>
        <FAQGrid>
          <SkeletonLoader count={2} size="sm" showAvatar={false} />
        </FAQGrid>
      </>
    );
  }, [loadingFAQs]);

  const faqEmpty = useMemo(() => {
    if (!showFAQsEmpty) return null;
    return (
      <FAQSection>
        <FAQContent>
          <FAQHeader>
            <Lightbulb size={16} />
            <FAQTitle>Some questions you can ask</FAQTitle>
          </FAQHeader>
          <EmptyState
            icon={<ErrorStateIcon size={81} />}
            title="Suggestions unavailable."
            description="Please, try again."
            onRetry={onRetryFAQs}
            retryLabel="Try Again"
            loading={loadingFAQs}
            variant="compact"
          />
        </FAQContent>
      </FAQSection>
    );
  }, [showFAQsEmpty, onRetryFAQs, loadingFAQs]);

  if (hasMessages) return null;

  const hasContent =
    showFAQs || showSmartFlows || loadingSmartFlows || loadingFAQs;
  const isLoading = loadingFAQs || loadingSmartFlows;
  const bothEmpty = showSmartFlowsEmpty && showFAQsEmpty;

  if (!hasContent && !isLoading && !bothEmpty) return null;

  let smartFlowContent = smartFlowEmpty;
  if (loadingSmartFlows) {
    smartFlowContent = smartFlowLoading;
  } else if (showSmartFlows) {
    smartFlowContent = (
      <SmartFlowSection>
        <SuggestionCarousel
          ariaLabel="Suggested Smart Flows"
          header={
            <SmartFlowHeaderLeft>
              <SmartFlow size={16} />
              <SmartFlowTitle>Suggested Smart Flows</SmartFlowTitle>
            </SmartFlowHeaderLeft>
          }
          items={smartFlows}
          getKey={(flow) => flow.id}
          renderItem={(flow) => (
            <TemplateCard
              title={flow.title}
              description={flow.example_query || flow.query}
              onClick={() => onSmartFlowClick?.(flow)}
            />
          )}
        />
      </SmartFlowSection>
    );
  }

  let faqContent = faqEmpty;
  if (loadingFAQs) {
    faqContent = faqLoading;
  } else if (showFAQs) {
    faqContent = (
      <SuggestionCarousel
        ariaLabel="Some questions you can ask"
        header={
          <FAQHeader>
            <Lightbulb size={24} />
            <FAQTitle>Some questions you can ask</FAQTitle>
          </FAQHeader>
        }
        items={faqs}
        getKey={(faq) => faq.id}
        renderItem={(faq) => (
          <TemplateCard
            description={faq.query}
            onClick={() => onFAQClick?.(faq)}
          />
        )}
      />
    );
  }

  return (
    <FAQSection>
      <FAQContent>
        {smartFlowContent}
        {faqContent}
      </FAQContent>
    </FAQSection>
  );
}

interface ChatAreaMessagesProps {
  onRetry?: () => void;
  feedback?: FeedbackHandlers;
  streamingSteps?: AgentStepEvent[];
  streamingStatus?: 'idle' | 'streaming' | 'complete';
}

function ChatAreaMessages({
  onRetry,
  feedback,
  streamingSteps,
  streamingStatus,
}: Readonly<ChatAreaMessagesProps>) {
  const { messages, projectKey, isLoading, hasMessages } = useChatAreaContext();

  if (!hasMessages) return null;

  return (
    <MessagesList
      messages={messages}
      projectKey={projectKey}
      isLoading={isLoading}
      onRetry={onRetry}
      getFeedbackSentiment={feedback?.getSentiment}
      onThumbUp={feedback?.onThumbUp}
      onThumbDown={feedback?.onThumbDown}
      streamingSteps={streamingSteps}
      streamingStatus={streamingStatus}
    />
  );
}

interface ChatAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  showDiagnosis?: boolean;
  diagnosisContent?: ReactNode;
  smartFlowButton?: ReactNode;
  claraDomainDropdown?: ReactNode;
  canSubmit?: boolean;
  onNewChat?: () => void;
}

function ChatAreaInput({
  value,
  onChange,
  onSubmit,
  showDiagnosis,
  diagnosisContent,
  smartFlowButton,
  claraDomainDropdown,
  canSubmit,
  onNewChat,
}: Readonly<ChatAreaInputProps>) {
  const { isLoading, isAbandoned } = useChatAreaContext();

  return (
    <BottomBar
      inputValue={value}
      onInputChange={onChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      showDiagnosis={showDiagnosis}
      diagnosisContent={diagnosisContent}
      smartFlowButton={smartFlowButton}
      claraDomainDropdown={claraDomainDropdown}
      canSubmit={canSubmit}
      isDisabled={isAbandoned}
      onNewChat={onNewChat}
    />
  );
}

export const ChatArea = Object.assign(ChatAreaRoot, {
  Content: ChatAreaContent,
  Welcome: ChatAreaWelcome,
  Messages: ChatAreaMessages,
  Input: ChatAreaInput,
});
