import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { applications as applicationsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationContext } from './_layout';

export default function AddApplication() {
  const router = useRouter();
  const context = useContext(ApplicationContext);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [priorityScore, setPriorityScore] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState('Applied');

  if (!context) return null;
  const { setApplications, categories } = context;

  const saveApplication = async () => {
    if (!selectedCategoryId) return;

    await db.insert(applicationsTable).values({
      companyName,
      roleTitle,
      applicationDate,
      priorityScore: Number(priorityScore),
      notes,
      categoryId: selectedCategoryId,
      status,
    });

    const rows = await db.select().from(applicationsTable);
    setApplications(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Add Application" subtitle="Create a new job application." />

        <View style={styles.form}>
          <FormField label="Company Name" value={companyName} onChangeText={setCompanyName} />
          <FormField label="Role Title" value={roleTitle} onChangeText={setRoleTitle} />
          <FormField label="Application Date" value={applicationDate} onChangeText={setApplicationDate} />
          <FormField label="Priority Score" value={priorityScore} onChangeText={setPriorityScore} />
          <FormField label="Notes" value={notes} onChangeText={setNotes} />

          <Text style={styles.categoryLabel}>Category</Text>
          <View style={styles.categoryRow}>
            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;

              return (
                <Pressable
                  key={category.id}
                  accessibilityLabel={`Select ${category.name} category`}
                  accessibilityRole="button"
                  onPress={() => setSelectedCategoryId(category.id)}
                  style={[
                    styles.categoryButton,
                    isSelected && styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      isSelected && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.categoryLabel}>Status</Text>
          <View style={styles.categoryRow}>
            {['Applied', 'Interview', 'Offer', 'Rejected'].map((statusOption) => {
              const isSelected = status === statusOption;

              return (
                <Pressable
                  key={statusOption}
                  accessibilityLabel={`Select ${statusOption} status`}
                  accessibilityRole="button"
                  onPress={() => setStatus(statusOption)}
                  style={[
                    styles.categoryButton,
                    isSelected && styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      isSelected && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {statusOption}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <PrimaryButton label="Save Application" onPress={saveApplication} />

        <View style={styles.backButton}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  backButton: {
    marginTop: 10,
  },
  categoryLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
});