import React from 'react';

import * as S from './Label.styles';
import { LabelItem } from './types';

interface Props {
  labels: LabelItem[];
}

export const Label: React.FC<Props> = ({ labels }) => {
  return (
    <S.LabelGrid
      style={{
        gridTemplateColumns: `repeat(${labels.length}, 1fr)`,
      }}
    >
      {labels.map((label, index) => (
        <S.LabelItemBox
          key={`${label.text}_${index}`}
          style={{
            borderColor: label.portfolioColor
              ? label.portfolioColor
              : 'transparent',
          }}
        >
          <S.LabelTextAndIconBox>
            <div dangerouslySetInnerHTML={{ __html: label.icon }}></div>
            <S.LabelText>{label.text}</S.LabelText>
          </S.LabelTextAndIconBox>
          {label.image && label.image.trim() !== '' && (
            <S.LabelImageBox>
              <S.LabelImage src={label.image} alt="Label" />
            </S.LabelImageBox>
          )}
        </S.LabelItemBox>
      ))}
    </S.LabelGrid>
  );
};
