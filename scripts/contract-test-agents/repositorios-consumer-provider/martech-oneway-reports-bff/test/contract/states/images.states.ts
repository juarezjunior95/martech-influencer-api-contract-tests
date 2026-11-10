import { ImagesScenario } from "../fixtures/images.fixtures";

export interface ImagesStateDeps {
  setActiveScenario: (scenario: ImagesScenario) => void;
  tearDownScenario: () => Promise<Record<string, never>>;
  wireProxyMocks: () => void;
}

export function createImagesStateHandlers(deps: ImagesStateDeps) {
  const { setActiveScenario, tearDownScenario, wireProxyMocks } = deps;

  const setupScenario = async (scenario: ImagesScenario) => {
    await tearDownScenario();
    setActiveScenario(scenario);
    wireProxyMocks();
    return {};
  };

  return {
    'a brand image exists for "corona"': {
      setup: () => setupScenario("brand-corona"),
      teardown: tearDownScenario,
    },

    'a brand image exists for "michelob ultra"': {
      setup: () => setupScenario("brand-michelob"),
      teardown: tearDownScenario,
    },

    'no brand image exists for "unknown-brand-xyz"': {
      setup: () => setupScenario("brand-unknown"),
      teardown: tearDownScenario,
    },

    'a brand image exists for family "all"': {
      setup: () => setupScenario("brand-family-all"),
      teardown: tearDownScenario,
    },

    'a country alias "BRAZIL" resolves to "BR"': {
      setup: () => setupScenario("country-alias"),
      teardown: tearDownScenario,
    },

    'a brand alias "corona extra" resolves to "corona"': {
      setup: () => setupScenario("brand-alias"),
      teardown: tearDownScenario,
    },

    'a country image exists for "BR"': {
      setup: () => setupScenario("country-br"),
      teardown: tearDownScenario,
    },

    'a country image exists for "AR"': {
      setup: () => setupScenario("country-ar"),
      teardown: tearDownScenario,
    },

    'no country image exists for "XX"': {
      setup: () => setupScenario("country-unknown"),
      teardown: tearDownScenario,
    },
  };
}
