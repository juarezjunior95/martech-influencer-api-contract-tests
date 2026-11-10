import { createTab } from './tab';

describe('tab', () => {
  describe('createTab', () => {
    it('should create a tab with required parameters', () => {
      const tab = createTab('tab-1', 'Tab Label');

      expect(tab).toEqual({
        id: 'tab-1',
        label: 'Tab Label',
        content: null,
        disabled: false,
        filterConfig: undefined,
      });
    });

    it('should create a tab with content', () => {
      const content = 'Test Content';
      const tab = createTab('tab-2', 'Tab 2', content);

      expect(tab.content).toBe('Test Content');
    });

    it('should create a disabled tab', () => {
      const tab = createTab('tab-3', 'Tab 3', null, true);

      expect(tab.disabled).toBe(true);
    });

    it('should create a tab with filterConfig', () => {
      const filterConfig = {
        pageName: 'TestPage',
        filtersList: ['filter1', 'filter2'],
        params: { key: 'value' },
      };

      const tab = createTab('tab-4', 'Tab 4', null, false, filterConfig);

      expect(tab.filterConfig).toEqual(filterConfig);
    });

    it('should create a tab with all parameters', () => {
      const content = 'Full Content';
      const filterConfig = {
        pageName: 'FullPage',
        filtersList: ['filterA'],
        params: { param1: true },
      };

      const tab = createTab(
        'full-tab',
        'Full Tab',
        content,
        true,
        filterConfig,
      );

      expect(tab).toEqual({
        id: 'full-tab',
        label: 'Full Tab',
        content: 'Full Content',
        disabled: true,
        filterConfig: {
          pageName: 'FullPage',
          filtersList: ['filterA'],
          params: { param1: true },
        },
      });
    });

    it('should handle filterConfig without optional fields', () => {
      const filterConfig = {
        pageName: 'MinimalPage',
      };

      const tab = createTab(
        'minimal-tab',
        'Minimal',
        null,
        false,
        filterConfig,
      );

      expect(tab.filterConfig).toEqual({ pageName: 'MinimalPage' });
    });
  });
});
