import { AppShell } from '@/components/AppShell';
import { ApplicationCard } from '@/components/ApplicationCard';
import { mockApplications } from '@/components/data';

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <h1 className="page-title">My Applications</h1>
      <div className="cards-grid">
        {mockApplications.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </AppShell>
  );
}
