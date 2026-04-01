'use client';

import { useMemo } from 'react';
import { getCatalogServicesByProvider } from '@/components/data';
import { AppLogsMetrics, CloudApplication } from '@/components/types';
import { AIInsight, buildApplicationInsights } from '@/components/insightEngine';

type UseApplicationInsightsInput = {
  application: CloudApplication;
  currentEnvironment: string;
  logsMetrics?: AppLogsMetrics;
};

export const useApplicationInsights = ({
  application,
  currentEnvironment,
  logsMetrics,
}: UseApplicationInsightsInput): AIInsight[] => {
  return useMemo(() => {
    const catalogServices = getCatalogServicesByProvider(application.provider);

    return buildApplicationInsights({
      application,
      environment: currentEnvironment,
      logsMetrics,
      catalogServices,
    });
  }, [application, currentEnvironment, logsMetrics]);
};
