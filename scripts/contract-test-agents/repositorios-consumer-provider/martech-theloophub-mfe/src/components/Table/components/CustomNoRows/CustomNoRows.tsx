import { NoDataYet } from 'components';

interface Props {
  title?: string;
  description?: string;
}

export const CustomNoRows: React.FC<Props> = ({ title, description }) => {
  return (
    <div>
      <NoDataYet color="primary" title={title} description={description} />
    </div>
  );
};
