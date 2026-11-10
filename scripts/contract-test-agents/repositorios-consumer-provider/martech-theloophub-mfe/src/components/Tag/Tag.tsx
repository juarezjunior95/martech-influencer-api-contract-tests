import { Paragraph } from '@hexa-ui/components';

import { TagBox } from './Tag.styles';

type TagProps = {
  Icon?: React.ElementType;
  text: string;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  dataTestId?: string;
};

export const Tag = ({
  Icon,
  text,
  textColor,
  borderColor,
  backgroundColor,
  dataTestId,
}: TagProps) => {
  const ParagraphStyle = {
    color: textColor || 'rgba(88, 88, 88, 1)',
  };

  const TagBoxStyle = {
    borderColor: borderColor || 'rgba(0, 0, 0, 0.16)',
    backgroundColor: backgroundColor || 'rgba(0,0,0,0)',
  };

  return (
    <TagBox style={TagBoxStyle} data-testid={dataTestId}>
      {Icon ? <Icon size="medium" /> : null}
      <Paragraph size="xsmall" style={ParagraphStyle}>
        {text}
      </Paragraph>
    </TagBox>
  );
};
