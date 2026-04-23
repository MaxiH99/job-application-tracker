import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Application, ApplicationContext } from '../_layout';

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { applications, setApplications, categories } = context;

  const application = applications.find(
    (a: Application) => a.id === Number(id)
  );

  if (!application) return null;

  const category = categories.find(
    (c) => c.id === application.categoryId
  );

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
        <InfoTag label="Status" value={application.status} />
      </View>

      <View style={styles.categoryRow}>
        <View
          style={[
            styles.categoryDot,
            { backgroundColor: category ? category.color : '#0F172A' },
          ]}
        />
        <Text style={styles.categoryText}>
          {category ? category.name : 'Unknown'}
        </Text>
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
    marginBottom: 12,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  categoryDot: {
    borderRadius: 999,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  categoryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
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