import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { Application, ApplicationContext } from '../../_layout';

export default function EditApplication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [priorityScore, setPriorityScore] = useState('');
  const [notes, setNotes] = useState('');
  const application = context?.applications.find(
    (a: Application) => a.id === Number(id)
  );

  useEffect(() => {
    if (!application) return;
    setCompanyName(application.companyName);
    setRoleTitle(application.roleTitle);
    setApplicationDate(application.applicationDate);
    setPriorityScore(String(application.priorityScore));
    setNotes(application.notes ?? '');
  }, [application]);

  if (!context || !application) return null;

  const { setApplications } = context;

  const saveChanges = async () => {
    await db
      .update(applicationsTable)
      .set({ companyName, roleTitle, applicationDate, priorityScore: Number(priorityScore), notes, })
      .where(eq(applicationsTable.id, Number(id)));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Application" subtitle={`Update ${application.companyName}`} />
      <View style={styles.form}>
        <FormField label="Company Name" value={companyName} onChangeText={setCompanyName} />
        <FormField label="Role Title" value={roleTitle} onChangeText={setRoleTitle} />
        <FormField label="Application Date" value={applicationDate} onChangeText={setApplicationDate} />
        <FormField label="Priority Score" value={priorityScore} onChangeText={setPriorityScore} />
        <FormField label="Notes" value={notes} onChangeText={setNotes} />
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
