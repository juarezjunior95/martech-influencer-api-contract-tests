export const truncateText = (text: string, maxLength = 20) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
