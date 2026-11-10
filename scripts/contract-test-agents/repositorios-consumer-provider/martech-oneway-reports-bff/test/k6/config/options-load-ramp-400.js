/**
 * Ramp Scenario - 10 minutes up to 400 VUs (Load)
 * 10% margins: 60s ramp-up → 480s hold → 60s ramp-down
 * Assumptions: total users 2500, ~15% concurrent (~375) → safety margin to 400 VUs
 */
export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '60s', target: 400 },
        { duration: '480s', target: 400 },
        { duration: '60s', target: 0 }
      ]
    }
  }
};


