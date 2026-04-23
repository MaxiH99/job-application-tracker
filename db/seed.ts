import { db } from './client';
import { applications } from './schema';

export async function seedApplicationsIfEmpty() {
  const existing = await db.select().from(applications);

  if (existing.length > 0) {
    return;
  }

  await db.insert(applications).values([
    {
      companyName: 'Google',
      roleTitle: 'Software Engineer',
      applicationDate: '2026-02-01',
      priorityScore: 5,
      notes: 'Dream company',
    },
    {
      companyName: 'Deloitte',
      roleTitle: 'Business Analyst',
      applicationDate: '2026-02-03',
      priorityScore: 4,
      notes: 'Graduate programme',
    },
    {
      companyName: 'Amazon',
      roleTitle: 'Operations Associate',
      applicationDate: '2026-02-05',
      priorityScore: 3,
      notes: 'Backup option',
    },
  ]);
}