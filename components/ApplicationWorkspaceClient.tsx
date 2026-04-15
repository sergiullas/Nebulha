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
            <p className="workspace-path">{application.organization} / {application.project} / {application.name}</p>
            <h1 className="workspace-title">{application.name}</h1>
            <p className="workspace-header-meta">
              Owner: {application.owner} · Last deployment: {application.lastDeployment}
            </p>
            <div className="pill-row">
              <Badge variant={providerVariant}>{application.provider}</Badge>
              <Badge variant="env">{currentEnvironment}</Badge>
              <Badge variant={healthVariant}>{application.health === 'healthy' ? 'Healthy' : application.health === 'warning' ? 'Warning' : 'Critical'}</Badge>
              <Badge variant="unknown">{application.type}</Badge>
              {application.activeIncident ? <Badge variant="incident">Incident active</Badge> : null}
            </div>
          </div>
        </header>

        <div className="workspace-tabs" role="tablist" aria-label="Service detail sections">
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

        {activeTab === 'Overview' ? (
          <div className="workspace-grid">
            <div className="workspace-column">
              <section className="workspace-card">
                <h2 className="card-title">Service context</h2>
                <p className="detail-text">Owner: {application.owner}</p>
                <p className="detail-text">Primary environment: {application.environment}</p>
                <p className="detail-text">Provider: {application.provider}</p>
                <p className="detail-text">Status: {application.health === 'healthy' ? 'Healthy' : application.health === 'warning' ? 'Warning' : 'Critical'}</p>
                <p className="detail-text">Last deployment: {application.lastDeployment}</p>
              </section>

              <section className="workspace-card">
                <h2 className="card-title">Incident summary (AI)</h2>
                <p className="detail-text">
                  {application.aiSummary ?? 'No active incident detected. Service is currently operating within expected thresholds.'}
                </p>
              </section>
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
                  <ul className="ai-interpretation-list">
                    <li><strong>Diagnosis:</strong> Recent evidence is unavailable for this service.</li>
                    <li><strong>Likely cause:</strong> Metrics and logs failed validation in the mocked record.</li>
                    <li><strong>Next step:</strong> Verify the service telemetry feed and reload this page.</li>
                  </ul>
                )}
              </section>

              <section className="workspace-card workspace-card--actions">
                <h2 className="card-title">Recommended next actions</h2>
                <ul className="recommendation-list">
                  {recommendations.slice(0, 2).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        ) : null}

        {activeTab === 'Metrics' && (
          <div className="workspace-grid workspace-grid--single">
            {logsMetrics ? (
              <section className="workspace-card">
                <h2 className="card-title">Metrics</h2>
                <div className="metrics-grid metrics-grid--compact">
                  <div className="metric-card"><span className="section-label">Error rate</span><p>{logsMetrics.metrics.errorRate}</p></div>
                  <div className="metric-card"><span className="section-label">Latency P95</span><p>{logsMetrics.metrics.latencyP95}</p></div>
                  <div className="metric-card"><span className="section-label">Failed requests</span><p>{logsMetrics.metrics.failedRequests}</p></div>
                </div>
              </section>
            ) : (
              <section className="workspace-card">
                <h2 className="card-title">Evidence unavailable</h2>
                <p className="detail-text">This record failed validation. Check mocked data integrity.</p>
              </section>
            )}
          </div>
        )}

        {activeTab === 'Logs' && (
          <div className="workspace-grid workspace-grid--single">
            {logsMetrics ? (
              <section className="workspace-card">
                <h2 className="card-title">Recent logs</h2>
                <ul className="logs-list logs-list--plain">
                  {logsMetrics.logs.map((entry) => (
                    <li key={`${entry.timestamp}-${entry.message}`} className={`logs-list-item logs-list-item--${entry.level.toLowerCase()}`}>
                      <span className="log-meta">
                        {entry.timestamp} · {entry.source}
                      </span>
                      <p className="log-message">
                        <strong>[{entry.level}]</strong> {entry.message}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <section className="workspace-card">
                <h2 className="card-title">Evidence unavailable</h2>
                <p className="detail-text">This record failed validation. Check mocked data integrity.</p>
              </section>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
