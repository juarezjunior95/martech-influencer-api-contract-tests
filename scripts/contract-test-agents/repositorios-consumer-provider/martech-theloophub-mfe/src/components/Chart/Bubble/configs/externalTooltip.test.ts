import { setHoveredColumn } from '../constants';
import { customExternalTooltip } from './externalTooltip';

// Mock theme
jest.mock('@hexa-ui/theme', () => ({
  theme: {
    fonts: {
      paragraph: 'Arial, sans-serif',
    },
  },
}));

describe('Chart Bubble - customExternalTooltip', () => {
  let mockContainer: HTMLDivElement;
  let mockParentNode: HTMLElement;
  let mockChart: any;
  let mockDataset: any;
  let mockMeta: any;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    setHoveredColumn(null);

    // Create mock container
    mockContainer = document.createElement('div');
    mockContainer.id = 'chart-tooltips';
    document.body.appendChild(mockContainer);

    // Create mock parent node
    mockParentNode = document.createElement('div');
    mockParentNode.appendChild(document.createElement('canvas'));

    // Create mock meta data points
    const mockDataPoint1 = {
      getProps: jest.fn(() => ({ x: 100, y: 50 })),
    };
    const mockDataPoint2 = {
      getProps: jest.fn(() => ({ x: 200, y: 60 })),
    };

    mockMeta = {
      data: [mockDataPoint1, mockDataPoint2],
    };

    // Create mock dataset
    mockDataset = {
      data: [
        {
          tooltip: 'Point 1',
          pointStyle: 'circle',
          backgroundColor: '#FF0000',
        },
        {
          tooltip: 'Point 2',
          pointStyle: 'rectRot',
          backgroundColor: '#00FF00',
        },
      ],
    };

    // Create mock chart
    mockChart = {
      canvas: {
        parentNode: mockParentNode,
      },
      data: {
        datasets: [mockDataset],
      },
      getDatasetMeta: jest.fn(() => mockMeta),
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    setHoveredColumn(null);
  });

  it('should return early when hoveredColumn is null', () => {
    setHoveredColumn(null);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    expect(mockChart.getDatasetMeta).not.toHaveBeenCalled();
    expect(mockContainer.innerHTML).toBe('');
  });

  it('should create container if it does not exist', () => {
    document.body.innerHTML = '';
    setHoveredColumn(0);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const createdContainer = mockParentNode.querySelector('#chart-tooltips');
    expect(createdContainer).toBeDefined();
    expect((createdContainer as HTMLElement)?.style.position).toBe('absolute');
    expect((createdContainer as HTMLElement)?.style.pointerEvents).toBe('none');
    expect((createdContainer as HTMLElement)?.style.zIndex).toBe('1000');
  });

  it('should use existing container if it exists', () => {
    setHoveredColumn(0);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const container = document.getElementById('chart-tooltips');
    expect(container).toBe(mockContainer);
  });

  it('should clear container innerHTML on each call', () => {
    setHoveredColumn(0);
    mockContainer.innerHTML = '<div>Old Content</div>';
    const context = { chart: mockChart };

    customExternalTooltip(context);

    expect(mockContainer.innerHTML).not.toContain('Old Content');
  });

  it('should group points by proximity threshold', () => {
    setHoveredColumn(0);
    mockMeta.data[1].getProps = jest.fn(() => ({ x: 200, y: 55 })); // Within 115px threshold
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltips = mockContainer.querySelectorAll(
      'div[style*="position: absolute"]',
    );
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('should create separate groups for distant points', () => {
    setHoveredColumn(0);
    // Points with Y distance > 115 should be in separate groups
    mockMeta.data[0].getProps = jest.fn(() => ({ x: 100, y: 50 }));
    mockMeta.data[1].getProps = jest.fn(() => ({ x: 200, y: 200 })); // dy = 150 > 115
    const context = { chart: mockChart };

    customExternalTooltip(context);

    // Count only tooltip divs (those containing ul), not arrows
    const tooltips = Array.from(
      mockContainer.querySelectorAll('div[style*="position: absolute"]'),
    ).filter((div) => div.querySelector('ul') !== null);
    expect(tooltips.length).toBe(2);
  });

  it('should skip points without tooltip', () => {
    setHoveredColumn(0);
    mockDataset.data[1] = {
      tooltip: '',
      pointStyle: 'circle',
      backgroundColor: '#00FF00',
    };
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltips = mockContainer.querySelectorAll('ul li');
    expect(tooltips.length).toBe(1);
  });

  it('should render tooltip with correct styles', () => {
    setHoveredColumn(0);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    // Find tooltip div (one containing ul), not arrow
    const tooltip = Array.from(
      mockContainer.querySelectorAll('div[style*="position: absolute"]'),
    ).find((div) => div.querySelector('ul') !== null);
    expect(tooltip).toBeDefined();
    const style = tooltip?.getAttribute('style') || '';
    expect(style).toContain('background-color');
    // Browser converts rgba(20, 20, 20, 1) to rgb(20, 20, 20)
    expect(
      style.includes('rgba(20, 20, 20, 1)') ||
        style.includes('rgb(20, 20, 20)'),
    ).toBe(true);
  });

  it('should create list items for each point in group', () => {
    setHoveredColumn(0);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const listItems = mockContainer.querySelectorAll('ul li');
    expect(listItems.length).toBe(2);
  });

  it('renders bullet as circle, SVG triangle with white stroke, or diamond based on pointStyle', () => {
    setHoveredColumn(0);

    // --- circle ---
    mockDataset.data = [
      { tooltip: 'Point 1', pointStyle: 'circle', backgroundColor: '#FF0000' },
    ];
    customExternalTooltip({ chart: mockChart });

    const circleBullet = Array.from(
      mockContainer.querySelectorAll('span'),
    ).find((b) =>
      (b.getAttribute('style') || '').includes('border-radius: 50%'),
    );
    expect(circleBullet).toBeDefined();

    // --- triangle (SVG with white stroke) ---
    mockDataset.data = [
      {
        tooltip: 'Point 1',
        pointStyle: 'triangle',
        backgroundColor: '#0000FF',
      },
    ];
    customExternalTooltip({ chart: mockChart });

    const svg = mockContainer.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 10 10');
    const polygon = svg?.querySelector('polygon');
    expect(polygon?.getAttribute('stroke')).toBe('rgba(255,255,255,1)');
    expect(polygon?.getAttribute('fill')).toBe('#0000FF');

    // --- rectRot (diamond) ---
    mockDataset.data = [
      { tooltip: 'Point 1', pointStyle: 'rectRot', backgroundColor: '#00FF00' },
    ];
    customExternalTooltip({ chart: mockChart });

    const rectBullet = Array.from(mockContainer.querySelectorAll('span')).find(
      (b) => {
        const style = b.getAttribute('style') || '';
        return (
          style.includes('border-radius: 0px') ||
          style.includes('border-radius: 0')
        );
      },
    );
    expect(rectBullet).toBeDefined();
    expect(rectBullet?.getAttribute('style')).toContain('rotate(-45deg)');
  });

  it('should position tooltip on right for first columns', () => {
    setHoveredColumn(0);
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ]; // 4 datasets
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    expect(tooltip?.getAttribute('style')).toContain('translate(10%, 0)');
  });

  it('should position tooltip on left for last two columns', () => {
    setHoveredColumn(2); // Third column (index 2) in 4 columns = last two
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ]; // 4 datasets
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    expect(tooltip?.getAttribute('style')).toContain('translate(-115%, 0)');
  });

  it('should create arrow pointing right for first columns', () => {
    setHoveredColumn(0);
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    const arrow = tooltip?.querySelector('div[style*="border-right"]');
    expect(arrow).toBeDefined();
    expect(arrow?.getAttribute('style')).toContain('left: -5px');
  });

  it('should create arrow pointing left for last two columns', () => {
    setHoveredColumn(2);
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    const arrow = tooltip?.querySelector('div[style*="border-left"]');
    expect(arrow).toBeDefined();
    expect(arrow?.getAttribute('style')).toContain('right: -5px');
  });

  it('should sort points by y coordinate within group', () => {
    setHoveredColumn(0);
    mockMeta.data[0].getProps = jest.fn(() => ({ x: 100, y: 100 }));
    mockMeta.data[1].getProps = jest.fn(() => ({ x: 200, y: 50 }));
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const listItems = mockContainer.querySelectorAll('ul li');
    expect(listItems.length).toBe(2);
    // First item should have lower y (50)
    expect(listItems[0].textContent).toContain('Point 2');
  });

  it('positions tooltip at the averaged coordinates of its grouped data points', () => {
    setHoveredColumn(0);
    // avgX = (100+200)/2 = 150 | avgY = (50+60)/2 = 55
    // height = 2*20+16 = 56 | top = 55-28 = 27
    // isLastTwoColumns: 0 >= (1-3) = true → left = 150-5 = 145
    mockMeta.data[0].getProps = jest.fn(() => ({ x: 100, y: 50 }));
    mockMeta.data[1].getProps = jest.fn(() => ({ x: 200, y: 60 }));
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = Array.from(
      mockContainer.querySelectorAll('div[style*="position: absolute"]'),
    ).find((div) => div.querySelector('ul') !== null);
    const style = tooltip?.getAttribute('style') || '';
    expect(style).toContain('top: 27px');
    expect(style).toContain('left: 145px');
  });

  it('should handle empty dataset', () => {
    setHoveredColumn(0);
    mockDataset.data = [];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltips = mockContainer.querySelectorAll(
      'div[style*="position: absolute"]',
    );
    expect(tooltips.length).toBe(0);
  });

  it('falls back to #000 fill when backgroundColor is not provided', () => {
    setHoveredColumn(0);

    // triangle fallback (line 206: p.backgroundColor || '#000')
    mockDataset.data = [{ tooltip: 'Point 1', pointStyle: 'triangle' }];
    customExternalTooltip({ chart: mockChart });
    expect(mockContainer.querySelector('polygon')?.getAttribute('fill')).toBe(
      '#000',
    );

    // circle/diamond fallback (line 219: p.backgroundColor || '#000')
    mockDataset.data = [{ tooltip: 'Point 1', pointStyle: 'circle' }];
    customExternalTooltip({ chart: mockChart });
    const bulletStyle =
      Array.from(mockContainer.querySelectorAll('span'))
        .find((b) =>
          (b.getAttribute('style') || '').includes('background-color'),
        )
        ?.getAttribute('style') || '';
    expect(
      bulletStyle.includes('#000') || bulletStyle.includes('rgb(0, 0, 0)'),
    ).toBe(true);
  });

  it('should apply backgroundColor to bullet', () => {
    setHoveredColumn(0);
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const bullets = mockContainer.querySelectorAll('span');
    const bulletWithColor = Array.from(bullets).find((b) => {
      const style = b.getAttribute('style') || '';
      // Browser may convert #FF0000 to rgb(255, 0, 0)
      return (
        style.includes('background-color') &&
        (style.includes('#FF0000') || style.includes('rgb(255, 0, 0)'))
      );
    });
    expect(bulletWithColor).toBeDefined();
  });

  it('should resolve vertical collisions between tooltips', () => {
    setHoveredColumn(0);
    // Create 3 points that would create overlapping tooltips
    mockMeta.data = [
      { getProps: jest.fn(() => ({ x: 100, y: 50 })) },
      { getProps: jest.fn(() => ({ x: 100, y: 200 })) },
      { getProps: jest.fn(() => ({ x: 100, y: 350 })) },
    ];
    mockDataset.data = [
      { tooltip: 'Point 1', pointStyle: 'circle', backgroundColor: '#FF0000' },
      { tooltip: 'Point 2', pointStyle: 'circle', backgroundColor: '#00FF00' },
      { tooltip: 'Point 3', pointStyle: 'circle', backgroundColor: '#0000FF' },
    ];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltips = Array.from(
      mockContainer.querySelectorAll('div[style*="position: absolute"]'),
    ).filter((div) => div.querySelector('ul') !== null);
    expect(tooltips.length).toBe(3);
  });

  it('pushes a colliding tooltip downward when hasCollision is true', () => {
    setHoveredColumn(0);
    // Group 1: 10 points at y=100 → height=216, top=-8, bottom=208
    // Group 2: 1 point at y=216 (dy=116 > 115 → separate group) → natural top=198
    // hasCollision: 198 < 208+8=216 → true → resolved top = 208+8 = 216
    mockMeta.data = [
      ...Array.from({ length: 10 }, () => ({
        getProps: jest.fn(() => ({ x: 100, y: 100 })),
      })),
      { getProps: jest.fn(() => ({ x: 100, y: 216 })) },
    ];
    mockDataset.data = [
      ...Array.from({ length: 10 }, (_, i) => ({
        tooltip: `Point ${i + 1}`,
        pointStyle: 'circle',
        backgroundColor: '#FF0000',
      })),
      { tooltip: 'Point 11', pointStyle: 'circle', backgroundColor: '#00FF00' },
    ];

    customExternalTooltip({ chart: mockChart });

    const tooltips = Array.from(
      mockContainer.querySelectorAll('div[style*="position: absolute"]'),
    ).filter((div) => div.querySelector('ul') !== null);
    expect(tooltips.length).toBe(2);
    expect(tooltips[1].getAttribute('style')).toContain('top: 216px');
  });

  it('should position arrow dynamically based on data points', () => {
    setHoveredColumn(0);
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    const arrow = tooltip?.querySelector('div[style*="border-right"]');
    expect(arrow).toBeDefined();
    const arrowStyle = arrow?.getAttribute('style') || '';
    expect(arrowStyle).toMatch(/top:\s*\d+(\.\d+)?px/);
  });

  it('should clamp arrow position within tooltip bounds', () => {
    setHoveredColumn(0);
    mockMeta.data[0].getProps = jest.fn(() => ({ x: 100, y: 10 }));
    mockMeta.data[1].getProps = jest.fn(() => ({ x: 100, y: 15 }));
    mockChart.data.datasets = [
      mockDataset,
      mockDataset,
      mockDataset,
      mockDataset,
    ];
    const context = { chart: mockChart };

    customExternalTooltip(context);

    const tooltip = mockContainer.querySelector(
      'div[style*="position: absolute"]',
    );
    const arrow = tooltip?.querySelector('div[style*="border-right"]');
    expect(arrow).toBeDefined();
    // Arrow should be within bounds (min 10px margin)
    const arrowStyle = arrow?.getAttribute('style') || '';
    const topMatch = arrowStyle.match(/top:\s*(\d+(\.\d+)?)px/);
    if (topMatch) {
      const topValue = parseFloat(topMatch[1]);
      expect(topValue).toBeGreaterThanOrEqual(10);
    }
  });
});
