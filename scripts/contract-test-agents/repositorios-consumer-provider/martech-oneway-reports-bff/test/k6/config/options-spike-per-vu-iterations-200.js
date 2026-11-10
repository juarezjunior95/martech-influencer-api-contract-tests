/**
 * Per-VU Iterations Scenario - 200 VUs (Spike)
 * Peak concurrency burst: each VU runs 1 iteration (max 5 minutes)
 */
export const options = {
  scenarios: {
    load_test: {
      executor: 'per-vu-iterations',
      vus: 200,
      iterations: 1,
      maxDuration: '5m'
    }
  }
};


