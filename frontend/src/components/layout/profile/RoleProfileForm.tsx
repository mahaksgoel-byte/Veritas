import { UserRole } from '../../../lib/profileService';
import AcademiaForm from './forms/AcademiaForm';
import ResearchForm from './forms/ResearchForm';

interface Props {
  role: UserRole;
  data: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
}

export const RoleProfileForm = ({
  role,
  data,
  editing,
  onChange,
}: Props) => {
  switch (role) {
    case 'academia':
      return <AcademiaForm {...{ data, editing, onChange }} />;
    case 'research':
      return <ResearchForm {...{ data, editing, onChange }} />;
    default:
      return null;
  }
};