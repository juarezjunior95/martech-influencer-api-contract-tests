import React from 'react';

import { Button, Heading, Paragraph } from '@hexa-ui/components';

import errorIllustration from '../../assets/error.png';
import { Buttons, Container, Header } from './Error.styles';

interface SectionProps {
  message?: string;
  dataTestId?: string;
}

interface PageProps {
  message?: string;
  title?: string;
  actions?: boolean;
  actionOne?: string;
  actionTwo?: string;
  handleActionOne?: () => void;
  handleActionTwo?: () => void;
  isLoadingOne?: boolean;
  isLoadingTwo?: boolean;
  dataTestId?: string;
}

export const ErrorContainer: React.FC<PageProps> = ({
  actionOne,
  actionTwo,
  title,
  handleActionOne,
  handleActionTwo,
  message = '',
  actions = false,
  isLoadingOne = false,
  isLoadingTwo = false,
  dataTestId,
}) => {
  return (
    <Container
      data-testid={dataTestId ? `error-container-${dataTestId}` : undefined}
    >
      <img
        src={errorIllustration}
        alt="Error"
        loading="lazy"
        width="200px"
        height="200px"
        data-testid={
          dataTestId ? `error-container-image-${dataTestId}` : undefined
        }
      />
      <Header
        data-testid={
          dataTestId ? `error-container-header-${dataTestId}` : undefined
        }
      >
        <Heading
          size="H3"
          data-testid={
            dataTestId ? `error-container-title-${dataTestId}` : undefined
          }
        >
          {title}
        </Heading>
        {message ? (
          <Paragraph
            data-testid={
              dataTestId ? `error-container-message-${dataTestId}` : undefined
            }
            size="basis"
            css={{ color: 'rgba(20, 20, 20, 0.56)' }}
          >
            {message}
          </Paragraph>
        ) : null}
      </Header>
      {actions ? (
        <Buttons
          data-testid={
            dataTestId ? `error-container-buttons-${dataTestId}` : undefined
          }
        >
          {actionOne && (
            <Button
              size="medium"
              variant="secondary"
              onClick={handleActionOne}
              isLoading={isLoadingOne}
              data-testid={dataTestId ? `${dataTestId}-action-one` : undefined}
            >
              {actionOne}
            </Button>
          )}
          {actionTwo && (
            <Button
              size="medium"
              variant="primary"
              onClick={handleActionTwo}
              isLoading={isLoadingTwo}
              data-testid={dataTestId ? `${dataTestId}-action-two` : undefined}
            >
              {actionTwo}
            </Button>
          )}
        </Buttons>
      ) : null}
    </Container>
  );
};

export const ErrorSection: React.FC<SectionProps> = ({
  message,
  dataTestId,
}) => {
  return (
    <Container
      data-testid={dataTestId ? `error-section-${dataTestId}` : undefined}
    >
      <img
        src={errorIllustration}
        alt="No Connection Found"
        width="200px"
        height="200px"
        loading="lazy"
        data-testid={
          dataTestId ? `error-section-image-${dataTestId}` : undefined
        }
      />
      <Paragraph
        data-testid={
          dataTestId ? `error-section-message-${dataTestId}` : undefined
        }
        size="small"
      >
        {message}
      </Paragraph>
    </Container>
  );
};
