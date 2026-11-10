import { useIntl } from 'react-intl';

import { Button, Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Close } from '@hexa-ui/icons2';
import { BrandImg, Tag } from 'components';
import { FilterValue, Option } from 'models/Filters';

import {
  SubFilterBrandCompetitorBox,
  SubFilterBrandCompetitorTagContainer,
} from './SubFilterBrandCompetitorView.styles';

export interface SubFilterBrandCompetitorViewProps {
  competitorIsActive: boolean;
  hasBrandAbi: boolean;
  brand: FilterValue;
  brandImageUrl?: string;
  brandCompetitor?: Option;
  onOpenModal: () => void;
  selectButtonLabel?: string;
  brandAbiFieldValue?: FilterValue;
  dataTestId?: string;
}

export const SubFilterBrandCompetitorView = ({
  competitorIsActive,
  hasBrandAbi,
  brand,
  brandImageUrl,
  brandCompetitor,
  onOpenModal,
  selectButtonLabel = 'Select a Competitor',
  brandAbiFieldValue,
  dataTestId,
}: SubFilterBrandCompetitorViewProps) => {
  const { formatMessage } = useIntl();

  const showAbiTag = competitorIsActive || !hasBrandAbi;
  const showCompetitorSection = competitorIsActive || !hasBrandAbi;
  const showSelectButton = !competitorIsActive && hasBrandAbi;

  return (
    <SubFilterBrandCompetitorBox data-testid={dataTestId}>
      <SubFilterBrandCompetitorTagContainer
        data-testid={dataTestId ? `${dataTestId}-abi-container` : undefined}
      >
        {showAbiTag && (
          <Tag
            text={formatMessage({ id: 'Label.Abi' })}
            textColor="#8E710B"
            borderColor="#D1A33C"
          />
        )}

        {hasBrandAbi && brandImageUrl && (
          <BrandImg
            src={brandImageUrl}
            alt={String(brandAbiFieldValue || brand || 'brand')}
          />
        )}
      </SubFilterBrandCompetitorTagContainer>

      <Icon icon={Close} />

      <SubFilterBrandCompetitorTagContainer
        data-testid={
          dataTestId ? `${dataTestId}-competitor-container` : undefined
        }
      >
        {showCompetitorSection && (
          <>
            <Paragraph>{brandCompetitor?.label}</Paragraph>
            <Tag
              text={formatMessage({ id: 'Label.competitor' })}
              textColor="#4C5965"
              borderColor="#7B919D"
            />
          </>
        )}
      </SubFilterBrandCompetitorTagContainer>
      {showSelectButton && (
        <Button
          elevated
          size="medium"
          variant="secondary"
          onClick={onOpenModal}
          data-testid={dataTestId ? `${dataTestId}-button` : undefined}
        >
          {selectButtonLabel}
        </Button>
      )}
    </SubFilterBrandCompetitorBox>
  );
};
