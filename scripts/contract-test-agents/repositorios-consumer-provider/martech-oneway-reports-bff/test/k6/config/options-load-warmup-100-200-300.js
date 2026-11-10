/**
 * Warm-up Scenario B - 10 minutes with steps 100 → 200 → 300 VUs (Load)
 * 10% margins, hold ~3m at 200, and ~3m at 300
 * Assumptions: total users 2500, ~15% concurrent (~375)
 */
export const options = {
  scenarios: {
    warmup_100_200_300: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '60s', target: 100 },
        { duration: '120s', target: 100 },
        { duration: '60s', target: 200 },
        { duration: '180s', target: 200 },
        { duration: '60s', target: 300 },
        { duration: '180s', target: 300 },
        { duration: '60s', target: 0 }
      ]
    }
  }
};


