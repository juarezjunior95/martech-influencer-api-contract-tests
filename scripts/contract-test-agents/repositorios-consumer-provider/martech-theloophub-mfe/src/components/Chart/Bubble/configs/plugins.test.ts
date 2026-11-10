import { createBackgroundPlugin } from '../../plugins';
import { COLUMN_WIDTH, getHoveredColumn } from '../constants';
import { createColumnHoverPlugin, createDividerPlugin } from '../plugins';
import { BubbleChartData } from '../types';
import { getPlugins } from './plugins';

// Mock plugins
jest.mock('../plugins', () => ({
  createColumnHoverPlugin: jest.fn(() => ({ id: 'columnHover' })),
  createDividerPlugin: jest.fn(() => ({ id: 'divider' })),
}));

jest.mock('../../plugins', () => ({
  createBackgroundPlugin: jest.fn(() => ({ id: 'background' })),
}));

jest.mock('../constants', () => ({
  COLUMN_WIDTH: 100,
  getHoveredColumn: jest.fn(),
}));

describe('Chart Bubble - getPlugins', () => {
  const mockData: BubbleChartData = {
    yAxis: { min: 0, max: 100 },
    info: { label: 'Test Chart' },
    backgroundChart: {
      backgrounds: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
      borderColorBubbleHover: '#0000FF',
    },
    caption: {
      title: 'Test',
      subtitle: 'Subtitle',
      data: [],
    },
    datasets: [{ bubbles: [] }, { bubbles: [] }, { bubbles: [] }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return array of plugins', () => {
    const plugins = getPlugins(mockData);

    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins.length).toBe(3);
  });

  it('should call createBackgroundPlugin with correct options', () => {
    getPlugins(mockData);

    expect(createBackgroundPlugin).toHaveBeenCalledWith({
      sections: mockData.backgroundChart.backgrounds,
      useColumnDivision: true,
      columnWidth: COLUMN_WIDTH,
      getHoveredColumn,
    });
  });

  it('should call createDividerPlugin with columns count', () => {
    getPlugins(mockData);

    expect(createDividerPlugin).toHaveBeenCalledWith(3);
  });

  it('should call createColumnHoverPlugin with columns count', () => {
    getPlugins(mockData);

    expect(createColumnHoverPlugin).toHaveBeenCalledWith(3);
  });

  it('should calculate columns count from datasets length', () => {
    const dataWith5Columns: BubbleChartData = {
      ...mockData,
      datasets: [
        { bubbles: [] },
        { bubbles: [] },
        { bubbles: [] },
        { bubbles: [] },
        { bubbles: [] },
      ],
    };

    getPlugins(dataWith5Columns);

    expect(createDividerPlugin).toHaveBeenCalledWith(5);
    expect(createColumnHoverPlugin).toHaveBeenCalledWith(5);
  });

  it('should return plugins in correct order', () => {
    const plugins = getPlugins(mockData);

    expect(plugins[0].id).toBe('background');
    expect(plugins[1].id).toBe('divider');
    expect(plugins[2].id).toBe('columnHover');
  });
});
