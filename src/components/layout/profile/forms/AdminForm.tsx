import { Section, Grid, Input } from '../../../ui';

export default function AdminForm({ data, editing, onChange }: any) {
  return (
    <>
      <Section title="Basic Information" />
      <Grid>
        <Input id="name" label="Full Name" value={data.name || ''} disabled={!editing} onChange={v => onChange('name', v)} />
        <Input id="email" label="Email" value={data.email || ''} disabled={!editing} onChange={v => onChange('email', v)} />
      </Grid>

      <Section title="Admin Profile" />
      <Grid>
        <Input id="institution" label="Institution" value={data.institution || ''} disabled={!editing} onChange={v => onChange('institution', v)} />
      </Grid>
    </>
  );
}
