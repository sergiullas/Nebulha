export type Provider = 'AWS' | 'GCP';

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export type CloudApplication = {
  id: string;
  name: string;
  organization: string;
  project: string;
  provider: Provider;
  environments: string[];
  health: HealthStatus;
  lastDeployment: string;
};
