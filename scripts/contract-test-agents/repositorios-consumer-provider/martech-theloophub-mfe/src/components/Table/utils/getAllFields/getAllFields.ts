import { ColDef, ColGroupDef } from 'ag-grid-community';

export const getAllFields = (defs: (ColDef | ColGroupDef)[]) => {
  const fields = [];

  const getFields = (def) => {
    def.forEach((item) => {
      if (item.field) fields.push(item.field);

      if (item.children) {
        getFields(item.children);
      }
    });
  };

  getFields(defs);
  return fields;
};
