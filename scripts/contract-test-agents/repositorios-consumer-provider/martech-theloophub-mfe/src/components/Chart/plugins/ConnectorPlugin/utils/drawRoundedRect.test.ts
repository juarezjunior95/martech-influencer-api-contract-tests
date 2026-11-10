import { drawRoundedRect } from './drawRoundedRect';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    beginPath: jest.fn(),
    setLineDash: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arcTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 0 }),
    strokeStyle: '',
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

describe('drawRoundedRect', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('draws rounded rectangle with correct path', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(15, 20);
    expect(mockCtx.closePath).toHaveBeenCalled();
  });

  it('applies correct background color', () => {
    const backgroundColor = '#000000';

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor,
    });

    expect(mockCtx.fillStyle).toBe(backgroundColor);
    expect(mockCtx.strokeStyle).toBe(backgroundColor);
  });

  it('fills and strokes the rectangle', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('draws all four corners with arcTo', () => {
    const x = 10;
    const y = 20;
    const width = 100;
    const height = 50;
    const radius = 5;

    drawRoundedRect({
      ctx: mockCtx,
      x,
      y,
      width,
      height,
      radius,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.arcTo).toHaveBeenCalledTimes(4);

    expect(mockCtx.arcTo).toHaveBeenCalledWith(
      x + width,
      y,
      x + width,
      y + radius,
      radius,
    );

    expect(mockCtx.arcTo).toHaveBeenCalledWith(
      x + width,
      y + height,
      x + width - radius,
      y + height,
      radius,
    );

    expect(mockCtx.arcTo).toHaveBeenCalledWith(
      x,
      y + height,
      x,
      y + height - radius,
      radius,
    );

    expect(mockCtx.arcTo).toHaveBeenCalledWith(x, y, x + radius, y, radius);
  });

  it('draws lines between corners', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.lineTo).toHaveBeenCalledTimes(4);
  });

  it('applies correct text styles', () => {
    const textColor = '#00FF00';

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor,
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fillStyle).toBe(textColor);
    expect(mockCtx.font).toBe('12px Work Sans');
    expect(mockCtx.textAlign).toBe('center');
    expect(mockCtx.textBaseline).toBe('middle');
  });

  it('draws label text at correct position', () => {
    const x = 10;
    const y = 20;
    const width = 100;
    const height = 50;
    const label = 'My Label';

    drawRoundedRect({
      ctx: mockCtx,
      x,
      y,
      width,
      height,
      radius: 5,
      label,
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      label,
      x + width / 2,
      y + height / 2,
    );
  });

  it('resets line dash before drawing', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.setLineDash).toHaveBeenCalledWith([0, 0]);
  });

  it('handles different radius values', () => {
    const radius = 10;

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    const arcToCall = (mockCtx.arcTo as jest.Mock).mock.calls[0];
    expect(arcToCall[4]).toBe(radius);
  });

  it('handles different dimensions', () => {
    const x = 50;
    const y = 100;
    const width = 200;
    const height = 80;

    drawRoundedRect({
      ctx: mockCtx,
      x,
      y,
      width,
      height,
      radius: 8,
      label: 'Large Rect',
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
    });

    expect(mockCtx.moveTo).toHaveBeenCalledWith(58, 100); // x + radius, y
  });

  it('draws text with different labels', () => {
    const label = '42%';

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label,
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fillText).toHaveBeenCalledWith(label, 60, 45);
  });

  it('applies different text colors', () => {
    const textColor = '#FF00FF';

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor,
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fillStyle).toBe(textColor);
  });

  it('applies different background colors', () => {
    const backgroundColor = '#00FFFF';

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor,
    });

    expect(mockCtx.strokeStyle).toBe(backgroundColor);
  });

  it('centers text vertically', () => {
    const y = 10;
    const width = 100;
    const height = 60;

    drawRoundedRect({
      ctx: mockCtx,
      x: 0,
      y,
      width,
      height,
      radius: 5,
      label: 'Centered',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'Centered',
      width / 2,
      y + height / 2,
    );
  });

  it('uses Work Sans font family', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.font).toBe('12px Work Sans');
  });

  it('sets text alignment to center', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.textAlign).toBe('center');
  });

  it('sets text baseline to middle', () => {
    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: 'Test',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
    });

    expect(mockCtx.textBaseline).toBe('middle');
  });

  it('draws prefix in bold and label in normal when prefix is provided', () => {
    (mockCtx.measureText as jest.Mock)
      .mockReturnValueOnce({ width: 30 })
      .mockReturnValueOnce({ width: 20 });

    drawRoundedRect({
      ctx: mockCtx,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      radius: 5,
      label: '42%',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
      prefix: 'CAGR:',
    });

    expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
    expect(mockCtx.fillText).toHaveBeenNthCalledWith(1, 'CAGR:', 35, 45);
    expect(mockCtx.fillText).toHaveBeenNthCalledWith(2, '42%', 65, 45);
  });
});
