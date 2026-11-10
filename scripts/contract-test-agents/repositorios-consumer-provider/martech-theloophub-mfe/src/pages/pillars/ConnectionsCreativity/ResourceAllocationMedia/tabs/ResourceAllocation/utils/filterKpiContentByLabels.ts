import { KpiContent } from '../types';

export const filterKpiContentByLabels = (
  content: KpiContent,
  selectedLabels: string[] | null,
): KpiContent => {
  if (selectedLabels === null) {
    return content;
  }

  if (selectedLabels.length === 0) {
    return {
      labels: [],
      datasets: [],
      total_allocation: { ...content.total_allocation, value: [] },
      caption_country_flag: {},
    };
  }

  const labelIndexMap = new Map(
    content.labels.map((label, idx) => [label, idx]),
  );

  const matchingIndices = selectedLabels.reduce<number[]>((acc, label) => {
    const idx = labelIndexMap.get(label);
    if (idx !== undefined) acc.push(idx);
    return acc;
  }, []);

  const filteredLabels = matchingIndices.map((i) => content.labels[i]);

  const filteredDatasets = matchingIndices.map((i) => content.datasets[i]);

  const filteredTotalAllocation = {
    ...content.total_allocation,
    value: matchingIndices.map((i) => content.total_allocation.value[i]),
  };

  const filteredCaptionCountryFlag = Object.fromEntries(
    filteredLabels.map((label) => [label, content.caption_country_flag[label]]),
  );

  return {
    labels: filteredLabels,
    datasets: filteredDatasets,
    total_allocation: filteredTotalAllocation,
    caption_country_flag: filteredCaptionCountryFlag,
  };
};
