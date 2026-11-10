import { CategoryOverviewInterface } from 'components/CategoryOverview/CategoryOverview';
import { useIsInExportPage } from 'hooks';

import {
  BalancedChoicesFooter,
  ContainerGridHolder,
  GridHolder,
  LabelHolder,
  ValueHolder,
  WapperGridHolder,
} from './GridHolder.styles';

interface GridHolderComponentProps {
  data: CategoryOverviewInterface;
  dataTestId?: string;
}

export const GridHolderComponent = ({
  data,
  dataTestId,
}: GridHolderComponentProps) => {
  const isExportPage = useIsInExportPage();
  const kpiHeaders = Array.isArray(data.kpi?.header) ? data.kpi.header : [];
  const kpiRows = Array.isArray(data.kpi?.rows) ? data.kpi.rows : [];

  return (
    <ContainerGridHolder data-testid={dataTestId}>
      <WapperGridHolder>
        <GridHolder
          style={{
            gridTemplateColumns: `repeat(${kpiHeaders.length || 1}, 1fr)`,
          }}
        >
          {kpiHeaders.map(({ id, title }) =>
            id === 'label' ? (
              <div key={id}></div>
            ) : (
              <LabelHolder
                key={id}
                style={{ color: '#1414148F' }}
                isExportPage={isExportPage}
              >
                {title}
              </LabelHolder>
            ),
          )}

          {kpiRows.map((row, rowIndex) =>
            kpiHeaders.map(({ id }) => {
              if (id === 'label') {
                return (
                  <LabelHolder key={`${rowIndex}-label-${row.label}`}>
                    {row.label}
                  </LabelHolder>
                );
              }

              const cell = row[id];
              if (!cell) return <div key={`${rowIndex}-${id}`}></div>;

              return (
                <ValueHolder
                  key={`${rowIndex}-${id}`}
                  direction={cell.direction}
                  isExportPage={isExportPage}
                >
                  {Number.isFinite(cell.value)
                    ? cell.value + cell.unitOfMeasure
                    : cell.value}
                </ValueHolder>
              );
            }),
          )}
        </GridHolder>
        <BalancedChoicesFooter>{data.footerInfo}</BalancedChoicesFooter>
      </WapperGridHolder>
    </ContainerGridHolder>
  );
};
