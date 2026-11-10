import type { ResponsiveConfig, StackedAreaData } from '../types';
import { getStackedAreaPlugins } from './ConfigInjectorPlugin';

const mockData: StackedAreaData = {
  columns: [{ label: 'Col1', segments: [{ value: 50 }, { value: 50 }] }],
  colors: ['#EFD328', '#D9AA4A'],
  connectorColors: ['#F0DF78', '#EEC879'],
  legends: ['Beer', 'Wine'],
};

const mockConfig: ResponsiveConfig = {
  columnWidth: 72,
  columnSpacing: 16,
  fontSize: { label: 12, value: 12, variation: 12 },
  padding: { top: 50, right: 24, bottom: 40, left: 24 },
  borderRadius: 8,
  minCellHeight: 8,
};

describe('ConfigInjectorPlugin - getStackedAreaPlugins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an array with 4 plugins', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    expect(plugins).toHaveLength(4);
  });

  it('includes ZeroStackMinHeightPlugin as first element', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    expect(plugins[0].id).toBe('zeroStackMinHeight');
  });

  it('includes ZeroLabelPlugin as second element', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    expect(plugins[1].id).toBe('zeroLabel');
  });

  it('includes RoundedCornersPlugin as third element', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    expect(plugins[2].id).toBe('roundedCorners');
  });

  it('includes AreaConnectorPlugin as fourth element', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    expect(plugins[3].id).toBe('areaConnector');
  });

  it('passes config.borderRadius to RoundedCornersPlugin', () => {
    const config = { ...mockConfig, borderRadius: 12 };
    const plugins = getStackedAreaPlugins(mockData, config);
    const roundedPlugin = plugins[2];
    expect(roundedPlugin.id).toBe('roundedCorners');
  });

  it('passes data.connectorColors to AreaConnectorPlugin', () => {
    const plugins = getStackedAreaPlugins(mockData, mockConfig);
    const connectorPlugin = plugins[3];
    expect(connectorPlugin.id).toBe('areaConnector');
  });
});
