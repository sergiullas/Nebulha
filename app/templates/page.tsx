import { AppShell } from '@/components/AppShell';
import { TemplatesClient } from '@/components/TemplatesClient';
import { mockTemplates } from '@/components/data';

export default function TemplatesPage() {
  return (
    <AppShell>
      <TemplatesClient templates={mockTemplates} />
    </AppShell>
  );
}
