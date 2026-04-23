import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { Application, ApplicationContext } from '../_layout';

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { applications, setApplications } = context;

  const application = applications.find(
    (a: Application) => a.id === Number(id)
  );

  if (!application) return null;

  const deleteApplication = async () => {
    await db
      .delete(applicationsTable)
      .where(eq(applicationsTable.id, Number(id)));

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={application.companyName} subtitle="Application details" />
      <View style={styles.tags}>
        <InfoTag label="Role" value={application.roleTitle} />
        <InfoTag label="Priority" value={String(application.priorityScore)} />
      </View>

      <Text style={styles.notes}>
        Notes: {application.notes || 'None'}
      </Text>

      <PrimaryButton
        label="Edit"
        onPress={() =>
          router.push({
            pathname: '/application/[id]/edit',
            params: { id }
          })
        }
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="secondary" onPress={deleteApplication} />
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  notes: {
    marginTop: 10,
    fontSize: 16,
    color: '#374151',
  },
});
