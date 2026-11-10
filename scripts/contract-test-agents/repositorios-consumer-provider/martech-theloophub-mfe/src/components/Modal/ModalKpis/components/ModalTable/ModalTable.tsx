import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { modalGridOptions, modalKpiTableConfig } from './config';
import { StyledModalTableContainer } from './ModalTable.styles';

interface TableProps {
  data: TableDataType;
}

export const ModalTable = ({ data }: TableProps) => {
  return (
    <Table
      data={data}
      columnDefsConfig={modalKpiTableConfig}
      style={StyledModalTableContainer}
      rowHeight={40}
      gridOptions={modalGridOptions}
    />
  );
};
