import { PlatformPillar } from '../types';
import { getPillarIdByName } from './getPillarIdByName';

const mockPillars: PlatformPillar[] = [
  {
    id: 1,
    name: 'Value Creation',
    description: '',
    hexaIcon: '',
    resourcesIds: [],
  },
  {
    id: 2,
    name: 'Category',
    description: '',
    hexaIcon: '',
    resourcesIds: [],
  },
  {
    id: 3,
    name: 'Portfolio & Brand',
    description: '',
    hexaIcon: '',
    resourcesIds: [],
  },
];

describe('getPillarIdByName', () => {
  it('should return pillar id when name matches exactly', () => {
    expect(getPillarIdByName(mockPillars, 'Value Creation')).toBe(1);
    expect(getPillarIdByName(mockPillars, 'Category')).toBe(2);
  });

  it('should return pillar id when name matches case-insensitively', () => {
    expect(getPillarIdByName(mockPillars, 'value creation')).toBe(1);
    expect(getPillarIdByName(mockPillars, 'CATEGORY')).toBe(2);
  });

  it('should trim pillarName and pillar name before comparing', () => {
    expect(getPillarIdByName(mockPillars, '  Value Creation  ')).toBe(1);
    expect(
      getPillarIdByName(
        [{ ...mockPillars[0], name: '  Value Creation  ' }],
        'Value Creation',
      ),
    ).toBe(1);
  });

  it('should return undefined when no pillar matches', () => {
    expect(getPillarIdByName(mockPillars, 'Unknown Pillar')).toBeUndefined();
    expect(getPillarIdByName(mockPillars, '')).toBeUndefined();
  });

  it('should return undefined when platformPillars is empty', () => {
    expect(getPillarIdByName([], 'Value Creation')).toBeUndefined();
  });

  it('should return first matching pillar id when multiple could match', () => {
    const pillarsWithDuplicate: PlatformPillar[] = [
      { ...mockPillars[0], id: 10, name: 'Value Creation' },
      { ...mockPillars[0], id: 20, name: 'Value Creation' },
    ];
    expect(getPillarIdByName(pillarsWithDuplicate, 'Value Creation')).toBe(10);
  });
});
