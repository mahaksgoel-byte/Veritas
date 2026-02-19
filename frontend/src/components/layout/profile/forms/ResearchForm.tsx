import { Section, Grid, Input, Textarea } from '../../../ui';

export default function ResearchForm({ data, editing, onChange }: any) {
  return (
    <>
      <Section title="Basic Information" />
      <Grid>
        <Input id="name" label="Full Name" value={data.name || ''} disabled={!editing} onChange={v => onChange('name', v)} />
        <Input id="email" label="Email" value={data.email || ''} disabled={!editing} onChange={v => onChange('email', v)} />
      </Grid>

      <Section title="Research Identity" />
      <Grid>
        <Input id="position" label="Research Position" value={data.position || ''} disabled={!editing} onChange={v => onChange('position', v)} />
        <Input id="dept" label="Department" value={data.dept || ''} disabled={!editing} onChange={v => onChange('dept', v)} />
        <Input id="orcid" label="ORCID ID" value={data.orcid || ''} disabled={!editing} onChange={v => onChange('orcid', v)} />
        <Input id="institution" label="Primary Institution" value={data.institution || ''} disabled={!editing} onChange={v => onChange('institution', v)} />
      </Grid>

      <Section title="Research Profiles" />
      <Grid>
        <Input id="gs_url" label="Google Scholar URL" value={data.gs_url || ''} disabled={!editing} onChange={v => onChange('gs_url', v)} />
        <Input id="rg_url" label="ResearchGate URL" value={data.rg_url || ''} disabled={!editing} onChange={v => onChange('rg_url', v)} />
      </Grid>

      <Section title="Research Details" />
      <Textarea id="domains" label="Research Domains" value={data.domains || ''} disabled={!editing} onChange={v => onChange('domains', v)} />
    </>
  );
}
