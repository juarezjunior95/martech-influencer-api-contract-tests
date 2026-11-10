import { type FC, useMemo, useState } from 'react';

import { Heading } from '@hexa-ui/components';

import {
  alignmentMock,
  audienceTargetingMock,
  categoryHealthMock,
  categoryHealthWithLabelGroupMock,
  CellClickEvent,
  cellTypesMock,
  CheckboxChangeEvent,
  DataTable,
  dividedColumnsMock,
  dividedHeaderMock,
  HighlightStyle,
  interactiveCellsMock,
  RowClickEvent,
  simpleAxisTableMock,
  simpleTableMock,
  simplifiedCategoryHealthMock,
  sixColumnGroupsMock,
  sortableTableMock,
  SortChangeEvent,
  SortState,
  useDataTablePagination,
  variationTableMock,
} from '../../../../../components/TableComponent';
import {
  Container,
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardLabel,
  InfoCardRow,
  InfoCardTitle,
  InfoCardValue,
  SectionGroup,
} from './DataTableExample.styles';

export interface DataTableExampleProps {
  dataTestId?: string;
}

export const DataTableExample: FC<DataTableExampleProps> = ({ dataTestId }) => {
  const [sortState, setSortState] = useState<SortState | undefined>(undefined);
  const [lastRowClick, setLastRowClick] = useState<RowClickEvent | null>(null);
  const [lastCellClick, setLastCellClick] = useState<CellClickEvent | null>(
    null,
  );
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    Map<string, CheckboxChangeEvent>
  >(new Map());
  const [checkboxStates, setCheckboxStates] = useState<
    Map<string, 'checked' | 'unchecked' | 'indeterminate'>
  >(new Map());
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);
  const [selectedBigNumber, setSelectedBigNumber] = useState<string | null>(
    null,
  );
  const [highlightStyle, setHighlightStyle] = useState<
    HighlightStyle | undefined
  >(undefined);

  const highlightStyles: {
    label: string;
    style: HighlightStyle | undefined;
  }[] = [
    { label: 'Default (blue bg)', style: undefined },
    {
      label: 'Yellow border',
      style: { borderLeft: '4px solid #EDCD20', backgroundColor: '#FFFEF0' },
    },
    {
      label: 'Green border',
      style: { borderLeft: '4px solid #22C55E', backgroundColor: '#F0FDF4' },
    },
    {
      label: 'Border only (no bg)',
      style: { borderLeft: '4px solid #3B82F6' },
    },
  ];

  const [hoverRowColumn, setHoverRowColumn] = useState(false);

  const handleBigNumberClick = (title: string, items: string[]) => {
    if (selectedBigNumber === title) {
      setSelectedBigNumber(null);
      setHighlightedItems([]);
    } else {
      setSelectedBigNumber(title);
      setHighlightedItems(items);
    }
  };

  const simplePagination = useDataTablePagination({
    totalPages: Math.ceil(50 / 10),
    totalItems: 50,
    itemsPerPage: 10,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  const withSelectorPagination = useDataTablePagination({
    totalPages: Math.ceil(100 / itemsPerPage),
    totalItems: 100,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  const handleSortChange = (event: SortChangeEvent) => {
    if (event.direction === 'none') {
      setSortState(undefined);
    } else {
      setSortState({
        columnId: event.columnId,
        direction: event.direction,
      });
    }
  };

  const handleCellClick = (event: CellClickEvent) => {
    setLastCellClick(event);
  };

  const handleRowClick = (event: RowClickEvent) => {
    setLastRowClick(event);
  };

  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    const groupIndex = event.context?.groupIndex ?? 0;
    const key = `${groupIndex}-${event.rowIndex}-${event.columnId}`;

    setSelectedCheckboxes((prev) => {
      const newMap = new Map(prev);
      if (event.checked) {
        newMap.set(key, event);
      } else {
        newMap.delete(key);
      }
      return newMap;
    });

    setCheckboxStates((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, event.checked ? 'checked' : 'unchecked');
      return newMap;
    });
  };

  const interactiveDataWithState = useMemo(() => {
    return {
      ...interactiveCellsMock,
      rows: interactiveCellsMock.rows.map((group, groupIdx) =>
        group.map((row, rowIdx) => {
          const newRow = { ...row };
          Object.keys(newRow).forEach((colId) => {
            const cell = newRow[colId];
            if (
              typeof cell === 'object' &&
              cell !== null &&
              'checkbox' in cell
            ) {
              const key = `${groupIdx}-${rowIdx}-${colId}`;
              const savedState = checkboxStates.get(key);
              if (savedState) {
                newRow[colId] = { ...cell, checkboxState: savedState };
              }
            }
          });
          return newRow;
        }),
      ),
    };
  }, [checkboxStates]);

  const getSelectedRows = () => {
    return Array.from(selectedCheckboxes.values());
  };

  return (
    <Container data-testid={dataTestId}>
      {/* Simple Axis Table */}
      <SectionGroup>
        <Heading>DataTable - Simple Axis (3 Columns, No Sub-columns)</Heading>
        <DataTable
          data={simpleAxisTableMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          dataTestId={
            dataTestId ? `${dataTestId}-simple-axis-table` : undefined
          }
        />
      </SectionGroup>

      {/* Cell Types Demo */}
      <SectionGroup>
        <Heading>All 9 Cell Types</Heading>
        <DataTable
          data={cellTypesMock}
          dataTestId={dataTestId ? `${dataTestId}-cell-types-table` : undefined}
          zebraStriping={false}
        />
      </SectionGroup>

      {/* Interactive Cells Demo */}
      <SectionGroup>
        <Heading>Interactive Cells (Checkbox, Icon, Double Value)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Click on checkboxes to see selected items.
        </p>
        {selectedCheckboxes.size > 0 && (
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>
                Selected Checkboxes ({selectedCheckboxes.size})
              </InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {getSelectedRows().map((item) => (
                <InfoCardRow
                  key={
                    item.context.cellId || `${item.rowIndex}-${item.columnId}`
                  }
                >
                  <InfoCardLabel>{item.context.columnLabel}</InfoCardLabel>
                  <InfoCardValue>
                    {String(item.context.cellValue)}
                  </InfoCardValue>
                </InfoCardRow>
              ))}
            </InfoCardContent>
          </InfoCard>
        )}
        <DataTable
          data={interactiveDataWithState}
          dataTestId={
            dataTestId ? `${dataTestId}-interactive-table` : undefined
          }
          zebraStriping={false}
          onCheckboxChange={handleCheckboxChange}
        />
      </SectionGroup>

      {/* Cell Click Demo */}
      <SectionGroup>
        <Heading>Cell Click Handler (onCellClick)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Click on any cell to see the returned data. Use{' '}
          <code>onCellClick</code> to capture clicks and use the data for
          navigation, modals, etc.
        </p>
        {lastCellClick && (
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>Cell Click Info</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <InfoCardRow>
                <InfoCardLabel>Column</InfoCardLabel>
                <InfoCardValue>
                  {lastCellClick.context.columnLabel}
                </InfoCardValue>
              </InfoCardRow>
              <InfoCardRow>
                <InfoCardLabel>Value</InfoCardLabel>
                <InfoCardValue>
                  {String(lastCellClick.context.cellValue)}
                </InfoCardValue>
              </InfoCardRow>
              <InfoCardRow>
                <InfoCardLabel>Row</InfoCardLabel>
                <InfoCardValue>
                  {String(lastCellClick.context.rowLabel)}
                </InfoCardValue>
              </InfoCardRow>
              <InfoCardRow>
                <InfoCardLabel>Row Index</InfoCardLabel>
                <InfoCardValue>{lastCellClick.rowIndex}</InfoCardValue>
              </InfoCardRow>
              {lastCellClick.context.cellId && (
                <InfoCardRow>
                  <InfoCardLabel>Cell ID</InfoCardLabel>
                  <InfoCardValue>{lastCellClick.context.cellId}</InfoCardValue>
                </InfoCardRow>
              )}
            </InfoCardContent>
          </InfoCard>
        )}
        <DataTable
          data={simpleTableMock}
          onCellClick={handleCellClick}
          cellHover
          dataTestId={dataTestId ? `${dataTestId}-cell-click-table` : undefined}
        />
      </SectionGroup>

      {/* Row Click Demo */}
      <SectionGroup>
        <Heading>Row Click Handler (onRowClick)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Click on any row to see the returned data. Use <code>onRowClick</code>{' '}
          to capture clicks on the entire row.
        </p>
        {lastRowClick && (
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>Row Click Info</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <InfoCardRow>
                <InfoCardLabel>Row Label</InfoCardLabel>
                <InfoCardValue>
                  {String(lastRowClick.context.rowLabel)}
                </InfoCardValue>
              </InfoCardRow>
              <InfoCardRow>
                <InfoCardLabel>Row Index</InfoCardLabel>
                <InfoCardValue>{lastRowClick.rowIndex}</InfoCardValue>
              </InfoCardRow>
              <InfoCardRow>
                <InfoCardLabel>Group</InfoCardLabel>
                <InfoCardValue>{lastRowClick.groupIndex}</InfoCardValue>
              </InfoCardRow>
              {lastRowClick.context.cellId && (
                <InfoCardRow>
                  <InfoCardLabel>Cell ID</InfoCardLabel>
                  <InfoCardValue>{lastRowClick.context.cellId}</InfoCardValue>
                </InfoCardRow>
              )}
              <InfoCardRow>
                <InfoCardLabel>Navigation</InfoCardLabel>
                <InfoCardValue
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                >
                  /details/{String(lastRowClick.context.rowLabel)}
                </InfoCardValue>
              </InfoCardRow>
            </InfoCardContent>
          </InfoCard>
        )}
        <DataTable
          data={simpleTableMock}
          onRowClick={handleRowClick}
          dataTestId={dataTestId ? `${dataTestId}-row-click-table` : undefined}
        />
      </SectionGroup>

      {/* Simple Table with Axis */}
      <SectionGroup>
        <Heading>DataTable - Simple (showAxis=true)</Heading>
        <DataTable
          data={simpleTableMock}
          showAxis={true}
          dataTestId={dataTestId ? `${dataTestId}-simple-table` : undefined}
        />
      </SectionGroup>

      {/* Variation Table */}
      <SectionGroup>
        <Heading>DataTable - With Variation (Countries)</Heading>
        <DataTable
          data={variationTableMock}
          dataTestId={dataTestId ? `${dataTestId}-variation-table` : undefined}
        />
      </SectionGroup>

      {/* Divided Header Table */}
      <SectionGroup>
        <Heading>
          DataTable - Divided Header (Sub-columns) with headerGap
        </Heading>
        <DataTable
          data={dividedHeaderMock}
          showAxis
          headerGap
          dataTestId={
            dataTestId ? `${dataTestId}-divided-header-table` : undefined
          }
        />
      </SectionGroup>

      {/* Sortable Table */}
      <SectionGroup>
        <Heading>DataTable - Sortable Columns</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Current sort:{' '}
          {sortState
            ? `${sortState.columnId} (${sortState.direction})`
            : 'none'}
        </p>
        <DataTable
          data={sortableTableMock}
          sortState={sortState}
          onSortChange={handleSortChange}
          rowHover
          dataTestId={dataTestId ? `${dataTestId}-sortable-table` : undefined}
        />
      </SectionGroup>

      {/* Row Hover Demo */}
      <SectionGroup>
        <Heading>DataTable - Row Hover</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Pass the <code>rowHover</code> prop to enable hover effect with
          gradient border on rows
        </p>
        <DataTable
          data={simpleTableMock}
          rowHover
          dataTestId={dataTestId ? `${dataTestId}-row-hover-table` : undefined}
        />
      </SectionGroup>

      {/* Cell Hover Demo */}
      <SectionGroup>
        <Heading>DataTable - Cell Hover</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Pass the <code>cellHover</code> prop to enable individual cell hover
          effect
        </p>
        <DataTable
          data={simpleTableMock}
          cellHover
          dataTestId={dataTestId ? `${dataTestId}-cell-hover-table` : undefined}
        />
      </SectionGroup>

      {/* Column Hover Demo */}
      <SectionGroup>
        <Heading>DataTable - Column Hover</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Pass the <code>columnHover</code> prop to highlight the entire column
          on hover
        </p>
        <DataTable
          data={simpleTableMock}
          columnHover
          dataTestId={
            dataTestId ? `${dataTestId}-column-hover-table` : undefined
          }
        />
      </SectionGroup>

      {/* Row Column Hover Demo */}
      <SectionGroup>
        <Heading>DataTable - Row Column Hover</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Pass the <code>hoverRowColumn</code> prop to highlight all cells in
          the same column group when hovering a row. Requires grouped columns.
        </p>
        <DataTable
          data={dividedColumnsMock}
          showAxis
          headerGap
          headerColumnGap
          hoverRowColumn
          dataTestId={
            dataTestId ? `${dataTestId}-row-column-hover-table` : undefined
          }
        />
      </SectionGroup>

      {/* Divided Columns Demo */}
      <SectionGroup>
        <Heading>DataTable - Divided Columns (3 Groups)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Table with grouped headers in 3 main columns, each with 2 sub-columns.
          Use <code>headerColumnGap</code> to add spacing between header groups
          and <code>columnBorder</code> to add separation borders between all
          columns (header and body).
        </p>
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          With headerColumnGap and columnBorder:
        </p>
        <DataTable
          data={dividedColumnsMock}
          showAxis
          headerGap
          headerColumnGap
          columnBorder
          columnHover
          cellHover
          dataTestId={
            dataTestId ? `${dataTestId}-divided-columns-table` : undefined
          }
        />
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          Without headerColumnGap:
        </p>
        <DataTable
          data={dividedColumnsMock}
          showAxis
          headerGap
          columnHover
          cellHover
          dataTestId={
            dataTestId
              ? `${dataTestId}-divided-columns-no-gap-table`
              : undefined
          }
        />
      </SectionGroup>

      {/* 6 Column Groups Demo */}
      <SectionGroup>
        <Heading>DataTable - 6 Column Groups (12 columns)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Table with 6 column groups, each with 2 sub-columns. Use{' '}
          <code>groupBorder</code> for borders between groups and{' '}
          <code>columnBorder</code> for borders within groups.
        </p>
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          Layout as designed (headerColumnGap + groupBorder):
        </p>
        <DataTable
          data={sixColumnGroupsMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          dataTestId={
            dataTestId ? `${dataTestId}-six-columns-design` : undefined
          }
        />
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          With groupBorder + columnBorder (all borders):
        </p>
        <DataTable
          data={sixColumnGroupsMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          columnBorder
          dataTestId={
            dataTestId ? `${dataTestId}-six-columns-all-borders` : undefined
          }
        />
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          Only groupBorder (borders between groups):
        </p>
        <DataTable
          data={sixColumnGroupsMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          dataTestId={
            dataTestId ? `${dataTestId}-six-columns-group-border` : undefined
          }
        />
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          Only columnBorder (borders within groups):
        </p>
        <DataTable
          data={sixColumnGroupsMock}
          showAxis
          headerGap
          headerColumnGap
          columnBorder
          dataTestId={
            dataTestId ? `${dataTestId}-six-columns-column-border` : undefined
          }
        />
        <p style={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
          No borders:
        </p>
        <DataTable
          data={sixColumnGroupsMock}
          showAxis
          headerGap
          headerColumnGap
          dataTestId={
            dataTestId ? `${dataTestId}-six-columns-no-border` : undefined
          }
        />
      </SectionGroup>

      {/* Alignment Demo */}
      <SectionGroup>
        <Heading>DataTable - Cell Alignment (Left, Center, Right)</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Alignment does NOT apply to Circle Image + Text
        </p>
        <DataTable
          data={alignmentMock}
          dataTestId={dataTestId ? `${dataTestId}-alignment-table` : undefined}
        />
      </SectionGroup>

      {/* Pagination Demo */}
      <SectionGroup>
        <Heading>DataTable - With Pagination</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Use the <code>useDataTablePagination</code> hook and pass the result
          to the DataTable&apos;s <code>footer</code> prop.
        </p>
        <DataTable
          data={simpleTableMock}
          footer={{
            ...simplePagination,
            totalItems: 50,
            itemsPerPage: 10,
            showQuantityIndicator: true,
          }}
          dataTestId={dataTestId ? `${dataTestId}-pagination-table` : undefined}
        />
      </SectionGroup>

      {/* Pagination with Items Per Page Selector */}
      <SectionGroup>
        <Heading>DataTable - Pagination with Items Per Page Selector</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Add <code>showItemsPerPage</code> to display the items per page
          selector.
        </p>
        <DataTable
          data={sortableTableMock}
          sortState={sortState}
          onSortChange={handleSortChange}
          footer={{
            ...withSelectorPagination,
            totalItems: 100,
            itemsPerPage: itemsPerPage,
            showQuantityIndicator: true,
            showItemsPerPage: true,
            itemsPerPageOptions: [10, 25, 50, 100],
            onItemsPerPageChange: setItemsPerPage,
          }}
          dataTestId={
            dataTestId ? `${dataTestId}-pagination-selector-table` : undefined
          }
        />
      </SectionGroup>

      {/* Category Health Layout */}
      <SectionGroup>
        <Heading>DataTable - Category Health Layout</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Complex layout with row groups (M3, M2), country flag images, colored
          variations, grouped headers, sticky first column, highlighted rows and
          zebra striping.
        </p>
        <DataTable
          data={categoryHealthMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          rowBorder={false}
          onCellClick={handleCellClick}
          cellHover
          dataTestId={
            dataTestId ? `${dataTestId}-category-health-table` : undefined
          }
        />
      </SectionGroup>

      {/* Category Health Layout with Label Group */}
      <SectionGroup>
        <Heading>DataTable - Category Health with Label Group</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Variation of the Category Health layout with group label support.
        </p>
        <DataTable
          data={categoryHealthWithLabelGroupMock}
          showAxis
          rowGroupLabel="horizontal"
          headerGap
          headerColumnGap
          groupBorder
          rowBorder={false}
          onCellClick={handleCellClick}
          cellHover
          dataTestId={
            dataTestId ? `${dataTestId}-category-health-label-table` : undefined
          }
        />
      </SectionGroup>

      {/* Simplified Category Health Layout */}
      <SectionGroup>
        <Heading>
          DataTable - Simplified Category Health (Optimized Mock)
        </Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Simplified mock format: simple cells as direct strings/numbers,
          rowGroup as string, highlight as boolean, without redundant
          contentType, imgName, imgShape or iconSize.
        </p>
        <DataTable
          data={simplifiedCategoryHealthMock}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          rowBorder={false}
          rowHover
          onCellClick={handleCellClick}
          cellHover
          dataTestId={
            dataTestId ? `${dataTestId}-simplified-category-table` : undefined
          }
        />
      </SectionGroup>

      {/* Audience Targeting Table */}
      <SectionGroup>
        <Heading>DataTable - Audience Targeting</Heading>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Data structure for Audience Targeting. Groups: Gender, Age, Income.
          Columns per portfolio: Beer, Core Co, Brahma, Amstel (Volume + Index).
          With <code>useCustomHeaderTooltip</code>, tooltips use{' '}
          <code>CustomTooltip</code> <code>content</code> aligned with{' '}
          <code>HeaderContent</code>: optional bullet from column or group{' '}
          <code>color</code>, plus <code>tooltipTitle</code> /{' '}
          <code>tooltipContent</code>.
        </p>
        <div
          style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}
        >
          <button
            type="button"
            onClick={() => handleBigNumberClick('Gender', ['Male', 'Female'])}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: selectedBigNumber === 'Gender' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
            }}
          >
            Gender
          </button>
          <button
            type="button"
            onClick={() =>
              handleBigNumberClick('Age', [
                'LDA-24',
                '25-34',
                '35-44',
                '45-54',
                '55+',
              ])
            }
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: selectedBigNumber === 'Age' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
            }}
          >
            Age
          </button>
          <button
            type="button"
            onClick={() =>
              handleBigNumberClick('Income', ['High', 'Medium', 'Low'])
            }
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: selectedBigNumber === 'Income' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
            }}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => handleBigNumberClick('Male Only', ['Male'])}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background:
                selectedBigNumber === 'Male Only' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
            }}
          >
            Male Only
          </button>
          <button
            type="button"
            onClick={() => handleBigNumberClick('Young', ['LDA-24', '25-34'])}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: selectedBigNumber === 'Young' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
            }}
          >
            Young (LDA-24, 25-34)
          </button>
          <button
            type="button"
            onClick={() =>
              handleBigNumberClick('Core Audience', [
                'Male',
                '25-34',
                '35-44',
                'Medium',
              ])
            }
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background:
                selectedBigNumber === 'Core Audience' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Core Audience (Male, 25-44, Medium)
          </button>
          <button
            type="button"
            onClick={() =>
              handleBigNumberClick('Halo Audience', ['Female', 'LDA-24', 'Low'])
            }
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background:
                selectedBigNumber === 'Halo Audience' ? '#EDCD20' : '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Halo Audience (Female, LDA-24, Low)
          </button>
        </div>
        <div
          style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}
        >
          <span style={{ alignSelf: 'center', fontWeight: 500 }}>
            Highlight:
          </span>
          {highlightStyles.map((hs) => (
            <button
              key={hs.label}
              type="button"
              onClick={() => setHighlightStyle(hs.style)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border:
                  highlightStyle === hs.style
                    ? '2px solid #333'
                    : '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {hs.label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 500 }}>Hover Row Column:</span>
          <button
            type="button"
            onClick={() => setHoverRowColumn(!hoverRowColumn)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: hoverRowColumn ? '2px solid #333' : '1px solid #ccc',
              background: hoverRowColumn ? '#E0F2FE' : '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {hoverRowColumn ? 'ON' : 'OFF'}
          </button>
          <span style={{ fontSize: 12, color: '#666' }}>
            (hover on all cells in the parent column of the row)
          </span>
        </div>
        <DataTable
          data={audienceTargetingMock}
          showAxis
          hideEmptyAxisHeader
          rowGroupLabel="vertical"
          hasSecondaryColumns
          useCustomHeaderTooltip
          highlightedItems={highlightedItems}
          highlightField="segment"
          highlightStyle={highlightStyle}
          hoverRowColumn={hoverRowColumn}
          headerGap
          headerColumnGap
          headerOnlyColumnBorder
          groupBorder
          rowBorder={false}
          dataTestId={
            dataTestId ? `${dataTestId}-audience-targeting-table` : undefined
          }
        />
      </SectionGroup>
    </Container>
  );
};
