import React from 'react';

import { StyledRefreshLabel } from 'shared/Styles';

interface SubtitleRendererProps {
  subtitle: string;
  value: any;
}

export const SubtitleRenderer = ({
  value,
  subtitle,
}: SubtitleRendererProps): JSX.Element => {
  return (
    <React.Fragment>
      {value}
      <StyledRefreshLabel className="cell-subtitle" fontColor={'primary'}>
        {subtitle}
      </StyledRefreshLabel>
    </React.Fragment>
  );
};
