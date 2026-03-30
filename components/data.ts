import apps from '@/data/apps.json';
import { CloudApplication } from './types';

export const mockApplications = apps as CloudApplication[];

export const getApplicationById = (id: string): CloudApplication | undefined =>
  mockApplications.find((app) => app.id === id);
