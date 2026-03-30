import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { getApplicationById } from '@/components/data';
import { ProviderBadge } from '@/components/ProviderBadge';

type ApplicationWorkspacePageProps = {
  params: {
    id: string;
  };
};

export default function ApplicationWorkspacePage({ params }: ApplicationWorkspacePageProps) {
  const application = getApplicationById(params.id);

  if (!application) {
    notFound();
  }

  return (
    <AppShell>
      <section className="workspace-header">
        <h1 className="page-title">{application.name}</h1>
        <p className="meta">
          {application.organization} / {application.project}
        </p>
        <div className="pill-row">
          <ProviderBadge provider={application.provider} />
        </div>
      </section>

      <section className="section-grid">
        <article className="section-card">
          <h2 className="section-title">Environments</h2>
          <p className="placeholder">{application.environments.join(', ')}</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">Services</h2>
          <p className="placeholder">Services module coming soon.</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">Deployments</h2>
          <p className="placeholder">Deployment history will be shown here.</p>
        </article>
        <article className="section-card">
          <h2 className="section-title">Health Summary</h2>
          <p className="placeholder">Current status: {application.health}</p>
        </article>
      </section>
    </AppShell>
  );
}
