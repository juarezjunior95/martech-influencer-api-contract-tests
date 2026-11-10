/**
 * Stress Scenario - 600 VUs (beyond nominal)
 * 10% margins: 60s ramp-up → 900s hold (15m) → 60s ramp-down
 * Goal: identify breaking points and degradation under sustained pressure
 */
export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '60s', target: 600 },
        { duration: '900s', target: 600 },
        { duration: '60s', target: 0 }
      ]
    }
  }
};


