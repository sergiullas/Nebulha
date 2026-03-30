import { Provider } from './types';

type ProviderBadgeProps = {
  provider: Provider;
};

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  const className = provider === 'AWS' ? 'provider-aws' : 'provider-gcp';

  return <span className={`pill ${className}`}>{provider}</span>;
}
