import { Heading } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';

import { StyledBasicHeader, StyledSubtitle } from './BasicHeader.styles';

interface BasicHeaderProps {
  title: string;
  subtitle?: string;
  titleSize?: 'H3' | 'H5' | 'Hero' | 'H1' | 'H2' | 'H4';
  subtitleStyle?: {
    size: string;
    color: string;
  };
  tooltip?: React.ReactNode;
  dataTestId?: string;
}
export const BasicHeader: React.FC<BasicHeaderProps> = ({
  title,
  subtitle,
  titleSize = 'H3',
  subtitleStyle = {
    size: '12px',
    color: 'grey',
  },
  tooltip,
  dataTestId,
}) => {
  return (
    <StyledBasicHeader data-testid={dataTestId} className="basic-header">
      {title && (
        <Heading
          className="title"
          size={titleSize}
          data-testid={dataTestId ? `${dataTestId}-title` : undefined}
        >
          {title}
        </Heading>
      )}
      {subtitle && (
        <StyledSubtitle
          style={{ fontSize: subtitleStyle.size, color: subtitleStyle.color }}
          data-testid={dataTestId ? `${dataTestId}-subtitle` : undefined}
        >
          {subtitle}
        </StyledSubtitle>
      )}
      {tooltip && (
        <CustomTooltip
          size="medium"
          content={tooltip}
          label={title}
          dataTestId={dataTestId ? `${dataTestId}-tooltip` : undefined}
        >
          <Icon
            size="small"
            icon={Info}
            data-testid={dataTestId ? `${dataTestId}-tooltip-icon` : undefined}
          />
        </CustomTooltip>
      )}
    </StyledBasicHeader>
  );
};
