import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import CommingSoonIcon from 'assets/comming-soon.svg';
import { BasicContainer } from 'components';

import {
  StyledEmptyBrandContribution,
  StyledEmptyBrandContributionContainer,
} from './EmptyBrandContributionSection.styles';

interface EmptyBrandContributionSectionProps {
  title: string;
}

export const EmptyBrandContributionSection: React.FC<
  EmptyBrandContributionSectionProps
> = ({ title }) => {
  const { formatMessage } = useIntl();

  const emptyBrandContributionText = useMemo(() => {
    return formatMessage({
      id: 'ValueCreation.PerformanceTool.emptyBrandContribution.title',
    });
  }, [formatMessage]);

  return (
    <BasicContainer
      header={{
        title,
        tooltip: emptyBrandContributionText,
        titleSize: 'H4',
      }}
      layout={{
        border: 'small',
        borderRadius: 'large',
        shadow: 'small',
        bodyPadding: false,
        bottomSeparator: 'border',
      }}
      fullWidth
    >
      <StyledEmptyBrandContributionContainer>
        <StyledEmptyBrandContribution
          title={emptyBrandContributionText}
          customIlustration={{
            alt: 'no data available',
            height: '256px',
            src: CommingSoonIcon,
            width: '256px',
          }}
        />
      </StyledEmptyBrandContributionContainer>
    </BasicContainer>
  );
};
