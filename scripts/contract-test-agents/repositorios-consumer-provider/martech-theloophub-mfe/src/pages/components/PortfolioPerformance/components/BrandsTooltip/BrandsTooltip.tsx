import React from 'react';

interface BrandsTooltipProps {
  dataTestId?: string;
}

export const BrandsTooltip: React.FC<BrandsTooltipProps> = ({
  dataTestId,
} = {}) => {
  return (
    <div data-testid={dataTestId}>
      <p style={{ margin: 0, marginBottom: '1rem' }}>
        This section presents our top brands ranked by volume, adhering to the
        following guidelines:
      </p>
      <b>Megabrands</b>
      <ul style={{ margin: 0, marginBottom: '1rem' }}>
        <li key="megabrands-global">Global View: Our global brands.</li>
        <li key="megabrands-country">Country View: Our local megabrands.</li>
      </ul>
      <b>Expansion, Sustain, and Tail</b>
      <ul style={{ margin: 0, marginBottom: '1rem' }}>
        <li key="expansion-global">
          <b>Global View</b>: Our best worldwide brands, regardless of the
          country.
        </li>
        <li key="expansion-country">
          <b>Country View</b>: Our local megabrands.
        </li>
        <li key="expansion-local">
          <b>Country View</b>: Our top local brands in the Expansion, Sustain,
          and Tail categories.
        </li>
      </ul>
      <b>Color Code</b> - Based on Organic Growth vs. Last Year’s Year-to-Date
      (LY YTD)
      <ul style={{ margin: 0 }}>
        <li key="color-green">
          <b>Green</b>: Increasing.
        </li>
        <li key="color-red">
          <b>Red</b>: Decreasing.
        </li>
      </ul>
    </div>
  );
};
