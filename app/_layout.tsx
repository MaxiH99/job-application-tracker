import { db } from '@/db/client';
import { applications as applicationsTable, categories as categoriesTable } from '@/db/schema';
import { seedApplicationsIfEmpty } from '@/db/seed';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

export type Application = {
  id: number;
  companyName: string;
  roleTitle: string;
  applicationDate: string;
  priorityScore: number;
  notes: string;
  categoryId: number;
};

export type Category = {
  id: number;
  name: string;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const ApplicationContext =
  createContext<ApplicationContextType | null>(null);

export default function RootLayout() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadApplications = async () => {
      await seedApplicationsIfEmpty();
      const applicationRows = await db.select().from(applicationsTable);
      const categoryRows = await db.select().from(categoriesTable);
      
      setApplications(applicationRows);
      setCategories(categoryRows);
    };

    void loadApplications();
  }, []);

  return (
    <ApplicationContext.Provider value={{ applications, setApplications, categories, setCategories }}>
      <Stack />
    </ApplicationContext.Provider>
  );
}
