import { UserRole } from '../../../lib/profileService';
import ResearchForm from './forms/ResearchForm';
import AdminForm from './forms/AdminForm';

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
    case 'mentor':
    case 'researcher':
    case 'research':
      return <ResearchForm {...{ data, editing, onChange }} />;
    case 'admin':
      return <AdminForm {...{ data, editing, onChange }} />;
    default:
      return null;
  }
};