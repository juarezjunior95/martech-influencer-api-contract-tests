import { components, GroupHeadingProps } from 'react-select';

export const CustomGroupHeading = (props: GroupHeadingProps) => {
  if (!props.data.label || props.data.label == 'Ungrouped') return null;

  const { dataTestId } = props.selectProps as { dataTestId?: string };

  return (
    <components.GroupHeading
      {...props}
      data-testid={dataTestId ? `${dataTestId}-group-heading` : undefined}
    >
      {props.children}
    </components.GroupHeading>
  );
};
