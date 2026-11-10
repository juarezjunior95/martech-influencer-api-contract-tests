import { Line } from './Divider.styles';

interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => (
  <Line className={className} />
);
