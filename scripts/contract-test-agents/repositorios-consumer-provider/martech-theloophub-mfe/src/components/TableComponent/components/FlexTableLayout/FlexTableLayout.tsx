import React from 'react';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components';
import { StyledTooltip } from 'shared/Styles';

import {
  FlexBodyCell,
  FlexBodyCellGroup,
  FlexBodyCellWrapper,
  FlexHeaderCell,
  FlexHeaderCellWrapper,
  FlexHeaderLabelSpacer,
  FlexHeaderTitle,
  FlexRowGroup,
  FlexRowGroupContent,
  FlexRowGroupHorizontalLabel,
  FlexRowGroupLabel,
  FlexRowGroupWithHorizontalLabel,
  FlexRowGroupWithLabel,
  FlexSubColumn,
  FlexSubColumnsRow,
  FlexTable,
  FlexTableBody,
  FlexTableHeader,
  FlexTableRow,
  StyledSortButton,
} from '../../styles';
import { TableCellType, TableHeaderType } from '../../types';
import { SortIcon } from '../Icons';
import {
  FlexTableLayoutProps,
  type FlexTableRowCell,
  type FlexTableRowData,
  type HighlightedItemKey,
  type RenderBodyCellArgs,
  type RowGroupValue,
} from './FlexTableLayout.types';

export const SUB_COLUMN_WIDTH = {
  PRIMARY: '69%',
  SECONDARY: '31%',
} as const;

const formatAxisWidth = (width?: number | string): string | undefined => {
  if (width === undefined) return undefined;
  return typeof width === 'number' ? `${width}px` : width;
};

const normalizeHighlightCompareKey = (key: unknown): string => {
  if (typeof key === 'string') {
    return key.replace(/\s+/g, '');
  }
  if (
    typeof key === 'number' ||
    typeof key === 'boolean' ||
    typeof key === 'bigint'
  ) {
    return String(key).replace(/\s+/g, '');
  }
  return '';
};

const isRowHighlightedByItems = (
  row: FlexTableRowData,
  highlightedItems?: HighlightedItemKey[],
  highlightField?: string,
): boolean => {
  if (!highlightedItems || !highlightField) return false;
  const fieldValue = row[highlightField];
  const value =
    typeof fieldValue === 'object' && fieldValue !== null
      ? (fieldValue as { value?: string | number }).value
      : fieldValue;
  if (value === undefined) return false;
  const normalizedRow = normalizeHighlightCompareKey(value);
  if (!normalizedRow) return false;
  return highlightedItems.some(
    (item) => normalizeHighlightCompareKey(item) === normalizedRow,
  );
};

interface HeaderTooltipProps {
  readonly content?: string;
}

function HeaderTooltip({
  content,
}: HeaderTooltipProps): React.ReactElement | null {
  if (!content) return null;
  return (
    <CustomTooltip
      content={<StyledTooltip size="small">{content}</StyledTooltip>}
    >
      <Icon size="small" icon={Info} />
    </CustomTooltip>
  );
}

