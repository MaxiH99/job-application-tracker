import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { seedApplicationsIfEmpty } from '@/db/seed';

export type Application = {
  id: number;
  companyName: string;
  roleTitle: string;
  applicationDate: string;
  priorityScore: number;
  notes: string;
};

type ApplicationContextType = {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
};

export const ApplicationContext =
  createContext<ApplicationContextType | null>(null);

export default function RootLayout() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const loadApplications = async () => {
      await seedApplicationsIfEmpty();
      const rows = await db.select().from(applicationsTable);
      setApplications(rows);
    };

    void loadApplications();
  }, []);

  return (
    <ApplicationContext.Provider value={{ applications, setApplications }}>
      <Stack />
    </ApplicationContext.Provider>
  );
}
