export const handleExpandSection = (
  value: boolean,
  name: string,
  setSearchParams: (params: URLSearchParams) => void,
  searchParams: URLSearchParams,
) => {
  const newParams = new URLSearchParams(searchParams);

  if (value) {
    newParams.set('section', name);
  } else {
    newParams.delete('section');
  }

  setSearchParams(newParams);
};
