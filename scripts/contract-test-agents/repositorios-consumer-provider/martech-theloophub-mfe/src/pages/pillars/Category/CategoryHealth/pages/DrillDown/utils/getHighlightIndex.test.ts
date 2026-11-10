import { getHighlightIndex } from './getHighlightIndex';

describe('getHighlightIndex', () => {
  const labels = [
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
  ];

  it('should return undefined when highlightLabel is undefined', () => {
    expect(getHighlightIndex(labels, undefined)).toBeUndefined();
  });

  it('should return the correct index when highlightLabel matches', () => {
    expect(getHighlightIndex(labels, '2023')).toBe(5);
  });

  it('should return 0 when highlightLabel matches first element', () => {
    expect(getHighlightIndex(labels, '2018')).toBe(0);
  });

  it('should return undefined when highlightLabel is not found', () => {
    expect(getHighlightIndex(labels, '2030')).toBeUndefined();
  });

  it('should return undefined for an empty labels array with highlightLabel', () => {
    expect(getHighlightIndex([], '2025')).toBeUndefined();
  });

  it('should return a middle index when highlightLabel matches', () => {
    expect(getHighlightIndex(labels, '2021')).toBe(3);
  });
});
