import { useIntl } from 'react-intl';

import { Button, Heading } from '@hexa-ui/components';
import SearchEmpty from 'assets/Search-Empty.svg';
import { StyledBasicContainer } from 'components/BasicContainer/BasicContainer.styles';

import { NoResutStateConfigsTab } from './components';
import {
  StyledButtonsWrapper,
  StyledImage,
  StyledNoResultsWrapper,
  StyledParagraph,
} from './NoResultsState.styles';
import {
  borderProps,
  borderRadiusProps,
  NoResultsStateProps,
  NoResultsStateStylesProps,
  shadowProps,
} from './types';

const getTestId = (
  baseId: string | undefined,
  suffix: string,
): string | undefined => (baseId ? `${baseId}-${suffix}` : undefined);

const buildCss = <T extends Record<string, unknown>>(
  base: T,
  keys: (keyof T)[],
  override?: Record<string, unknown>,
): Record<string, unknown> => ({
  ...Object.fromEntries(
    keys.filter((key) => base[key]).map((key) => [key, base[key]]),
  ),
  ...override,
});

const getStyleByType = (
  type: string,
): NoResultsStateStylesProps[string] | undefined =>
  NoResutStateConfigsTab[type as keyof typeof NoResutStateConfigsTab];

const renderButtons = ({
  buttonTextId,
  secondaryButtonTextId,
  secondaryButtonVariant,
  buttonVariant,
  openModal,
  onSecondaryClick,
  dataTestId,
  formatMessage,
}: Pick<
  NoResultsStateProps,
  | 'buttonTextId'
  | 'secondaryButtonTextId'
  | 'secondaryButtonVariant'
  | 'buttonVariant'
  | 'openModal'
  | 'onSecondaryClick'
  | 'dataTestId'
> & {
  formatMessage: ReturnType<typeof useIntl>['formatMessage'];
}) => {
  if (!buttonTextId) {
    return null;
  }

  if (secondaryButtonTextId) {
    return (
      <StyledButtonsWrapper>
        <Button
          elevated
          size="medium"
          variant="secondary"
          onClick={openModal}
          data-testid={getTestId(dataTestId, 'button')}
        >
          {formatMessage({ id: buttonTextId })}
        </Button>
        <Button
          elevated
          size="medium"
          variant={secondaryButtonVariant}
          onClick={onSecondaryClick}
          data-testid={getTestId(dataTestId, 'secondary-button')}
        >
          {formatMessage({ id: secondaryButtonTextId })}
        </Button>
      </StyledButtonsWrapper>
    );
  }

  return (
    <Button
      elevated
      size="medium"
      variant={buttonVariant}
      onClick={openModal}
      data-testid={getTestId(dataTestId, 'button')}
    >
      {formatMessage({ id: buttonTextId })}
    </Button>
  );
};

export const NoResultsState = ({
  type,
  openModal,
  imageSrc,
  headerTitleId,
  descriptionId,
  buttonTextId,
  buttonVariant = 'primary',
  descriptionValues,
  secondaryButtonTextId,
  secondaryButtonVariant = 'secondary',
  onSecondaryClick,
  overrides,
  dataTestId,
}: NoResultsStateProps) => {
  const { formatMessage } = useIntl();

  const style = getStyleByType(type);

  if (!style) {
    console.error(
      `NoResultsState: "${type}" type not found in componentStyleTab`,
    );
    return null;
  }

  const containerCss = buildCss(
    style.container,
    ['height'],
    overrides?.container,
  );
  const wrapperCss = buildCss(
    style.wrapper,
    ['height', 'width'],
    overrides?.wrapper,
  );
  const imageCss = buildCss(style.image, ['height', 'width'], overrides?.image);
  const paragraphCss = buildCss(
    style.paragraph,
    ['width'],
    overrides?.paragraph,
  );

  return (
    <StyledBasicContainer
      border={style.container.border as borderProps}
      shadow={style.container.shadow as shadowProps}
      borderRadius={style.container.borderRadius as borderRadiusProps}
      css={containerCss}
      className="no-results-state-container"
      data-testid={dataTestId}
    >
      <StyledNoResultsWrapper
        data-testid={getTestId(dataTestId, 'wrapper')}
        css={wrapperCss}
      >
        <StyledImage
          src={imageSrc ?? SearchEmpty}
          alt={style.image.alt}
          className="no-results-state-image"
          css={imageCss}
          data-testid={getTestId(dataTestId, 'image')}
        />
        <Heading size="H3" data-testid={getTestId(dataTestId, 'heading')}>
          {headerTitleId ? formatMessage({ id: headerTitleId }) : null}
        </Heading>
        <StyledParagraph
          colortype="secondary"
          className="no-results-state-paragraph"
          css={paragraphCss}
          data-testid={getTestId(dataTestId, 'description')}
        >
          {descriptionId
            ? formatMessage({ id: descriptionId }, descriptionValues)
            : null}
        </StyledParagraph>
        {renderButtons({
          buttonTextId,
          secondaryButtonTextId,
          secondaryButtonVariant,
          buttonVariant,
          openModal,
          onSecondaryClick,
          dataTestId,
          formatMessage,
        })}
      </StyledNoResultsWrapper>
    </StyledBasicContainer>
  );
};
