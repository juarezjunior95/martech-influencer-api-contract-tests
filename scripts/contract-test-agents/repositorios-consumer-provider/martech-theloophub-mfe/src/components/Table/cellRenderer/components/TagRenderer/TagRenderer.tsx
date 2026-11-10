import { StyledTag } from './TagRenderer.styles';

interface TagRendererProps {
  tagData: {
    color: string;
    backgroundColor: string;
    value: string;
    unitOfMeasure?: string;
  };
  dataTestId?: string;
}

export const TagRenderer = ({
  tagData,
  dataTestId,
}: TagRendererProps): JSX.Element => {
  return (
    <StyledTag
      style={{ backgroundColor: tagData.backgroundColor }}
      data-testid={dataTestId ? `tag-${dataTestId}` : undefined}
    >
      <span style={{ color: tagData.color }}>
        {tagData.value}
        <span>
          {''} {tagData.unitOfMeasure && <span>{tagData.unitOfMeasure}</span>}
        </span>
      </span>
    </StyledTag>
  );
};
