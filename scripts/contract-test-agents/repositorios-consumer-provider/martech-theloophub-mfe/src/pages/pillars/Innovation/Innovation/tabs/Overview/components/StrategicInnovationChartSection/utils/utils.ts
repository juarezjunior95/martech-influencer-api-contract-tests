import { ConnectorPluginProps } from 'components/Chart/plugins';
import { theme } from 'theme';

export const getChartOptions = (connector: ConnectorPluginProps) => ({
  layout: {
    padding: {
      top: 80,
      left: 0,
      right: 0,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      afterFit: (axis) => {
        axis.width = 45;
      },
    },
  },
  plugins: {
    datalabels: {
      display: true,
      color: '#141414',
      font: {
        size: 12,
        family: 'Barlow',
      },
    },
    connector,
  },
});

export function getDatalabelsConfig(
  isPortfolio: boolean,
  datasetIndex: number,
  datasetsSum: number[],
) {
  return {
    font: {
      family: 'Work Sans',
      size: 12,
      style: 'normal',
      weight: 'normal',
      lineHeight: '140%',
    },
    labels: {
      inside: {
        anchor: 'center',
        align: 'center',
        color: theme.colors.txt.default,
        formatter: (value: number | string) => (isPortfolio ? value : null),
      },
      top: {
        anchor: 'end',
        align: 'end',
        offset: 2,
        color: theme.colors.txt.default,
        formatter: (_value: number | string, ctx: { dataIndex: number }) => {
          if (isPortfolio && datasetIndex === 1) {
            return datasetsSum[ctx.dataIndex];
          }

          if (isPortfolio && datasetIndex === 0) {
            return null;
          }

          return _value;
        },
      },
    },
  };
}

export const getBorderConfig = (isPortfolio: boolean, index: number) => {
  return {
    borderRadius: isPortfolio && index === 0 ? 0 : 4,
    borderColor: isPortfolio && index === 0 ? 'white' : 'transparent',
    borderWidth:
      isPortfolio && index === 0
        ? ({
            top: 4,
            bottom: 0,
            left: 0,
            right: 0,
          } as any)
        : 0,
  };
};
