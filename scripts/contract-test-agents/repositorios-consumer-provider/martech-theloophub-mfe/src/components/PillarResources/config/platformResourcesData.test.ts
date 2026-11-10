import { featureToggles } from 'config/featureToggle';

import {
  PLATFORM_RESOURCE_TYPE_NAMES,
  platformResourcesStatic,
  REPORT_VISIBILITY_TOGGLE_KEYS,
  RESOURCE_ID_TO_TOGGLE_KEY,
  toPlatformResourcesResponse,
} from './platformResourcesData';

describe('platformResourcesData', () => {
  it('should include the seven pillars', () => {
    const pillarNames = platformResourcesStatic.platformPillars.map(
      (p) => p.name,
    );
    expect(pillarNames).toEqual(
      expect.arrayContaining([
        'Category',
        'Consumer',
        'Portfolio & Brand',
        'Innovation',
        'Connections & Creativity',
        'Trade Execution',
        'Value Creation',
      ]),
    );
    expect(pillarNames).toHaveLength(7);
  });

  it('should include Power BI, Report and Learning Material as resource types', () => {
    const typeNames = platformResourcesStatic.platformResourceTypes.map(
      (t) => t.name,
    );
    expect(typeNames).toEqual(
      expect.arrayContaining([
        PLATFORM_RESOURCE_TYPE_NAMES.powerBI,
        PLATFORM_RESOURCE_TYPE_NAMES.report,
        PLATFORM_RESOURCE_TYPE_NAMES.learningMaterial,
      ]),
    );
  });

  it('should reference only toggle keys defined in featureToggle.ts', () => {
    const reportTypeId = platformResourcesStatic.platformResourceTypes.find(
      (t) => t.name === PLATFORM_RESOURCE_TYPE_NAMES.report,
    )?.id;
    expect(reportTypeId).toBeDefined();

    const knownToggleKeys = new Set<string>();
    for (const pillar of Object.values(featureToggles.pillar)) {
      if (
        typeof pillar === 'object' &&
        pillar &&
        'submenus' in pillar &&
        pillar.submenus
      ) {
        for (const submenu of Object.values(
          pillar.submenus as Record<string, { id?: string }>,
        )) {
          if (submenu?.id) knownToggleKeys.add(submenu.id);
        }
      }
    }

    for (const resource of platformResourcesStatic.platformResources) {
      if (!resource.reportVisibilityToggleKey) continue;
      expect(knownToggleKeys.has(resource.reportVisibilityToggleKey)).toBe(
        true,
      );
    }
  });

  it('should only assign toggles to Report-type resources', () => {
    const reportTypeId = platformResourcesStatic.platformResourceTypes.find(
      (t) => t.name === PLATFORM_RESOURCE_TYPE_NAMES.report,
    )?.id as number;

    for (const resource of platformResourcesStatic.platformResources) {
      if (resource.reportVisibilityToggleKey) {
        expect(resource.typesIds).toContain(reportTypeId);
      }
    }
  });

  it('should produce a deduplicated, stable list of toggle keys', () => {
    const uniqueKeys = new Set(REPORT_VISIBILITY_TOGGLE_KEYS);
    expect(uniqueKeys.size).toBe(REPORT_VISIBILITY_TOGGLE_KEYS.length);
    expect(REPORT_VISIBILITY_TOGGLE_KEYS.length).toBeGreaterThan(0);
  });

  it('should map resource ids to their toggle keys', () => {
    for (const resource of platformResourcesStatic.platformResources) {
      if (resource.reportVisibilityToggleKey) {
        expect(RESOURCE_ID_TO_TOGGLE_KEY[resource.id]).toBe(
          resource.reportVisibilityToggleKey,
        );
      } else {
        expect(RESOURCE_ID_TO_TOGGLE_KEY[resource.id]).toBeUndefined();
      }
    }
  });

  it('should strip reportVisibilityToggleKey when building the API-shaped response', () => {
    const response = toPlatformResourcesResponse(platformResourcesStatic);
    for (const resource of response.platformResources) {
      expect(resource).not.toHaveProperty('reportVisibilityToggleKey');
    }
  });

  describe('Product Overview download card', () => {
    const PRODUCT_OVERVIEW_ID = 146;

    const findProductOverview = () =>
      platformResourcesStatic.platformResources.find(
        (resource) => resource.id === PRODUCT_OVERVIEW_ID,
      );

    const findValueCreationPillar = () =>
      platformResourcesStatic.platformPillars.find(
        (pillar) => pillar.name === 'Value Creation',
      );

    it('should register the Product Overview card with the expected metadata', () => {
      const resource = findProductOverview();

      expect(resource).toBeDefined();
      expect(resource).toMatchObject({
        id: PRODUCT_OVERVIEW_ID,
        name: 'Product Overview',
        summary: 'Product functionality and usage guidance',
        comingSoon: false,
        subPillar: null,
        options: [],
        isUserFavorite: false,
      });
    });

    it('should expose mfeUrl pointing to the PDF and openInNewTab flag', () => {
      const resource = findProductOverview();
      expect(typeof resource?.mfeUrl).toBe('string');
      expect(resource?.openInNewTab).toBe(true);
      expect(resource?.downloadUrl).toBeUndefined();
      expect(resource?.downloadFileName).toBeUndefined();
    });

    it('should be tagged as Learning Material', () => {
      const resource = findProductOverview();
      const learningMaterialTypeId =
        platformResourcesStatic.platformResourceTypes.find(
          (type) => type.name === PLATFORM_RESOURCE_TYPE_NAMES.learningMaterial,
        )?.id;

      expect(learningMaterialTypeId).toBeDefined();
      expect(resource?.typesIds).toEqual([learningMaterialTypeId]);
    });

    it('should belong only to the Value Creation pillar', () => {
      const resource = findProductOverview();
      const valueCreationPillar = findValueCreationPillar();

      expect(valueCreationPillar).toBeDefined();
      expect(resource?.pillarsIds).toEqual([valueCreationPillar?.id]);

      const otherPillars = platformResourcesStatic.platformPillars.filter(
        (pillar) => pillar.id !== valueCreationPillar?.id,
      );
      for (const pillar of otherPillars) {
        expect(pillar.resourcesIds).not.toContain(PRODUCT_OVERVIEW_ID);
      }
    });

    it('should be referenced in the Value Creation pillar resourcesIds', () => {
      const valueCreationPillar = findValueCreationPillar();
      expect(valueCreationPillar?.resourcesIds).toContain(PRODUCT_OVERVIEW_ID);
    });

    it('should forward mfeUrl and openInNewTab through toPlatformResourcesResponse', () => {
      const response = toPlatformResourcesResponse(platformResourcesStatic);
      const resource = response.platformResources.find(
        (r) => r.id === PRODUCT_OVERVIEW_ID,
      );
      expect(resource).toBeDefined();
      expect(typeof resource?.mfeUrl).toBe('string');
      expect(resource?.openInNewTab).toBe(true);
    });

    it('should not declare a reportVisibilityToggleKey (card is always visible)', () => {
      const resource = findProductOverview();
      expect(resource?.reportVisibilityToggleKey).toBeUndefined();
      expect(RESOURCE_ID_TO_TOGGLE_KEY[PRODUCT_OVERVIEW_ID]).toBeUndefined();
    });
  });

  describe('Commercial Results card', () => {
    const COMMERCIAL_RESULTS_ID = 161;

    const findCommercialResults = () =>
      platformResourcesStatic.platformResources.find(
        (resource) => resource.id === COMMERCIAL_RESULTS_ID,
      );

    const findValueCreationPillar = () =>
      platformResourcesStatic.platformPillars.find(
        (pillar) => pillar.name === 'Value Creation',
      );

    it('should register the Commercial Results card with the expected metadata', () => {
      const resource = findCommercialResults();

      expect(resource).toBeDefined();
      expect(resource).toMatchObject({
        id: COMMERCIAL_RESULTS_ID,
        name: 'Commercial Results',
        summary:
          'Source of truth for analyzing commercial performance and key drivers across multiple business dimensions.',
        mfeUrl: '/value-creation/commercial-results',
        comingSoon: false,
        subPillar: null,
        options: [],
        isUserFavorite: false,
      });
    });

    it('should be tagged as Report type', () => {
      const resource = findCommercialResults();
      const reportTypeId = platformResourcesStatic.platformResourceTypes.find(
        (type) => type.name === PLATFORM_RESOURCE_TYPE_NAMES.report,
      )?.id;

      expect(reportTypeId).toBeDefined();
      expect(resource?.typesIds).toEqual([reportTypeId]);
    });

    it('should belong only to the Value Creation pillar', () => {
      const resource = findCommercialResults();
      const valueCreationPillar = findValueCreationPillar();

      expect(valueCreationPillar).toBeDefined();
      expect(resource?.pillarsIds).toEqual([valueCreationPillar?.id]);

      const otherPillars = platformResourcesStatic.platformPillars.filter(
        (pillar) => pillar.id !== valueCreationPillar?.id,
      );
      for (const pillar of otherPillars) {
        expect(pillar.resourcesIds).not.toContain(COMMERCIAL_RESULTS_ID);
      }
    });

    it('should be referenced in the Value Creation pillar resourcesIds', () => {
      const valueCreationPillar = findValueCreationPillar();
      expect(valueCreationPillar?.resourcesIds).toContain(
        COMMERCIAL_RESULTS_ID,
      );
    });

    it('should use the commercialResults toggle as reportVisibilityToggleKey', () => {
      const resource = findCommercialResults();
      const expectedToggleKey =
        featureToggles.pillar.valueCreation.submenus.commercialResults.id;

      expect(resource?.reportVisibilityToggleKey).toBe(expectedToggleKey);
      expect(RESOURCE_ID_TO_TOGGLE_KEY[COMMERCIAL_RESULTS_ID]).toBe(
        expectedToggleKey,
      );
    });
  });
});
