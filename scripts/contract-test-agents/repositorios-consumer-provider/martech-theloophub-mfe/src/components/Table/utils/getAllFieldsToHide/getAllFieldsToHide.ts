export const getAllFieldsToHide = (filter: any) => {
  const fields = new Set(
    filter?.fieldsToHide?.flatMap((fields) =>
      fields?.split(',').map((field) => field.trim()),
    ),
  );

  return Array.from(fields);
};
