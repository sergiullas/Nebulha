'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CloudTemplate, TemplateGovernanceState, TemplateWorkloadType, TemplateComplexity } from '@/components/types';

type TemplatesClientProps = {
  templates: CloudTemplate[];
};

const workloadLabels: Record<TemplateWorkloadType, string> = {
  'web-api': 'Web API',
  'data-pipeline': 'Data Pipeline',
  'event-driven': 'Event-Driven',
  'ml-inference': 'ML Inference',
  'static-site': 'Static Site',
};

const governanceLabel: Record<TemplateGovernanceState, string> = {
  approved: 'Fully approved',
  'requires-approval': 'Requires approval',
  'includes-restricted': 'Includes restricted',
};

const governanceClass: Record<TemplateGovernanceState, string> = {
  approved: 'gov-approved',
  'requires-approval': 'gov-requires',
  'includes-restricted': 'gov-discouraged',
};

const complexityLabel: Record<TemplateComplexity, string> = {
  low: 'Low complexity',
  medium: 'Medium complexity',
  high: 'High complexity',
};

const ALL = 'All';

function TemplateCard({ template }: { template: CloudTemplate }) {
  const serviceCount = template.services.length;
  const requiredCount = template.services.filter((s) => s.required).length;

  return (
    <Link href={`/templates/${template.id}`} className="template-card-link">
      <article className="template-card">
        <div className="template-card-header">
          <div className="template-card-title-row">
            <h2 className="template-card-name">{template.name}</h2>
            <span className="pill env-pill">{workloadLabels[template.type]}</span>
          </div>
          <div className="template-card-meta-row">
            <span className={`pill ${governanceClass[template.governanceState]}`}>
              {governanceLabel[template.governanceState]}
            </span>
            <span className="pill env-pill template-complexity-pill">{complexityLabel[template.complexity]}</span>
            <span className="pill env-pill">{template.provider}</span>
          </div>
        </div>

        <p className="template-card-purpose">{template.purpose}</p>

        <div className="template-card-services">
          <p className="template-card-services-label">
            {serviceCount} service{serviceCount !== 1 ? 's' : ''} · {requiredCount} required
          </p>
          <div className="template-card-service-pills">
            {template.services.map((svc) => (
              <span key={svc.serviceId} className={`pill env-pill ${svc.required ? '' : 'template-service-optional'}`}>
                {svc.name}
              </span>
            ))}
          </div>
        </div>

        <div className="template-card-footer">
          <div className="template-card-cost">
            <span className="template-card-cost-label">Est. monthly</span>
            <span className="template-card-cost-value">
              ${template.estimatedMonthlyCost.min}–${template.estimatedMonthlyCost.max}
            </span>
          </div>
          <div className="template-card-ai-signal">
            <span className="template-card-confidence">{template.aiInsight.confidence}% confidence</span>
            <span className="template-card-cta">View template →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function TemplatesClient({ templates }: TemplatesClientProps) {
  const [activeWorkload, setActiveWorkload] = useState<string>(ALL);
  const [activeGovernance, setActiveGovernance] = useState<string>(ALL);
  const [activeProvider, setActiveProvider] = useState<string>(ALL);
  const [activeComplexity, setActiveComplexity] = useState<string>(ALL);
  const [showAll, setShowAll] = useState(false);

  const allWorkloads = Array.from(new Set(templates.map((t) => t.type)));
  const allProviders = Array.from(new Set(templates.map((t) => t.provider)));
  const allGovernance: TemplateGovernanceState[] = ['approved', 'requires-approval', 'includes-restricted'];
  const allComplexities: TemplateComplexity[] = ['low', 'medium', 'high'];

  const filtered = templates.filter((t) => {
    if (activeWorkload !== ALL && t.type !== activeWorkload) return false;
    if (activeGovernance !== ALL && t.governanceState !== activeGovernance) return false;
    if (activeProvider !== ALL && t.provider !== activeProvider) return false;
    if (activeComplexity !== ALL && t.complexity !== activeComplexity) return false;
    return true;
  });

  const hasActiveFilter =
    activeWorkload !== ALL || activeGovernance !== ALL || activeProvider !== ALL || activeComplexity !== ALL;

  const primaryTemplates = filtered.slice(0, 3);
  const remainingTemplates = filtered.slice(3);

  return (
    <div className="templates-page">
      <header className="templates-header">
        <div className="templates-header-text">
          <h1 className="templates-title">Templates</h1>
          <p className="templates-subtitle">
            Pre-approved architecture patterns for common workloads. Each template encodes platform best practices,
            governance constraints, and cost guidance — so you start from a known, safe baseline.
          </p>
        </div>
        <div className="templates-header-meta">
          <span className="pill env-pill">Authored by Cloud Platform Lead</span>
          <span className="pill gov-approved">Supply-governed · Demand-consumed</span>
        </div>
      </header>

      <div className="templates-layer-note">
        <p className="templates-layer-note-text">
          <strong>Templates sit above the Catalog.</strong> A template gives you a system-level starting architecture.
          The Catalog lets you add individual services to an existing application.
        </p>
      </div>

      {/* Filters */}
      <div className="templates-filters">
        <div className="templates-filter-group">
          <span className="templates-filter-label">Workload</span>
          <div className="templates-filter-pills">
            <button
              type="button"
              className={`tab-pill ${activeWorkload === ALL ? 'active' : ''}`}
              onClick={() => setActiveWorkload(ALL)}
            >
              All
            </button>
            {allWorkloads.map((w) => (
              <button
                key={w}
                type="button"
                className={`tab-pill ${activeWorkload === w ? 'active' : ''}`}
                onClick={() => setActiveWorkload(w)}
              >
                {workloadLabels[w]}
              </button>
            ))}
          </div>
        </div>

        <div className="templates-filter-group">
          <span className="templates-filter-label">Governance</span>
          <div className="templates-filter-pills">
            <button
              type="button"
              className={`tab-pill ${activeGovernance === ALL ? 'active' : ''}`}
              onClick={() => setActiveGovernance(ALL)}
            >
              All
            </button>
            {allGovernance.filter((g) => templates.some((t) => t.governanceState === g)).map((g) => (
              <button
                key={g}
                type="button"
                className={`tab-pill ${activeGovernance === g ? 'active' : ''}`}
                onClick={() => setActiveGovernance(g)}
              >
                {governanceLabel[g]}
              </button>
            ))}
          </div>
        </div>

        <div className="templates-filter-group">
          <span className="templates-filter-label">Provider · Complexity</span>
          <div className="templates-filter-pills">
            {allProviders.map((p) => (
              <button
                key={p}
                type="button"
                className={`tab-pill ${activeProvider === p ? 'active' : ''}`}
                onClick={() => setActiveProvider(activeProvider === p ? ALL : p)}
              >
                {p}
              </button>
            ))}
            {allComplexities.filter((c) => templates.some((t) => t.complexity === c)).map((c) => (
              <button
                key={c}
                type="button"
                className={`tab-pill ${activeComplexity === c ? 'active' : ''}`}
                onClick={() => setActiveComplexity(activeComplexity === c ? ALL : c)}
              >
                {complexityLabel[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="templates-empty">
          <p className="templates-empty-title">No templates match these filters.</p>
          <button
            type="button"
            className="incident-button secondary"
            onClick={() => {
              setActiveWorkload(ALL);
              setActiveGovernance(ALL);
              setActiveProvider(ALL);
              setActiveComplexity(ALL);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Primary recommendations */}
          <section className="templates-section">
            <div className="templates-section-header">
              <p className="templates-section-label">
                {hasActiveFilter ? `Matching templates (${filtered.length})` : 'Recommended starting points'}
              </p>
              {!hasActiveFilter && (
                <p className="templates-section-hint">
                  Highest confidence matches across common ACME workload patterns
                </p>
              )}
            </div>
            <div className="templates-grid">
              {primaryTemplates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>

          {/* Expanded browsing */}
          {remainingTemplates.length > 0 && (
            <section className="templates-section">
              <div className="templates-section-header">
                <p className="templates-section-label">More templates</p>
                {!showAll && (
                  <button
                    type="button"
                    className="templates-show-more"
                    onClick={() => setShowAll(true)}
                  >
                    Show {remainingTemplates.length} more
                  </button>
                )}
              </div>
              {showAll && (
                <div className="templates-grid">
                  {remainingTemplates.map((t) => (
                    <TemplateCard key={t.id} template={t} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
