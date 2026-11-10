export const isWeekDelimiter = (index: number) => {
  return (index - 3) % 4 === 0 && index >= 3 && index !== 51;
};
