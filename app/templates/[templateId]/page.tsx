import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { TemplateDetailClient } from '@/components/TemplateDetailClient';
import { getTemplateById } from '@/components/data';

type TemplatePageProps = {
  params: { templateId: string };
};

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = getTemplateById(params.templateId);

  if (!template) {
    notFound();
  }

  return (
    <AppShell>
      <TemplateDetailClient template={template} />
    </AppShell>
  );
}
