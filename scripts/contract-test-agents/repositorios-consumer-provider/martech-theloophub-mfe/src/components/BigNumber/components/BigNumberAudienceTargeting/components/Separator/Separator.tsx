import { SEPARATOR_COLOR } from '../../utils/constants';

interface SeparatorProps {
  dataTestId?: string;
}

export const Separator = ({ dataTestId }: SeparatorProps) => (
  <span
    data-testid={dataTestId ? `${dataTestId}-separator` : undefined}
    style={{ color: SEPARATOR_COLOR }}
  >
    {' '}
    /{' '}
  </span>
);
