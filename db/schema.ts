import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyName: text('company_name').notNull(),
  roleTitle: text('role_title').notNull(),
  applicationDate: text('application_date').notNull(),
  priorityScore: integer('priority_score').notNull().default(0),
  notes: text('notes'),
});