import { Chart, ChartDataset } from 'chart.js';

import {
  getTooltipHostId,
  LINE_POINT_TOOLTIP_HOST_ATTR,
} from '../linePointTooltip.utils';
import {
  createLinePointTooltipExternal,
  destroyLinePointTooltipHost,
} from './createLinePointTooltipExternal';

function makeMinimalChart(id: string | number): Chart<'line'> {
  const canvas = document.createElement('canvas');
  const parent = document.createElement('div');
  parent.appendChild(canvas);
  document.body.appendChild(parent);

  return {
    id,
    canvas,
    data: {
      datasets: [
        {
          label: 'AC',
          borderColor: '#C9A227',
          data: [1],
        } as ChartDataset<'line'>,
      ],
    },
    getDatasetMeta: () => ({ hidden: false }),
  } as unknown as Chart<'line'>;
}

describe('createLinePointTooltipExternal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates host and renders rows when tooltip is visible', () => {
    const chart = makeMinimalChart('test-chart-1');
    const external = createLinePointTooltipExternal({
      useFormattedData: false,
    });

    external({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 10,
        caretY: 20,
        dataPoints: [
          {
            dataset: chart.data.datasets[0],
            datasetIndex: 0,
            dataIndex: 0,
            formattedValue: '1.0',
            raw: 1,
          },
        ],
      } as never,
    });

    const host = document.querySelector<HTMLElement>(
      `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
    );
    expect(host).toBeTruthy();
    expect(host?.textContent).toContain('AC');
    expect(host?.textContent).toContain('1.0');

    destroyLinePointTooltipHost(chart);
    expect(
      document.querySelector(
        `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
      ),
    ).toBeNull();
  });

  it('hides host when opacity is 0', () => {
    const chart = makeMinimalChart('test-chart-2');
    const external = createLinePointTooltipExternal({});

    external({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 0,
        caretY: 0,
        dataPoints: [
          {
            dataset: chart.data.datasets[0],
            datasetIndex: 0,
            dataIndex: 0,
            formattedValue: 'x',
          },
        ],
      } as never,
    });

    external({
      chart,
      tooltip: {
        opacity: 0,
        caretX: 0,
        caretY: 0,
        dataPoints: [],
      } as never,
    });

    const host = document.querySelector<HTMLElement>(
      `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
    );
    expect(host?.style.opacity).toBe('0');
  });

  it('uses formattedData when useFormattedData is true', () => {
    const chart = makeMinimalChart('test-chart-3');
    const external = createLinePointTooltipExternal({
      formattedData: [['3.2k']],
      useFormattedData: true,
    });

    external({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 0,
        caretY: 0,
        dataPoints: [
          {
            dataset: chart.data.datasets[0],
            datasetIndex: 0,
            dataIndex: 0,
            formattedValue: '999',
          },
        ],
      } as never,
    });

    const host = document.querySelector<HTMLElement>(
      `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
    );
    expect(host?.textContent).toContain('3.2k');
  });

  it('abbreviates labels and formats values when tooltipLabels is set', () => {
    const chart = {
      id: 'abbr-test',
      canvas: document.createElement('canvas'),
      data: {
        datasets: [
          {
            label: 'Current',
            borderColor: '#a',
            data: [3.214],
          },
        ],
      },
      getDatasetMeta: () => ({ hidden: false }),
    } as unknown as Chart<'line'>;

    const external = createLinePointTooltipExternal({
      tooltipLabels: { Current: 'AC', Budget: 'BU', 'Last Year': 'LY' },
      useFormattedData: false,
    });

    external({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 0,
        caretY: 0,
        dataPoints: [
          {
            dataset: chart.data.datasets[0],
            datasetIndex: 0,
            dataIndex: 0,
            formattedValue: '462.914',
            raw: 462.914,
          },
        ],
      } as never,
    });

    const host = document.querySelector<HTMLElement>(
      `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
    );
    expect(host?.textContent).toContain('AC');
    expect(host?.textContent).toContain('462.9');
    destroyLinePointTooltipHost(chart);
  });

  it('orders rows by tooltipLabels key order', () => {
    const chart = {
      id: 'order-test',
      canvas: document.createElement('canvas'),
      data: {
        datasets: [
          { label: 'Last Year', borderColor: '#a', data: [1] },
          {
            label: 'Budget',
            borderColor: '#b',
            data: [2],
            borderDash: [2, 2],
          },
          { label: 'Current', borderColor: '#c', data: [3] },
        ],
      },
      getDatasetMeta: () => ({ hidden: false }),
    } as unknown as Chart<'line'>;

    const external = createLinePointTooltipExternal({
      tooltipLabels: {
        Current: 'AC',
        Budget: 'BU',
        'Last Year': 'LY',
      },
      useFormattedData: false,
    });

    external({
      chart,
      tooltip: {
        opacity: 1,
        caretX: 0,
        caretY: 0,
        dataPoints: [
          {
            dataset: chart.data.datasets[0],
            datasetIndex: 0,
            dataIndex: 0,
            formattedValue: '1',
            raw: 1,
          },
          {
            dataset: chart.data.datasets[1],
            datasetIndex: 1,
            dataIndex: 0,
            formattedValue: '2',
            raw: 2,
          },
          {
            dataset: chart.data.datasets[2],
            datasetIndex: 2,
            dataIndex: 0,
            formattedValue: '3',
            raw: 3,
          },
        ],
      } as never,
    });

    const host = document.querySelector<HTMLElement>(
      `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
    );
    const text = host?.textContent ?? '';
    expect(text.indexOf('AC')).toBeLessThan(text.indexOf('BU'));
    expect(text.indexOf('BU')).toBeLessThan(text.indexOf('LY'));
    destroyLinePointTooltipHost(chart);
  });
});
