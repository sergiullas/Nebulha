import { AppShell } from '@/components/AppShell';
import { ApplicationCard } from '@/components/ApplicationCard';
import { mockApplications } from '@/components/data';

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <header className="services-header">
        <p className="services-eyebrow">Organization: ACME</p>
        <h1 className="page-title">Project Services</h1>
        <p className="detail-text">Project: Payments Revamp · Inventory-style view with status-first signals.</p>
      </header>

      {mockApplications.length > 0 ? (
        <section className="services-list" aria-label="Services inventory">
          <div className="services-list__head" role="row">
            <span>Service</span>
            <span>Metadata</span>
            <span>Environment</span>
            <span>Status</span>
            <span>Last deployment</span>
            <span>Action</span>
          </div>
          {mockApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </section>
      ) : (
        <p className="detail-text">Application records failed validation. Check mocked data integrity.</p>
      )}
    </AppShell>
  );
}
