import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  color: text('color').notNull().default('#0F172A'),
});

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyName: text('company_name').notNull(),
  roleTitle: text('role_title').notNull(),
  applicationDate: text('application_date').notNull(),
  priorityScore: integer('priority_score').notNull().default(0),
  notes: text('notes'),
  categoryId: integer('category_id').notNull(),
  status: text('status').notNull().default('Applied'),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // 'weekly' or 'monthly'
  amount: integer('amount').notNull(),
});