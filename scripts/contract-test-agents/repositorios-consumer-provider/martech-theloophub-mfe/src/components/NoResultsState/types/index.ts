import type { ComponentProps, JSXElementConstructor } from 'react';

import type { StyledBasicContainer } from '../../BasicContainer/BasicContainer.styles';
import type {
  StyledImage,
  StyledNoResultsWrapper,
  StyledParagraph,
} from '../NoResultsState.styles';

export type borderProps = 'none' | 'small';
export type shadowProps = 'none' | 'small' | 'medium' | 'large';
export type borderRadiusProps = 'none' | 'small' | 'medium' | 'large';

type CssPropOf<Component> =
  Component extends JSXElementConstructor<any>
    ? ComponentProps<Component> extends { css?: infer Css }
      ? Css
      : never
    : never;

export interface NoResultsStateOverrides {
  container?: CssPropOf<typeof StyledBasicContainer>;
  wrapper?: CssPropOf<typeof StyledNoResultsWrapper>;
  image?: CssPropOf<typeof StyledImage>;
  paragraph?: CssPropOf<typeof StyledParagraph>;
}

export interface NoResultsStateProps {
  type: string;
  openModal: () => void;
  imageSrc?: string;
  headerTitleId?: string | null;
  descriptionId?: string | null;
  descriptionValues?: Record<string, string>;
  buttonTextId?: string | null;
  buttonVariant?: 'primary' | 'secondary';
  secondaryButtonVariant?: 'primary' | 'secondary';
  secondaryButtonTextId?: string | null;
  onSecondaryClick?: () => void;
  overrides?: NoResultsStateOverrides;
  dataTestId?: string;
}

export interface NoResultsStateStylesProps {
  [key: string]: {
    container: {
      border: string;
      shadow: string;
      borderRadius: string;
      height?: string;
    };
    wrapper: {
      dataId: string;
      height: string;
      width?: string;
    };
    image: {
      alt: string;
      height?: string;
      width?: string;
    };
    paragraph: {
      width?: string;
    };
  };
}
