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
      { name: 'Tech' },
      { name: 'Finance' },
      { name: 'Consulting' },
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
      },
      {
        companyName: 'Deloitte',
        roleTitle: 'Business Analyst',
        applicationDate: '2026-02-03',
        priorityScore: 4,
        notes: 'Graduate programme',
        categoryId: consultingId,
      },
      {
        companyName: 'Amazon',
        roleTitle: 'Operations Associate',
        applicationDate: '2026-02-05',
        priorityScore: 3,
        notes: 'Backup option',
        categoryId: financeId,
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