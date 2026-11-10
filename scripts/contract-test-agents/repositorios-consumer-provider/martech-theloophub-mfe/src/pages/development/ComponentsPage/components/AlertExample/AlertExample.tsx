import { Button, Heading, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { Alert } from 'components';
import { useToast } from 'contexts';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

const AlertExampleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const AlertExample = () => {
  const toast = useToast();

  return (
    <AlertExampleContainer>
      <StyledContainer>
        <Heading style={{ marginBottom: '16px' }}>Style Inline</Heading>
        <Paragraph style={{ marginBottom: '16px' }} weight="medium">
          Emphasis Medium
        </Paragraph>

        <StyledSection>
          <Alert type="info" message="This is an info alert" />
          <Alert type="success" message="This is an success alert" />
          <Alert type="neutral" message="This is an neutral alert" />
        </StyledSection>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
          />
        </StyledSection>

        <StyledSection>
          <Alert type="warning" message="This is an warning alert" />
          <Alert type="error" message="This is an error alert" />
          <Alert type="AI" message="This is an AI alert" />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
          />
        </StyledSection>

        <AlertExampleContainer>
          <Alert
            type="info"
            message="This is an info alert"
            firstAction={{
              onActionClick: () => console.log('Toast info action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast info action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
            firstAction={{
              onActionClick: () => console.log('Toast info action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast info action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="success"
            message="This is an success alert"
            firstAction={{
              onActionClick: () => console.log('Toast success action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast success action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
            firstAction={{
              onActionClick: () => console.log('Toast success action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast success action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            firstAction={{
              onActionClick: () => console.log('Toast neutral action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast neutral action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
            firstAction={{
              onActionClick: () => console.log('Toast neutral action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast neutral action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="warning"
            message="This is an warning alert"
            firstAction={{
              onActionClick: () => console.log('Toast warning action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast warning action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
            firstAction={{
              onActionClick: () => console.log('Toast warning action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast warning action two'),
              actionMessage: 'Second action',
            }}
            onActionTwo={() => console.log('Toast warning action two')}
          />
          <Alert
            type="error"
            message="This is an error alert"
            firstAction={{
              onActionClick: () => console.log('Toast error action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast error action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
            firstAction={{
              onActionClick: () => console.log('Toast error action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast error action two'),
              actionMessage: 'Second action',
            }}
          />
          <Alert
            type="AI"
            message="This is an AI alert"
            firstAction={{
              onActionClick: () => console.log('Toast AI action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast AI action two'),
              actionMessage: 'Second action',
            }}
          />
        </AlertExampleContainer>

        <Paragraph style={{ margin: '16px 0' }} weight="medium">
          Emphasis Low
        </Paragraph>

        <StyledSection>
          <Alert type="info" message="This is an info alert" emphasis="low" />
          <Alert
            type="success"
            message="This is an success alert"
            emphasis="low"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            emphasis="low"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
            emphasis="low"
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
            emphasis="low"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
            emphasis="low"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            emphasis="low"
          />
          <Alert type="error" message="This is an error alert" emphasis="low" />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
            emphasis="low"
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
            emphasis="low"
          />
        </StyledSection>

        <AlertExampleContainer>
          <Alert
            type="info"
            message="This is an info alert"
            firstAction={{
              onActionClick: () => console.log('Toast info action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast info action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
            firstAction={{
              onActionClick: () => console.log('Toast info action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast info action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="success"
            message="This is an success alert"
            firstAction={{
              onActionClick: () => console.log('Toast success action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast success action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
            firstAction={{
              onActionClick: () => console.log('Toast success action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast success action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            firstAction={{
              onActionClick: () => console.log('Toast neutral action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast neutral action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
            firstAction={{
              onActionClick: () => console.log('Toast neutral action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast neutral action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="warning"
            message="This is an warning alert"
            firstAction={{
              onActionClick: () => console.log('Toast warning action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast warning action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
            firstAction={{
              onActionClick: () => console.log('Toast warning action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast warning action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="error"
            message="This is an error alert"
            firstAction={{
              onActionClick: () => console.log('Toast error action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast error action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
            firstAction={{
              onActionClick: () => console.log('Toast error action one'),
              actionMessage: 'First action',
            }}
            secondAction={{
              onActionClick: () => console.log('Toast error action two'),
              actionMessage: 'Second action',
            }}
            emphasis="low"
          />
        </AlertExampleContainer>
      </StyledContainer>

      <StyledContainer>
        <Heading style={{ marginBottom: '16px' }}>Style Toast</Heading>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            onClose={() => console.log('close info')}
            position="toast"
          />
          <Alert
            type="success"
            message="This is an success alert"
            onClose={() => console.log('close success')}
            position="toast"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            onClose={() => console.log('close neutral')}
            position="toast"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
            onClose={() => console.log('close info')}
            position="toast"
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
            onClose={() => console.log('close success')}
            position="toast"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
            onClose={() => console.log('close neutral')}
            position="toast"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            onClose={() => console.log('close warning')}
            position="toast"
          />
          <Alert
            type="error"
            message="This is an error alert"
            onClose={() => console.log('close error')}
            position="toast"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
            onClose={() => console.log('close warning')}
            position="toast"
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
            onClose={() => console.log('close error')}
            position="toast"
          />
        </StyledSection>

        <StyledSection>
          <Button
            onClick={() =>
              toast.info({
                title: 'Title Info',
                message: 'This is an info alert',
              })
            }
          >
            Info Toast
          </Button>
          <Button
            onClick={() =>
              toast.error({
                title: 'Title Error',
                message: 'This is an error alert',
              })
            }
          >
            Error Toast
          </Button>
          <Button
            onClick={() =>
              toast.success({
                title: 'Title Success',
                message: 'This is an success alert',
              })
            }
          >
            Success Toast
          </Button>
          <Button
            onClick={() =>
              toast.warning({
                title: 'Title Warning',
                message: 'This is an warning alert',
              })
            }
          >
            Warning Toast
          </Button>
        </StyledSection>
      </StyledContainer>

      <StyledContainer>
        <Heading style={{ marginBottom: '16px' }}>Style Sticky</Heading>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            position="sticky"
          />
          <Alert
            type="success"
            message="This is an success alert"
            position="sticky"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            position="sticky"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="info"
            message="This is an info alert"
            title="Title Info"
            position="sticky"
          />
          <Alert
            type="success"
            message="This is an success alert"
            title="Title Success"
            position="sticky"
          />
          <Alert
            type="neutral"
            message="This is an neutral alert"
            title="Title Neutral"
            position="sticky"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            position="sticky"
          />
          <Alert
            type="error"
            message="This is an error alert"
            position="sticky"
          />
        </StyledSection>

        <StyledSection>
          <Alert
            type="warning"
            message="This is an warning alert"
            title="Title Warning"
            position="sticky"
          />
          <Alert
            type="error"
            message="This is an error alert"
            title="Title Error"
            position="sticky"
          />
        </StyledSection>
      </StyledContainer>
    </AlertExampleContainer>
  );
};
