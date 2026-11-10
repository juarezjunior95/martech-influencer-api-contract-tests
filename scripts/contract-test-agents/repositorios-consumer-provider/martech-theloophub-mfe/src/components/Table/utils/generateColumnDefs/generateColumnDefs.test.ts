import { generateColumnDefs } from './generateColumnDefs';

jest.mock('lodash', () => ({
  merge: (target: any, source: any) => Object.assign(target, source),
}));

describe('generateColumnDefs', () => {
  it('should generate column defs from headers', () => {
    const headers = [{ title: 'Name', id: 'name' }];
    const result = generateColumnDefs(headers, undefined);

    expect(result).toHaveLength(1);
    expect(result[0].headerName).toBe('Name');
    expect(result[0].field).toBe('name');
  });

  it('should handle headers with subtitle', () => {
    const headers = [{ title: 'Name', id: 'name', subtitle: 'Full Name' }];
    const result = generateColumnDefs(headers, undefined);

    expect(result[0].headerComponentParams).toHaveProperty(
      'subtitle',
      'Full Name',
    );
  });

  it('should handle nested children', () => {
    const headers = [
      {
        title: 'Group',
        id: 'group',
        children: [
          { title: 'Child1', id: 'child1' },
          { title: 'Child2', id: 'child2' },
        ],
      },
    ];
    const result = generateColumnDefs(headers, undefined);

    expect(result[0].children).toHaveLength(2);
    expect(result[0].children?.[0].headerName).toBe('Child1');
  });

  it('should apply configs from columnDefsConfig', () => {
    const headers = [{ title: 'Name', id: 'name' }];
    const configs = { name: { width: 200 } };
    const result = generateColumnDefs(headers, configs);

    expect(result[0].width).toBe(200);
  });

  it('should handle empty headers', () => {
    const result = generateColumnDefs([], undefined);

    expect(result).toEqual([]);
  });

  it('should pass dataTestId to headerComponentParams', () => {
    const headers = [
      {
        title: 'Portfolio',
        id: 'portfolio',
        dataTestId: 'test-portfolio',
      },
    ];
    const result = generateColumnDefs(headers, undefined);

    expect(result[0].headerComponentParams).toHaveProperty(
      'dataTestId',
      'test-portfolio',
    );
    expect(result[0].headerGroupComponentParams).toHaveProperty(
      'dataTestId',
      'test-portfolio',
    );
  });

  it('should pass dataTestId to nested children', () => {
    const headers = [
      {
        title: 'Group',
        id: 'group',
        dataTestId: 'test-group',
        children: [
          { title: 'Child1', id: 'child1', dataTestId: 'test-child1' },
          { title: 'Child2', id: 'child2', dataTestId: 'test-child2' },
        ],
      },
    ];
    const result = generateColumnDefs(headers, undefined);

    expect(result[0].headerComponentParams?.dataTestId).toBe('test-group');
    expect(result[0].children?.[0].headerComponentParams?.dataTestId).toBe(
      'test-child1',
    );
    expect(result[0].children?.[1].headerComponentParams?.dataTestId).toBe(
      'test-child2',
    );
  });
});
