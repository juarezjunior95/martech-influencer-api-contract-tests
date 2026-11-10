/**
 * Warm-up Scenario A - 5 minutes total with 10% start/end margins (Load)
 * 1 → 100 VUs (30s), hold 240s, ramp-down 30s
 * Assumptions: total users 2500, ~15% concurrent (~375) → warm-up step at 100 VUs
 */
export const options = {
  scenarios: {
    warmup_100: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 100 },
        { duration: '240s', target: 100 },
        { duration: '30s', target: 0 }
      ]
    }
  }
};


