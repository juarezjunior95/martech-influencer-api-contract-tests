export const tooltipValueGetter = (params) => {
  const value = params.data[params.colDef.field]?.toLowerCase();

  switch (value) {
    case 'megabrands':
      return <div>Exhibit both scale and growth.</div>;
    case 'expansion':
      return <div>Exhibit growth but no scale.</div>;
    case 'sustain':
      return <div>Exhibit scale but low growth.</div>;
    case 'tail':
      return <div>Exhibit neither scale nor growth.</div>;
  }
  return '';
};
