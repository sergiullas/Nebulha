import { AppShell } from '@/components/AppShell';
import { ApplicationCard } from '@/components/ApplicationCard';
import { mockApplications } from '@/components/data';

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <h1 className="page-title">Applications</h1>
      {mockApplications.length > 0 ? (
        <div className="cards-grid">
          {mockApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <p className="detail-text">Application records failed validation. Check mocked data integrity.</p>
      )}
    </AppShell>
  );
}
