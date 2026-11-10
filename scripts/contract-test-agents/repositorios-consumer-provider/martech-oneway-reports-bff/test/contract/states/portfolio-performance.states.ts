import { PactScenario } from "../fixtures/portfolio-performance.fixtures";

export interface PortfolioPerformanceStateDeps {
  setActiveScenario: (scenario: PactScenario) => void;
  tearDownScenario: () => Promise<void>;
  wireDataRepositoryMock: () => void;
}

export function createPortfolioPerformanceStateHandlers(
  deps: PortfolioPerformanceStateDeps,
) {
  const { setActiveScenario, tearDownScenario, wireDataRepositoryMock } = deps;

  const setupFull = async () => {
    await tearDownScenario();
    setActiveScenario("full");
    wireDataRepositoryMock();
    return {};
  };

  const teardown = async () => {
    await tearDownScenario();
    return {};
  };

  return {
    "portfolio performance data exists for zone ABI": {
      setup: setupFull,
      teardown,
    },

    "portfolio performance data exists for zone SAZ and country BRA": {
      setup: setupFull,
      teardown,
    },

    "portfolio performance data exists for period Month": {
      setup: setupFull,
      teardown,
    },

    /** O formatter retorna uma estrutura completamente vazia sem dados. */
    "no portfolio performance data exists for future period": {
      setup: async () => {
        await tearDownScenario();
        setActiveScenario("empty");
        wireDataRepositoryMock();
        return {};
      },
      teardown,
    },

    "portfolio performance data with valid brand images": {
      setup: async () => {
        await tearDownScenario();
        setActiveScenario("brand-images");
        wireDataRepositoryMock();
        return {};
      },
      teardown,
    },
  };
}
