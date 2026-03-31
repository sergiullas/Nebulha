import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { getApplicationById, getLogsMetricsByAppId } from '@/components/data';
import { ProviderBadge } from '@/components/ProviderBadge';
import { HealthBadge } from '@/components/HealthBadge';

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

  const logsMetrics = getLogsMetricsByAppId(application.id);
  const currentEnvironment = application.environments.includes('prod') ? 'prod' : application.environments[0];

  return (
    <AppShell>
      <section className="workspace-header">
        <h1 className="page-title">{application.name}</h1>
        <p className="meta">
          {application.organization} / {application.project}
        </p>
        <div className="pill-row">
          <ProviderBadge provider={application.provider} />
          <HealthBadge health={application.health} />
          <span className="pill env-pill">Environment: {currentEnvironment}</span>
        </div>
        <p className="meta health-summary">Current health: {application.health} in {currentEnvironment}.</p>
        {application.activeIncident && application.aiSummary && (
          <div className="ai-summary-block">
            <strong>AI Incident Summary</strong>
            <p>{application.aiSummary}</p>
          </div>
        )}
      </section>

      <section className="workspace-tabs" aria-label="Workspace sections">
        <span className="tab-pill active">Overview</span>
        <span className="tab-pill">Logs &amp; Metrics</span>
        <span className="tab-pill">Deployments</span>
        <span className="tab-pill">Services</span>
      </section>

      <section className="section-grid">
        <article className="section-card">
          <h2 className="section-title">Overview</h2>
          <p className="placeholder">Environments: {application.environments.join(', ')}</p>
          <p className="placeholder">Last deployment: {application.lastDeployment}</p>
        </article>

        <article className="section-card">
          <h2 className="section-title">Deployments</h2>
          <p className="placeholder">Deployment history module coming soon.</p>
        </article>

        <article className="section-card">
          <h2 className="section-title">Services</h2>
          <p className="placeholder">Service dependency map coming soon.</p>
        </article>
      </section>

      <section className="logs-metrics-section">
        <h2 className="section-title">Logs &amp; Metrics</h2>
        {logsMetrics ? (
          <>
            <div className="metrics-grid">
              <article className="metric-card">
                <p className="metric-label">Error rate</p>
                <p className="metric-value">{logsMetrics.metrics.errorRate}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Latency P95</p>
                <p className="metric-value">{logsMetrics.metrics.latencyP95}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Failed requests</p>
                <p className="metric-value">{logsMetrics.metrics.failedRequests}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Deployment version</p>
                <p className="metric-value">{logsMetrics.metrics.deploymentVersion}</p>
              </article>
            </div>

            <article className="section-card logs-card">
              <h3 className="section-title">Recent logs</h3>
              <ul className="logs-list">
                {logsMetrics.logs.map((logLine) => (
                  <li key={logLine}>{logLine}</li>
                ))}
              </ul>
            </article>

            <article className="section-card ai-interpretation">
              <h3 className="section-title">AI Interpretation</h3>
              <p className="placeholder">
                <strong>Summary:</strong> {logsMetrics.aiInsights.summary}
              </p>
              <p className="placeholder">
                <strong>Likely cause:</strong> {logsMetrics.aiInsights.likelyCause}
              </p>
              <p className="placeholder">
                <strong>Recommended next step:</strong> {logsMetrics.aiInsights.nextStep}
              </p>
            </article>
          </>
        ) : (
          <article className="section-card">
            <p className="placeholder">Logs and metrics are unavailable for this application.</p>
          </article>
        )}
      </section>

      {application.activeIncident && (
        <section className="section-card action-panel">
          <h2 className="section-title">Recommended Actions</h2>
          <p className="placeholder">Prototype actions to move from insight to next step.</p>
          <div className="action-row">
            <button type="button" className="action-button">
              Review timeout configuration
            </button>
            <button type="button" className="action-button secondary">
              Roll back to previous stable version
            </button>
          </div>
          {application.recommendedAction && <p className="placeholder">AI guidance: {application.recommendedAction}</p>}
        </section>
      )}
    </AppShell>
  );
}
