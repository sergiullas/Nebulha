import { AppShell } from '@/components/AppShell';
import { ApplicationCard } from '@/components/ApplicationCard';
import { mockApplications } from '@/components/data';

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <p className="workspace-path">Organization / ACME / Project / Payments Revamp / Services</p>
      <h1 className="page-title">Services</h1>
      <p className="detail-text">Monitor service health and open a service workspace to inspect metrics, logs, and AI guidance.</p>
      {mockApplications.length > 0 ? (
        <div className="cards-grid">
          {mockApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <p className="detail-text">Service records failed validation. Check mocked data integrity.</p>
      )}
    </AppShell>
  );
}
