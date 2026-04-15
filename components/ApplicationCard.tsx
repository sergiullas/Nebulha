import Link from 'next/link';
import { CloudApplication } from './types';
import { Badge } from './Badge';

type ApplicationCardProps = {
  app: CloudApplication;
};

export function ApplicationCard({ app }: ApplicationCardProps) {
  const providerVariant = app.provider === 'AWS' ? 'aws' : app.provider === 'GCP' ? 'gcp' : 'unknown';
  const healthVariant = app.health === 'healthy' ? 'healthy' : app.health === 'critical' ? 'critical' : 'degraded';

  return (
    <article className="service-row" role="row">
      <div>
        <h2 className="service-row__name">{app.name}</h2>
        <p className="service-row__context">{app.organization} / {app.project}</p>
      </div>

      <div>
        <div className="service-row__badges">
          <Badge variant={providerVariant}>{app.provider}</Badge>
          <Badge variant="unknown">{app.type}</Badge>
          <Badge variant="unknown">Owner: {app.owner}</Badge>
        </div>
        {app.tags.length > 0 ? <p className="service-row__tags">Tags: {app.tags.join(', ')}</p> : null}
      </div>

      <div>
        <Badge variant="env">{app.environment}</Badge>
      </div>

      <div className="service-row__status">
        <Badge variant={healthVariant}>{app.health === 'warning' ? 'Warning' : app.health === 'healthy' ? 'Healthy' : 'Critical'}</Badge>
        {app.activeIncident ? <span className="service-row__incident">Incident</span> : null}
      </div>

      <p className="service-row__deployment">{app.lastDeployment}</p>

      <Link className="service-row__action" href={`/app/${app.id}`}>
        Open service
      </Link>
    </article>
  );
}
