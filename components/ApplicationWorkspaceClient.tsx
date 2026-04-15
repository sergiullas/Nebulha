'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/Badge';
import { AppLogsMetrics, CloudApplication } from '@/components/types';

type ApplicationWorkspaceClientProps = {
  application: CloudApplication;
  logsMetrics?: AppLogsMetrics;
  currentEnvironment: string;
};

type WorkspaceTab = 'Overview' | 'Metrics' | 'Logs';

const tabs: WorkspaceTab[] = ['Overview', 'Metrics', 'Logs'];

export function ApplicationWorkspaceClient({
  application,
  logsMetrics,
  currentEnvironment,
}: ApplicationWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('Overview');

  const providerVariant = application.provider === 'AWS' ? 'aws' : application.provider === 'GCP' ? 'gcp' : 'unknown';
  const healthVariant = application.health === 'healthy' ? 'healthy' : application.health === 'critical' ? 'critical' : 'degraded';

  const recommendations = useMemo(() => {
    if (!application.activeIncident) {
      return ['Continue normal monitoring cadence'];
    }

    return [
      'Review timeout configuration differences between v1.24 and the previous stable release',
      'Prepare rollback to the previous stable version if error rate remains elevated',
    ];
  }, [application.activeIncident]);

  return (
    <section className="workspace-layout">
      <div className="workspace-frame">
        <header className="workspace-head">
          <div>
            <p className="workspace-path">
              Organization / {application.organization} / Project / {application.project} / Service
            </p>
            <h1 className="workspace-title">{application.name}</h1>
            <div className="pill-row">
              <Badge variant={providerVariant}>{application.provider}</Badge>
              <Badge variant="env">{currentEnvironment}</Badge>
              <Badge variant={healthVariant}>{application.health === 'healthy' ? 'Healthy' : application.health === 'warning' ? 'Warning' : 'Critical'}</Badge>
              {application.activeIncident ? <Badge variant="incident">Incident active</Badge> : null}
            </div>
          </div>
        </header>

        <div className="workspace-tabs" role="tablist" aria-label="Service sections">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`workspace-tab ${activeTab === tab ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="workspace-grid">
          <div className="workspace-column">
            <section className="workspace-card">
              <h2 className="card-title">Service overview</h2>
              <p className="detail-text">Last deployment: {application.lastDeployment}</p>
              <p className="detail-text">
                Available environments: {application.environments.join(', ')}
              </p>
              {application.activeIncident && application.aiSummary ? (
                <p className="detail-text">
                  <strong>AI insight:</strong> {application.aiSummary}
                </p>
              ) : null}
            </section>

            {activeTab === 'Metrics' && logsMetrics ? (
              <section className="workspace-card">
                <h2 className="card-title">Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card"><span className="section-label">Error rate</span><p>{logsMetrics.metrics.errorRate}</p></div>
                  <div className="metric-card"><span className="section-label">Latency P95</span><p>{logsMetrics.metrics.latencyP95}</p></div>
                  <div className="metric-card"><span className="section-label">Failed requests</span><p>{logsMetrics.metrics.failedRequests}</p></div>
                  <div className="metric-card"><span className="section-label">Deployment</span><p>{logsMetrics.metrics.deploymentVersion}</p></div>
                </div>
              </section>
            ) : null}

            {activeTab === 'Logs' && logsMetrics ? (
              <section className="workspace-card">
                <h2 className="card-title">Recent logs</h2>
                <ul className="logs-list">
                  {logsMetrics.logs.map((entry) => (
                    <li key={`${entry.timestamp}-${entry.message}`}>
                      <strong>[{entry.level}]</strong> {entry.message}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(activeTab === 'Metrics' || activeTab === 'Logs') && !logsMetrics ? (
              <section className="workspace-card">
                <h2 className="card-title">Evidence unavailable</h2>
                <p className="detail-text">This record failed validation. Check mocked data integrity.</p>
              </section>
            ) : null}
          </div>

          <aside className="workspace-column">
            <section className="workspace-card workspace-card--ai">
              <h2 className="card-title">AI interpretation</h2>
              {logsMetrics ? (
                <ul className="ai-interpretation-list">
                  <li><strong>Diagnosis:</strong> {logsMetrics.aiInsights.diagnosis}</li>
                  <li><strong>Likely cause:</strong> {logsMetrics.aiInsights.likelyCause}</li>
                  <li><strong>Next step:</strong> {logsMetrics.aiInsights.nextStep}</li>
                </ul>
              ) : (
                <p className="detail-text">AI interpretation unavailable due to invalid record.</p>
              )}
            </section>

            <section className="workspace-card">
              <h2 className="card-title">Recommended next actions</h2>
              <ul className="recommendation-list">
                {recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
