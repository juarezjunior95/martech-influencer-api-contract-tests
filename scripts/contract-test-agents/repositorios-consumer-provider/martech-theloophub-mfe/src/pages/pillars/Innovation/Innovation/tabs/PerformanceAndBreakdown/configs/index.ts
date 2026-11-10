const commonOptions = {
  plugins: {
    datalabels: {
      display: true,
      color: '#141414',
      font: {
        size: 12,
        family: 'Barlow',
      },
    },
  },
  layout: {
    padding: {
      top: 80,
    },
  },
};

export const volumeBreakdownOptions = {
  layout: commonOptions.layout,
  scales: {
    x: {
      ticks: {
        display: false,
      },
    },
  },
  plugins: {
    ...commonOptions.plugins,
  },
};
