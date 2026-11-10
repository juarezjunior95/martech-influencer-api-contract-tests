import { DataStateHandler } from 'components';
import { ContentHeader, RowActionTable } from 'pages/components';
import { StyledCardContainer } from 'shared/Styles';

type TableCardProps = {
  title: string;
  subtitle?: string;
  tooltip?: React.ReactNode;
  rightContent?: React.ReactNode;
  loading: boolean;
  error?: any;
  data: any;
  columnDefsConfig: any;
  rowSelection?: boolean;
  onChangeRows?: (rowId: string) => void;
  byCompetitor?: boolean;
  setClearSelectionHandler?: (fn: () => void) => void;
  setRowSelectionHandler?: (fn: (id: string) => void) => void;
  fixedHeight?: string;
  noRowsMessage?: any;
  keyProp?: string;
  dataTestId?: string;
};

export const TableCard = ({
  title,
  subtitle,
  tooltip,
  rightContent,
  loading,
  error,
  data,
  columnDefsConfig,
  rowSelection,
  onChangeRows,
  byCompetitor,
  setClearSelectionHandler,
  setRowSelectionHandler,
  fixedHeight,
  noRowsMessage,
  keyProp,
  dataTestId,
}: TableCardProps) => (
  <StyledCardContainer data-testid={dataTestId}>
    <ContentHeader
      title={title}
      subtitle={subtitle}
      tooltip={tooltip}
      rightContent={rightContent}
    />
    <DataStateHandler
      loading={loading}
      error={error}
      empty={data?.length === 0}
      skeletonProps={{
        length: 1,
        width: '100%',
        height: fixedHeight ?? '313px',
        borderRadius: 'none',
      }}
    >
      <RowActionTable
        key={keyProp}
        data={data}
        rowSelection={rowSelection}
        columnDefsConfig={columnDefsConfig}
        onChangeRows={onChangeRows}
        byCompetitor={byCompetitor}
        setClearSelectionHandler={setClearSelectionHandler}
        setRowSelectionHandler={setRowSelectionHandler}
        fixedHeight={fixedHeight}
        noRowsMessage={noRowsMessage}
      />
    </DataStateHandler>
  </StyledCardContainer>
);