export const FlexTableLayout: React.FC<FlexTableLayoutProps> = ({
  header,
  allRows,
  showAxis = false,
  axisClickable = false,
  axisWidth,
  hideEmptyAxisHeader = false,
  rowGroupLabel,
  hasSecondaryColumns = false,
  highlightedItems,
  highlightField,
  highlightStyle,
  disableHighlightHover = false,
  groupBorder = false,
  columnBorder = false,
  headerColumnGap = false,
  headerGap = false,
  zebraStriping = true,
  rowHover = false,
  rowBorder = true,
  columnHover = false,
  cellHover = false,
  hoverRowColumn = false,
  allowEmptyCellClick = false,
  subHeaderFullCellTooltip = false,
  sortState,
  hoveredColumnId,
  setHoveredColumnId,
  dataTestId,
  onCellClick,
  onRowClick,
  hasPagination = false,
  handleSortClick,
  getSortDirection,
  handleCellClick,
  handleRowClick,
  renderCell,
}) => {
  const groupedRows = React.useMemo(() => {
    const groups: {
      groupValue: RowGroupValue;
      rows: typeof allRows;
    }[] = [];
    let currentGroup: typeof allRows = [];
    let currentGroupValue: RowGroupValue = undefined;

    allRows.forEach((flatRow, idx) => {
      const rowGroupRaw = flatRow.row['rowGroup'];
      const rowGroupValue =
        typeof rowGroupRaw === 'string' || typeof rowGroupRaw === 'number'
          ? rowGroupRaw
          : (rowGroupRaw as { value?: string | number } | undefined)?.value;

      if (idx === 0) {
        currentGroupValue = rowGroupValue;
        currentGroup = [flatRow];
      } else if (rowGroupValue === currentGroupValue) {
        currentGroup.push(flatRow);
      } else {
        groups.push({ groupValue: currentGroupValue, rows: currentGroup });
        currentGroupValue = rowGroupValue;
        currentGroup = [flatRow];
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ groupValue: currentGroupValue, rows: currentGroup });
    }

    return groups;
  }, [allRows]);

  const hasRowGroupLabelData = React.useMemo(() => {
    return groupedRows.some((group) => {
      const labelRaw = group.rows[0]?.row['rowGroupLabel'];
      const labelValue =
        typeof labelRaw === 'string' || typeof labelRaw === 'number'
          ? labelRaw
          : (labelRaw as { value?: string | number } | undefined)?.value;
      return labelValue !== undefined;
    });
  }, [groupedRows]);

  const showRowGroupLabelVertical =
    rowGroupLabel === 'vertical' && hasRowGroupLabelData;
  const showRowGroupLabelHorizontal =
    rowGroupLabel === 'horizontal' && hasRowGroupLabelData;

  const [hoveredRowColumnState, setHoveredRowColumnState] = React.useState<{
    rowIndex: number | null;
    parentColumnId: string | null;
  }>({ rowIndex: null, parentColumnId: null });

  const getRowColumnHoverHandlers = (
    rowIndex: number,
    parentColumnId: string,
  ) => {
    if (!hoverRowColumn) return {};
    return {
      onMouseEnter: () =>
        setHoveredRowColumnState({ rowIndex, parentColumnId }),
      onMouseLeave: () =>
        setHoveredRowColumnState({ rowIndex: null, parentColumnId: null }),
    };
  };

  const isCellInHoveredRowColumn = (
    rowIndex: number,
    parentColumnId: string,
  ) => {
    if (!hoverRowColumn) return false;
    return (
      hoveredRowColumnState.rowIndex === rowIndex &&
      hoveredRowColumnState.parentColumnId === parentColumnId
    );
  };

  const getColumnHoverHandlers = (colId: string | undefined) => {
    if (!columnHover) return {};
    return {
      onMouseEnter: () => setHoveredColumnId(colId || null),
      onMouseLeave: () => setHoveredColumnId(null),
    };
  };

  const getCellClickHandler = (
    cell: TableCellType,
    col: TableHeaderType,
    row: FlexTableRowData,
    globalIdx: number,
    gIdx: number,
  ) => {
    if (!onCellClick) return undefined;
    return () =>
      handleCellClick(cell, col.id || '', col.title, row, globalIdx, gIdx);
  };

  const buildCellTestId = (globalIdx: number, colId?: string) =>
    dataTestId ? `${dataTestId}-cell-${globalIdx}-${colId}` : undefined;

  const buildContentTestId = (globalIdx: number, colId?: string) =>
    dataTestId ? `${dataTestId}-cell-content-${globalIdx}-${colId}` : undefined;

  const isEmptyCellValue = (cell: TableCellType) => {
    const cellValue = cell.value;
    return cellValue === '-' || cellValue === '' || cellValue === undefined;
  };

  const isCellClickable = (cell: TableCellType, colGroupIdx: number) => {
    if (!onCellClick) return false;

    const isAxisColumn = showAxis && colGroupIdx === 0;
    if (isAxisColumn && !axisClickable) return false;

    const isEmptyCell = isEmptyCellValue(cell);
    if (isEmptyCell && !allowEmptyCellClick) return false;

    return true;
  };

  const shouldHaveCellHover = (cell: TableCellType, colGroupIdx: number) => {
    if (!isCellClickable(cell, colGroupIdx)) return false;
    return !isEmptyCellValue(cell);
  };

  const isColumnHovered = (colId?: string) =>
    columnHover && hoveredColumnId === colId;

  const normalizeCell = (cell: FlexTableRowCell): TableCellType => {
    if (typeof cell === 'object' && cell !== null) {
      return cell;
    }
    return { value: cell } as TableCellType;
  };

  const renderBodyCell = ({
    col,
    rawCell,
    row,
    globalIdx,
    colGroupIdx,
    gIdx,
    cellWidth,
    disableHover,
  }: RenderBodyCellArgs) => {
    const cell = normalizeCell(rawCell);
    const isClickable = isCellClickable(cell, colGroupIdx);
    const hasHoverStyle = shouldHaveCellHover(cell, colGroupIdx);
    const isEmptyCell = isEmptyCellValue(cell);
    return (
      <FlexBodyCell
        key={col.id}
        align={col.align}
        width={cellWidth}
        cellHover={disableHover ? false : cellHover && hasHoverStyle}
        isColumnHovered={isColumnHovered(col.id)}
        {...getColumnHoverHandlers(col.id)}
        onClick={getCellClickHandler(cell, col, row, globalIdx, gIdx)}
        style={isClickable && !disableHover ? { cursor: 'pointer' } : undefined}
        data-testid={buildCellTestId(globalIdx, col.id)}
        data-empty={isEmptyCell ? 'true' : undefined}
      >
        {renderCell(cell, col, {
          testId: buildContentTestId(globalIdx, col.id),
          colIndex: colGroupIdx,
          rowIndex: globalIdx,
          rowData: row as Record<string, TableCellType>,
          groupIndex: gIdx,
        })}
      </FlexBodyCell>
    );
  };

  const renderColumnGroupCells = (
    colGroup: TableHeaderType,
    row: FlexTableRowData,
    globalIdx: number,
    colGroupIdx: number,
    gIdx: number,
    disableHover?: boolean,
  ) => {
    if (!colGroup.children) return null;
    return colGroup.children.map((col, colIdx) => {
      const cell = row[col.id || ''] || { value: '-' };
      const cellWidth = getSubColumnWidth(colIdx, colGroup);
      return renderBodyCell({
        col,
        rawCell: cell,
        row,
        globalIdx,
        colGroupIdx,
        gIdx,
        cellWidth,
        disableHover,
      });
    });
  };

  const renderColumnGroup = (
    colGroup: TableHeaderType,
    row: FlexTableRowData,
    globalIdx: number,
    colGroupIdx: number,
    gIdx: number,
    disableHover?: boolean,
  ) => {
    const hasChildren = colGroup.children && colGroup.children.length > 0;
    const isAxisCol = showAxis && colGroupIdx === 0;
    const isLastCol = colGroupIdx === header.length - 1;
    const parentColumnId = colGroup.id || `col-${colGroupIdx}`;
    const isHoveredGroup = disableHover
      ? false
      : isCellInHoveredRowColumn(globalIdx, parentColumnId);
    const rowColumnHoverHandlers = disableHover
      ? {}
      : getRowColumnHoverHandlers(globalIdx, parentColumnId);

    const groupContent = hasChildren ? (
      <FlexBodyCellGroup
        isAxisColumn={isAxisCol}
        hasColumnGap={headerColumnGap}
        showColumnBorder={columnBorder}
        showInnerBorder={headerColumnGap}
        isHoveredGroup={isHoveredGroup}
        {...rowColumnHoverHandlers}
      >
        {renderColumnGroupCells(
          colGroup,
          row,
          globalIdx,
          colGroupIdx,
          gIdx,
          disableHover,
        )}
      </FlexBodyCellGroup>
    ) : (
      <FlexBodyCellGroup
        isAxisColumn={isAxisCol}
        hasColumnGap={headerColumnGap}
        isHoveredGroup={isHoveredGroup}
        {...rowColumnHoverHandlers}
      >
        {renderBodyCell({
          col: colGroup,
          rawCell: row[colGroup.id || ''] || { value: '-' },
          row,
          globalIdx,
          colGroupIdx,
          gIdx,
          disableHover,
        })}
      </FlexBodyCellGroup>
    );

    return (
      <FlexBodyCellWrapper
        key={colGroup.id}
        isAxisColumn={isAxisCol}
        axisWidth={isAxisCol ? formatAxisWidth(axisWidth) : undefined}
        showGroupBorder={groupBorder}
        isLast={isLastCol}
      >
        {groupContent}
      </FlexBodyCellWrapper>
    );
  };

  const getSubColumnWidth = (
    subIdx: number,
    parentCol: TableHeaderType,
  ): string | undefined => {
    const explicitWidth = parentCol.children?.[subIdx]?.width;
    if (explicitWidth !== undefined) {
      return typeof explicitWidth === 'number'
        ? `${explicitWidth}px`
        : explicitWidth;
    }
    if (!hasSecondaryColumns) return undefined;
    const childCount = parentCol.children?.length || 0;
    if (childCount !== 2) return undefined;
    return subIdx === 0 ? SUB_COLUMN_WIDTH.PRIMARY : SUB_COLUMN_WIDTH.SECONDARY;
  };

  const renderSubColumn = (
    subCol: TableHeaderType,
    subIdx: number,
    parentCol: TableHeaderType,
  ) => {
    const sortButton = subCol.sortable ? (
      <StyledSortButton
        onClick={() => handleSortClick(subCol.id || '')}
        direction={getSortDirection(subCol.id || '')}
        data-testid={
          dataTestId ? `${dataTestId}-sort-${subCol.id || subIdx}` : undefined
        }
      >
        <SortIcon direction={getSortDirection(subCol.id || '')} />
      </StyledSortButton>
    ) : null;

    const showIconOnlyTooltip =
      Boolean(subCol.tooltipContent) && !subHeaderFullCellTooltip;

    const subColumnInner = (
      <>
        {subCol.title}
        {showIconOnlyTooltip ? (
          <HeaderTooltip content={subCol.tooltipContent} />
        ) : null}
        {sortButton}
      </>
    );

    const subColumnContent =
      subHeaderFullCellTooltip && subCol.tooltipContent ? (
        <CustomTooltip
          content={
            <StyledTooltip size="small">{subCol.tooltipContent}</StyledTooltip>
          }
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              gap: '4px',
            }}
          >
            {subColumnInner}
          </span>
        </CustomTooltip>
      ) : (
        subColumnInner
      );

    return (
      <FlexSubColumn
        key={subCol.id}
        isLast={subIdx === (parentCol.children?.length || 0) - 1}
        showBorder={columnBorder}
        showInnerBorder={headerColumnGap}
        width={getSubColumnWidth(subIdx, parentCol)}
      >
        {subColumnContent}
      </FlexSubColumn>
    );
  };

  const renderHeaderCell = (col: TableHeaderType, colIdx: number) => {
    const hasChildren = col.children && col.children.length > 0;
    const isAxisCol = showAxis && colIdx === 0;
    const isFirst = colIdx === 0;
    const isLast = colIdx === header.length - 1;
    const shouldHideAxisContent =
      isAxisCol && hideEmptyAxisHeader && !col.title;

    return (
      <FlexHeaderCellWrapper
        key={col.id}
        isAxisColumn={isAxisCol}
        axisWidth={isAxisCol ? formatAxisWidth(axisWidth) : undefined}
        showGroupBorder={groupBorder}
        isLast={isLast}
        hasColumnGap={headerColumnGap}
      >
        {!shouldHideAxisContent && (
          <FlexHeaderCell
            isAxisColumn={isAxisCol}
            isFirst={isFirst}
            isLast={isLast}
            hasColumnGap={headerColumnGap}
            headerGap={headerGap}
            data-testid={
              dataTestId ? `${dataTestId}-header-cell-${colIdx}` : undefined
            }
          >
            {hasChildren ? (
              <>
                <FlexHeaderTitle hasSubColumns>
                  {col.title}
                  <HeaderTooltip content={col.tooltipContent} />
                </FlexHeaderTitle>
                <FlexSubColumnsRow>
                  {col.children?.map((subCol, subIdx) =>
                    renderSubColumn(subCol, subIdx, col),
                  )}
                </FlexSubColumnsRow>
              </>
            ) : (
              <FlexHeaderTitle>
                {col.title}
                <HeaderTooltip content={col.tooltipContent} />
                {col.sortable && (
                  <StyledSortButton
                    onClick={() => handleSortClick(col.id || '')}
                    direction={getSortDirection(col.id || '')}
                    data-testid={
                      dataTestId
                        ? `${dataTestId}-sort-${col.id || colIdx}`
                        : undefined
                    }
                  >
                    <SortIcon direction={getSortDirection(col.id || '')} />
                  </StyledSortButton>
                )}
              </FlexHeaderTitle>
            )}
          </FlexHeaderCell>
        )}
      </FlexHeaderCellWrapper>
    );
  };

  return (
    <FlexTable data-testid={dataTestId ? `${dataTestId}-table` : undefined}>
      <FlexTableHeader
        headerGap={headerGap}
        headerColumnGap={headerColumnGap}
        data-testid={dataTestId ? `${dataTestId}-header` : undefined}
      >
        {(showRowGroupLabelVertical || showRowGroupLabelHorizontal) && (
          <FlexHeaderLabelSpacer />
        )}
        {header.map((col, colIdx) => renderHeaderCell(col, colIdx))}
      </FlexTableHeader>

      <FlexTableBody
        data-testid={dataTestId ? `${dataTestId}-body` : undefined}
      >
        {groupedRows.map((rowGroup, rowGroupIdx) => {
          const isLastGroup = rowGroupIdx === groupedRows.length - 1;
          const firstRowHighlightRaw = rowGroup.rows[0]?.row['highlight'];
          const hasFirstRowHighlight =
            firstRowHighlightRaw === true ||
            (typeof firstRowHighlightRaw === 'object' &&
              firstRowHighlightRaw !== null &&
              ((firstRowHighlightRaw as { value?: unknown }).value === 1 ||
                (firstRowHighlightRaw as { value?: unknown }).value ===
                  'true'));
          const rowGroupLabelRaw = rowGroup.rows[0]?.row['rowGroupLabel'];
          const rowGroupLabelValue =
            typeof rowGroupLabelRaw === 'string' ||
            typeof rowGroupLabelRaw === 'number'
              ? rowGroupLabelRaw
              : (rowGroupLabelRaw as { value?: string | number } | undefined)
                  ?.value;

          const rowsContent = rowGroup.rows.map(
            ({ row, groupIndex: gIdx }, rowIdxInGroup) => {
              const globalIdx = allRows.indexOf(rowGroup.rows[rowIdxInGroup]);
              const isLastInGroup = rowIdxInGroup === rowGroup.rows.length - 1;
              const highlightRaw = row['highlight'];
              const isHighlightedByProp =
                highlightRaw === true ||
                (typeof highlightRaw === 'object' &&
                  highlightRaw !== null &&
                  ((highlightRaw as { value?: unknown }).value === 1 ||
                    (highlightRaw as { value?: unknown }).value === 'true'));

              const isHighlightedByItems = isRowHighlightedByItems(
                row,
                highlightedItems,
                highlightField,
              );

              const isHighlighted = isHighlightedByProp || isHighlightedByItems;

              const isZebra =
                zebraStriping &&
                (hasFirstRowHighlight
                  ? rowIdxInGroup > 0 && (rowIdxInGroup - 1) % 2 === 1
                  : rowIdxInGroup % 2 === 1);

              const shouldDisableHover = disableHighlightHover && isHighlighted;

              return (
                <FlexTableRow
                  key={`row-${globalIdx}-${gIdx}`}
                  isZebra={isZebra}
                  rowHover={
                    shouldDisableHover ? false : rowHover || !!onRowClick
                  }
                  hasColumnGap={headerColumnGap}
                  isLastInGroup={isLastInGroup}
                  isHighlighted={isHighlighted}
                  highlightStyle={highlightStyle}
                  rowBorder={rowBorder}
                  onClick={
                    onRowClick
                      ? () => handleRowClick(row, globalIdx, gIdx)
                      : undefined
                  }
                  style={
                    onRowClick && !shouldDisableHover
                      ? { cursor: 'pointer' }
                      : undefined
                  }
                  data-testid={
                    dataTestId ? `${dataTestId}-row-${globalIdx}` : undefined
                  }
                >
                  {header.map((colGroup, colGroupIdx) =>
                    renderColumnGroup(
                      colGroup,
                      row,
                      globalIdx,
                      colGroupIdx,
                      gIdx,
                      shouldDisableHover,
                    ),
                  )}
                </FlexTableRow>
              );
            },
          );

          const groupKey = `group-${rowGroup.groupValue ?? rowGroupIdx}`;

          if (showRowGroupLabelVertical) {
            return (
              <FlexRowGroupWithLabel
                key={groupKey}
                hasPagination={hasPagination}
                isLastGroup={isLastGroup}
              >
                <FlexRowGroupLabel>
                  {rowGroupLabelValue || ''}
                </FlexRowGroupLabel>
                <FlexRowGroupContent>{rowsContent}</FlexRowGroupContent>
              </FlexRowGroupWithLabel>
            );
          }

          if (showRowGroupLabelHorizontal) {
            return (
              <FlexRowGroupWithHorizontalLabel
                key={groupKey}
                hasPagination={hasPagination}
                isLastGroup={isLastGroup}
              >
                <FlexRowGroupHorizontalLabel>
                  {rowGroupLabelValue || ''}
                </FlexRowGroupHorizontalLabel>
                <FlexRowGroupContent>{rowsContent}</FlexRowGroupContent>
              </FlexRowGroupWithHorizontalLabel>
            );
          }

          return (
            <FlexRowGroup
              key={groupKey}
              hasPagination={hasPagination}
              isLastGroup={isLastGroup}
            >
              {rowsContent}
            </FlexRowGroup>
          );
        })}
      </FlexTableBody>
    </FlexTable>
  );
};
