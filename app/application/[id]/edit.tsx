import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [status, setStatus] = useState('Applied');

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
    setStatus(application.status ?? 'Applied');
  }, [application]);

  if (!context || !application) return null;

  const { setApplications } = context;

  const saveChanges = async () => {
    await db
      .update(applicationsTable)
      .set({
        companyName,
        roleTitle,
        applicationDate,
        priorityScore: Number(priorityScore),
        notes,
        status,
      })
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

        <Text style={styles.statusLabel}>Status</Text>
        <View style={styles.statusRow}>
          {['Applied', 'Interview', 'Offer', 'Rejected'].map((statusOption) => {
            const isSelected = status === statusOption;

            return (
              <Pressable
                key={statusOption}
                accessibilityLabel={`Select ${statusOption} status`}
                accessibilityRole="button"
                onPress={() => setStatus(statusOption)}
                style={[
                  styles.statusButton,
                  isSelected && styles.statusButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    isSelected && styles.statusButtonTextSelected,
                  ]}
                >
                  {statusOption}
                </Text>
              </Pressable>
            );
          })}
        </View>
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
  statusLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  statusButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  statusButtonTextSelected: {
    color: '#FFFFFF',
  },
});