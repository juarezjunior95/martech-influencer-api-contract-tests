import { BrandPowerData } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';

export function applyCompetitorConfigs(
  content: BrandPowerData,
  currentYear: string,
) {
  if (!content) {
    return content;
  }

  let year = currentYear;
  year = year.slice(-2);

  Object.keys(content).forEach((key) => {
    const data = content[key];
    if (data) {
      data.datasets?.forEach((dataset, i) => {
        const newArr = [];
        dataset.data.forEach((_data, idx) => {
          if (String(data.labels[idx]).includes(year)) {
            newArr.push(
              i === 0 ? 'rgba(209, 163, 60, 1)' : 'rgba(123, 145, 157, 1)',
            );
          } else {
            newArr.push(
              i === 0 ? 'rgba(232, 209, 157, 1)' : 'rgba(160, 174, 183, 1)',
            );
          }
        });
        dataset.backgroundColor = newArr;
      });
      data.paddingTop = 20;
    }
  });

  return content;
}
