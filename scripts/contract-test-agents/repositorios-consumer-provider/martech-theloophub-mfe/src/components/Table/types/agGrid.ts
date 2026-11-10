import { FilterOption } from 'models/Filters';

export type Row = {
  [key: string]: any;
};

export interface AgGridData {
  rowData: Row[];
  columnDefs: any[];
  splits?: string[][];
  filterOptions?: FilterOption[];
}
