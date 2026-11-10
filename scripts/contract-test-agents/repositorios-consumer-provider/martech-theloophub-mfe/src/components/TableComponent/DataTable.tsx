import React from 'react';

import {
  AxisCell,
  BarChartCell,
  CheckboxCell,
  HeaderGridCell,
  IconCell,
  ImageCell,
  IndexTagCell,
  NumberCell,
  TextCell,
} from './components/CellRenderers/index';
import { FlexTableLayout } from './components/FlexTableLayout';
import { TableFooter } from './components/TableFooter';
import { useSorting, useTableContext } from './hooks';
import {
  StyledFooterInfo,
  StyledFooterPagination,
  StyledTableFooterWrapper,
  StyledTableSection,
  StyledTableSectionBody,
  StyledTableSectionFooter,
  StyledTableSectionHeader,
  StyledTableSectionTitle,
} from './styles';
import {
  DataTableProps,
  RenderCellOptions,
  TableCellType,
  TableHeaderType,
} from './types';
import { getAllRows, getFlatHeaders, sortRows } from './utils';

export const DataTable: React.FC<DataTableProps> = ({
  data,
  zebraStriping = true,
  showAxis = false,
  axisClickable = false,
  axisWidth,
  hideEmptyAxisHeader = false,
  rowGroupLabel,
  hasSecondaryColumns = false,
  tagThresholds,
  highlightedItems,
  highlightField,
  highlightStyle,
  disableHighlightHover = false,
  onCheckboxChange,
  sortState,
  onSortChange,
  onCellClick,
  onRowClick,
  sectionTitle,
  sectionPosition = 'standalone',
  showSectionHeader = false,
  showSectionFooter = false,
  pagination,
  footer,
  footerInfo,
  headerGap,
  rowHover = false,
  rowBorder = true,
  columnHover = false,
  cellHover = false,
  hoverRowColumn = false,
  allowEmptyCellClick = false,
  headerColumnGap = false,
  groupBorder = false,
  columnBorder = false,
  headerOnlyColumnBorder = false,
  useCustomHeaderTooltip,
  subHeaderFullCellTooltip,
  dataTestId,
}) => {
  const [hoveredColumnId, setHoveredColumnId] = React.useState<string | null>(
    null,
  );

  const { header, rows } = data;

  const flatHeaders = React.useMemo(() => getFlatHeaders(header), [header]);

  const { buildCellContext, getRowLabelColumn } = useTableContext({
    header,
    flatHeaders,
  });

  const { handleSortClick, getSortDirection } = useSorting({
    sortState,
    onSortChange,
  });

  const rawRows = React.useMemo(() => getAllRows(rows), [rows]);

  const allRows = React.useMemo(
    () => sortRows(rawRows, sortState),
    [rawRows, sortState],
  );

  const handleCellClick = React.useCallback(
    (
      cell: TableCellType,
      columnId: string,
      columnTitle: string,
      rowData: Record<string, TableCellType>,
      rowIndex: number,
      groupIndex: number,
    ) => {
      if (onCellClick) {
        const context = buildCellContext(
          cell,
          columnId,
          columnTitle,
          rowData,
          rowIndex,
          groupIndex,
        );
        onCellClick({
          cell,
          columnId,
          columnTitle,
          rowData,
          rowIndex,
          groupIndex,
          context,
        });
      }
    },
    [onCellClick, buildCellContext],
  );

  const handleRowClick = React.useCallback(
    (
      rowData: Record<string, TableCellType>,
      rowIndex: number,
      groupIndex: number,
    ) => {
      if (onRowClick) {
        const rowLabelColumn = getRowLabelColumn();
        const firstCell = rowData[rowLabelColumn.id] || { value: null };
        const context = buildCellContext(
          firstCell,
          rowLabelColumn.id,
          rowLabelColumn.title,
          rowData,
          rowIndex,
          groupIndex,
        );
        onRowClick({
          rowData,
          rowIndex,
          groupIndex,
          context,
        });
      }
    },
    [onRowClick, getRowLabelColumn, buildCellContext],
  );

  const renderCell = React.useCallback(
    (
      cell: TableCellType,
      column: TableHeaderType,
      options?: RenderCellOptions,
    ) => {
      const { testId, colIndex, rowIndex, rowData, groupIndex, parentColor } =
        options ?? {};
      if (cell.contentType) {
        switch (cell.contentType) {
          case 'header':
            return (
              <HeaderGridCell cell={cell} column={column} dataTestId={testId} />
            );
          case 'primaryNumber':
          case 'secondaryNumber':
          case 'upNumber':
          case 'downNumber':
            return (
              <NumberCell cell={cell} column={column} dataTestId={testId} />
            );
          case 'circleImageText':
            return (
              <ImageCell cell={cell} column={column} dataTestId={testId} />
            );
          case 'icon':
            return <IconCell cell={cell} column={column} dataTestId={testId} />;
          case 'axis':
            return <AxisCell cell={cell} column={column} dataTestId={testId} />;
          case 'primaryText':
          case 'secondaryText':
            return <TextCell cell={cell} column={column} dataTestId={testId} />;
          default:
            return <TextCell cell={cell} column={column} dataTestId={testId} />;
        }
      }

      if (cell.checkbox !== undefined || cell.checkboxState) {
        const handleCheckboxChangeInternal = (checked: boolean) => {
          const context = buildCellContext(
            cell,
            column.id || '',
            column.title,
            rowData || {},
            rowIndex ?? 0,
            groupIndex ?? 0,
          );
          onCheckboxChange?.({
            rowIndex: rowIndex ?? 0,
            columnId: column.id || '',
            checked,
            cell,
            context,
          });
        };

        return (
          <CheckboxCell
            cell={cell}
            column={column}
            rowIndex={rowIndex}
            onCheckboxChange={handleCheckboxChangeInternal}
            dataTestId={testId}
          />
        );
      }

      if (cell.icon && !cell.img) {
        return <IconCell cell={cell} column={column} dataTestId={testId} />;
      }

      if (cell.secondaryValue !== undefined || cell.secondaryOnly) {
        return <NumberCell cell={cell} column={column} dataTestId={testId} />;
      }

      if (cell.img) {
        return <ImageCell cell={cell} column={column} dataTestId={testId} />;
      }

      if (cell.variationDirection) {
        return <NumberCell cell={cell} column={column} dataTestId={testId} />;
      }

      if (cell.cellType === 'tag') {
        return (
          <IndexTagCell
            cell={cell}
            column={column}
            dataTestId={testId}
            thresholds={cell.tagThresholds || tagThresholds}
          />
        );
      }

      if (cell.cellType === 'barChart') {
        return (
          <BarChartCell
            cell={cell}
            column={column}
            dataTestId={testId}
            barColor={parentColor || column.color}
            labelPosition={cell.barChartLabelPosition}
          />
        );
      }

      if (showAxis && colIndex === 0) {
        return <AxisCell cell={cell} column={column} dataTestId={testId} />;
      }

      return <TextCell cell={cell} column={column} dataTestId={testId} />;
    },
    [showAxis, buildCellContext, onCheckboxChange, tagThresholds],
  );

  const renderFooterInfo = () => {
    if (footerInfo) return footerInfo;
    if (pagination) {
      const { currentPage, itemsPerPage, totalItems } = pagination;
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      return `Showing ${start}-${end} of ${totalItems} items`;
    }
    return `${allRows.length} items`;
  };

  const SectionFooter = showSectionFooter ? (
    <StyledTableSectionFooter
      data-testid={dataTestId ? `${dataTestId}-section-footer` : undefined}
    >
      <StyledFooterInfo
        data-testid={dataTestId ? `${dataTestId}-footer-info` : undefined}
      >
        {renderFooterInfo()}
      </StyledFooterInfo>
      {pagination && (
        <StyledFooterPagination
          data-testid={
            dataTestId ? `${dataTestId}-footer-pagination` : undefined
          }
        >
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        </StyledFooterPagination>
      )}
    </StyledTableSectionFooter>
  ) : null;

  return (
    <StyledTableSection position={sectionPosition} data-testid={dataTestId}>
      {showSectionHeader && sectionTitle && (
        <StyledTableSectionHeader
          data-testid={dataTestId ? `${dataTestId}-section-header` : undefined}
        >
          <StyledTableSectionTitle>{sectionTitle}</StyledTableSectionTitle>
        </StyledTableSectionHeader>
      )}

      <StyledTableSectionBody
        data-testid={dataTestId ? `${dataTestId}-wrapper` : undefined}
      >
        <FlexTableLayout
          header={header}
          allRows={allRows}
          showAxis={showAxis}
          axisClickable={axisClickable}
          axisWidth={axisWidth}
          hideEmptyAxisHeader={hideEmptyAxisHeader}
          rowGroupLabel={rowGroupLabel}
          hasSecondaryColumns={hasSecondaryColumns}
          highlightedItems={highlightedItems}
          highlightField={highlightField}
          highlightStyle={highlightStyle}
          disableHighlightHover={disableHighlightHover}
          groupBorder={groupBorder}
          columnBorder={columnBorder}
          headerOnlyColumnBorder={headerOnlyColumnBorder}
          headerColumnGap={headerColumnGap}
          headerGap={headerGap}
          zebraStriping={zebraStriping}
          rowHover={rowHover}
          rowBorder={rowBorder}
          columnHover={columnHover}
          cellHover={cellHover}
          hoverRowColumn={hoverRowColumn}
          allowEmptyCellClick={allowEmptyCellClick}
          useCustomHeaderTooltip={useCustomHeaderTooltip}
          subHeaderFullCellTooltip={subHeaderFullCellTooltip}
          sortState={sortState}
          hoveredColumnId={hoveredColumnId}
          setHoveredColumnId={setHoveredColumnId}
          dataTestId={dataTestId}
          onCellClick={!!onCellClick}
          onRowClick={!!onRowClick}
          hasPagination={!!pagination || !!footer}
          handleSortClick={handleSortClick}
          getSortDirection={getSortDirection}
          handleCellClick={handleCellClick}
          handleRowClick={handleRowClick}
          renderCell={renderCell}
        />
      </StyledTableSectionBody>

      {SectionFooter}

      {footer && (
        <StyledTableFooterWrapper>
          <TableFooter
            {...footer}
            dataTestId={dataTestId ? `${dataTestId}-footer` : undefined}
          />
        </StyledTableFooterWrapper>
      )}
    </StyledTableSection>
  );
};
