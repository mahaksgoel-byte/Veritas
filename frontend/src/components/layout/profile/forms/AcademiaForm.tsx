import { Section, Grid, Input } from '../../../ui';

export default function AcademiaForm({ data, editing, onChange }: any) {
  return (
    <>
      <Section title="Basic Information" />
      <Grid>
        <Input id="name" label="Full Name" value={data.name || ''} disabled={!editing} onChange={v => onChange('name', v)} />
        <Input id="email" label="Email" value={data.email || ''} disabled={!editing} onChange={v => onChange('email', v)} />
      </Grid>

      <Section title="Academic Profile" />
      <Grid>
        <Input id="dept" label="Department" value={data.dept || ''} disabled={!editing} onChange={v => onChange('dept', v)} />
        <Input id="specialization" label="Specialization" value={data.specialization || ''} disabled={!editing} onChange={v => onChange('specialization', v)} />
        <Input id="highest_qualification" label="Highest Qualification" value={data.highest_qualification || ''} disabled={!editing} onChange={v => onChange('highest_qualification', v)} />
        <Input id="institution" label="Institution" value={data.institution || ''} disabled={!editing} onChange={v => onChange('institution', v)} />
      </Grid>
    </>
  );
}
