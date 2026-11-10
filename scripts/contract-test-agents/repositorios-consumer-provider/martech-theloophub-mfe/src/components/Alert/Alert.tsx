import { useState } from 'react';

import { Icon } from '@hexa-ui/components2';
import { ChevronDown, ChevronUp, Plus } from '@hexa-ui/icons';
import { AlertOctagon, AlertTriangle, Checkmark2, Info } from '@hexa-ui/icons2';

import { Sparkles } from '../ai/components/atoms/Icon/Sparkles';
import {
  StyledAlert,
  StyledAlertActionButtons,
  StyledAlertAttribution,
  StyledAlertBody,
  StyledAlertCloseButton,
  StyledAlertExpandedMessage,
  StyledAlertExpandedMessageContainer,
  StyledAlertMessage,
  StyledAlertTitle,
  StyledContentWrapper,
  SyledMessageContent,
} from './Alert.styles';
import { ActionButton } from './components/ActionButton/ActionButton';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'AI';
  title?: string;
  message: string | React.ReactNode;
  dataTestId?: string;
  onClose?: () => void;
  emphasis?: 'medium' | 'low';
  position?: 'sticky' | 'inline' | 'toast';
  onActionOne?: () => void;
  onActionTwo?: () => void;
  firstAction?: {
    onActionClick: () => void;
    actionMessage: string;
  };
  secondAction?: {
    onActionClick: () => void;
    actionMessage: string;
  };
  expandedAction?: {
    actionMessage: string;
    retracMessage: string;
    expandedMessage: string | React.ReactNode;
  };
}

export const Alert: React.FC<AlertProps> = ({
  type = 'warning',
  title,
  message,
  dataTestId,
  onClose,
  position = 'inline',
  emphasis = 'medium',
  firstAction,
  secondAction,

  expandedAction,
}) => {
  const icons = {
    info: Info,
    success: Checkmark2,
    warning: AlertTriangle,
    error: AlertOctagon,
    neutral: Info,
    AI: Sparkles,
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const showCloseButton = type !== 'neutral' && position === 'toast' && onClose;
  const showActionButtons = !!firstAction || !!secondAction || !!expandedAction;
  const iaAlertType = type === 'AI';
  const chevronIconConfig = {
    size: 'tiny' as const,
    style: {
      fill: '#006edb',
      stroke: '#006edb',
      marginLeft: '8px',
    },
  };

  return (
    <StyledAlert
      type={type}
      emphasis={emphasis}
      data-testid={dataTestId}
      position={position}
    >
      <StyledAlertExpandedMessageContainer>
        <Icon
          icon={icons[type]}
          style={{
            fontSize: '24px',
            alignItems: position === 'inline' ? 'center' : 'start',
          }}
        />
        <StyledAlertBody>
          {title && (
            <StyledAlertTitle
              data-testid={dataTestId ? `${dataTestId}-title` : undefined}
            >
              {title}
            </StyledAlertTitle>
          )}
          <StyledAlertMessage
            data-testid={dataTestId ? `${dataTestId}-message` : undefined}
          >
            <StyledContentWrapper>
              <SyledMessageContent iaAlertType={iaAlertType}>
                {message}
              </SyledMessageContent>
              <StyledAlertAttribution iaAlertType={iaAlertType}>
                Clara · IA Generated
              </StyledAlertAttribution>
            </StyledContentWrapper>
            {showActionButtons && (
              <StyledAlertActionButtons>
                {expandedAction?.expandedMessage && (
                  <ActionButton
                    onClick={() => setIsExpanded(!isExpanded)}
                    type={type}
                  >
                    {isExpanded ? (
                      <>
                        {expandedAction.retracMessage}
                        <ChevronUp {...chevronIconConfig} />
                      </>
                    ) : (
                      <>
                        {expandedAction.actionMessage}
                        <ChevronDown {...chevronIconConfig} />
                      </>
                    )}
                  </ActionButton>
                )}
                {firstAction && (
                  <ActionButton onClick={firstAction.onActionClick} type={type}>
                    {firstAction.actionMessage}
                  </ActionButton>
                )}
                {secondAction && (
                  <ActionButton
                    onClick={secondAction.onActionClick}
                    type={type}
                  >
                    {secondAction.actionMessage}
                  </ActionButton>
                )}
              </StyledAlertActionButtons>
            )}
          </StyledAlertMessage>
        </StyledAlertBody>

        {showCloseButton && (
          <StyledAlertCloseButton onClick={onClose}>
            <Plus
              size="medium"
              style={{
                fill: '#141414',
                stroke: '#141414',
                margin: '0 auto',
                transform: 'rotate(45deg)',
              }}
            />
          </StyledAlertCloseButton>
        )}
      </StyledAlertExpandedMessageContainer>
      {expandedAction && isExpanded && (
        <StyledAlertExpandedMessage
          data-testid={
            dataTestId ? `${dataTestId}-expanded-message` : undefined
          }
        >
          {expandedAction.expandedMessage}
        </StyledAlertExpandedMessage>
      )}
    </StyledAlert>
  );
};
