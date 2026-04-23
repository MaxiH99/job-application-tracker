import { db } from './client';
import { applications, categories, targets } from './schema';

export async function seedApplicationsIfEmpty() {
  const existingApplications = await db.select().from(applications);

  const existingCategories = await db.select().from(categories);

  let techId: number;
  let financeId: number;
  let consultingId: number;

  if (existingCategories.length === 0) {
    const insertedCategories = await db.insert(categories).values([
      { name: 'Tech', color: '#2563EB' },
      { name: 'Finance', color: '#16A34A' },
      { name: 'Consulting', color: '#F59E0B' },
    ]).returning();

    techId = insertedCategories[0].id;
    financeId = insertedCategories[1].id;
    consultingId = insertedCategories[2].id;
  } else {
    techId = existingCategories.find((category) => category.name === 'Tech')?.id ?? 1;
    financeId = existingCategories.find((category) => category.name === 'Finance')?.id ?? 2;
    consultingId = existingCategories.find((category) => category.name === 'Consulting')?.id ?? 3;
  }

  if (existingApplications.length === 0) {
    await db.insert(applications).values([
      {
        companyName: 'Google',
        roleTitle: 'Software Engineer',
        applicationDate: '2026-02-01',
        priorityScore: 5,
        notes: 'Dream company',
        categoryId: techId,
        status: 'Applied',
      },
      {
        companyName: 'Deloitte',
        roleTitle: 'Business Analyst',
        applicationDate: '2026-02-03',
        priorityScore: 4,
        notes: 'Graduate programme',
        categoryId: consultingId,
        status: 'Interview',
      },
      {
        companyName: 'Amazon',
        roleTitle: 'Operations Associate',
        applicationDate: '2026-02-05',
        priorityScore: 3,
        notes: 'Backup option',
        categoryId: financeId,
        status: 'Rejected',
      },

      {
        companyName: 'Microsoft',
        roleTitle: 'Cloud Engineer',
        applicationDate: '2026-02-05',
        priorityScore: 4,
        notes: 'Azure Team',
        categoryId: techId,
        status: 'Applied',
      },

      {
        companyName: 'KPMG',
        roleTitle: 'Consulting Analyst',
        applicationDate: '2026-02-05',
        priorityScore: 3,
        notes: 'Backup consulting',
        categoryId: consultingId,
        status: 'Rejected',
      },

      {
        companyName: 'JP Morgan',
        roleTitle: 'Finance Intern',
        applicationDate: '2026-02-06',
        priorityScore: 3,
        notes: 'Finance experience needed',
        categoryId: financeId,
        status: 'Applied',
      },

      {
        companyName: 'Stripe',
        roleTitle: 'Engineer',
        applicationDate: '2026-02-06',
        priorityScore: 5,
        notes: 'Good money',
        categoryId: techId,
        status: 'Applied',
      },

      {
        companyName: 'Accenture',
        roleTitle: 'Tech Analyst',
        applicationDate: '2026-02-06',
        priorityScore: 1,
        notes: 'Big job',
        categoryId: techId,
        status: 'Interview',
      },
    ]);
  }

  const existingTargets = await db.select().from(targets);

  if (existingTargets.length === 0) {
    await db.insert(targets).values([
      { type: 'weekly', amount: 5 },
      { type: 'monthly', amount: 20 },
    ]);
  }
}