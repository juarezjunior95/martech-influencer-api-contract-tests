import { BasicContainer } from 'components';

import { StackedAreaBody } from './components/StackedAreaBody';
import { BODY_DEFAULT_PADDING_BOTTOM } from './constants';
import { StackedAreaProps } from './types';

export const StackedAreaContainer: React.FC<StackedAreaProps> = ({
  data,
  containerHeader,
  containerLayout,
  ...props
}) => {
  const body = <StackedAreaBody data={data} {...props} />;

  if (!containerHeader) return body;

  return (
    <BasicContainer
      header={containerHeader}
      layout={{
        bodyPadding: false,
        headerPadding: 'small',
        borderRadius: 'large',
        border: 'gray',
        shadow: 'none',
        ...containerLayout,
        bodyStyle: { paddingBottom: BODY_DEFAULT_PADDING_BOTTOM },
      }}
      dataTestId={props.dataTestId}
    >
      {body}
    </BasicContainer>
  );
};
