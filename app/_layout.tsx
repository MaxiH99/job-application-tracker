import { db } from '@/db/client';
import { applications as applicationsTable, categories as categoriesTable, targets as targetsTable } from '@/db/schema';
import { seedApplicationsIfEmpty } from '@/db/seed';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

export type Application = {
  id: number;
  companyName: string;
  roleTitle: string;
  applicationDate: string;
  priorityScore: number;
  notes: string | null;
  categoryId: number;
  status: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Target = {
  id: number;
  type: string;
  amount: number;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
};

export const ApplicationContext =
  createContext<ApplicationContextType | null>(null);

export default function RootLayout() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    const loadApplications = async () => {
      await seedApplicationsIfEmpty();
      const applicationRows = await db.select().from(applicationsTable);
      const categoryRows = await db.select().from(categoriesTable);
      const targetRows = await db.select().from(targetsTable);

      setApplications(applicationRows);
      setCategories(categoryRows);
      setTargets(targetRows);
    };

    void loadApplications();
  }, []);

  return (
    <ApplicationContext.Provider value={{ applications, setApplications, categories, setCategories, targets, setTargets }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{
            title: 'Add Application',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="application/[id]"
          options={{
            title: 'Application Details',
            headerBackTitle: 'Applications',
          }}
        />
        <Stack.Screen
          name="application/[id]/edit"
          options={{
            title: 'Edit Application',
            headerBackTitle: 'Details',
          }}
        />
      </Stack>
    </ApplicationContext.Provider>
  );
}
