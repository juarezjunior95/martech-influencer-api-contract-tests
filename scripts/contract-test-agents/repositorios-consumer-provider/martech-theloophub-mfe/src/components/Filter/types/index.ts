import { Option } from 'models/Filters';

export interface FieldProps {
  dataTestId?: string;
  fieldKey: string;
  pageName: string;
  onValueChange: (fieldKey: string, option: Option) => void;
  getCurrentValue: (key: string) => string;
}
