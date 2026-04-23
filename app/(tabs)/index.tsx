import ApplicationCard from '@/components/ApplicationCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Application, ApplicationContext } from '../_layout';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(ApplicationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');

  if (!context) return null;

  const { applications, targets } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const weeklyTarget = targets.find((t) => t.type === 'weekly');
  const monthlyTarget = targets.find((t) => t.type === 'monthly');

  const weeklyProgress = applications.length;
  const monthlyProgress = applications.length;

  const priorityOptions = [
    'All',
    ...Array.from(
      new Set(
        applications.map((application: Application) =>
          String(application.priorityScore)
        )
      )
    ).sort((a, b) => Number(a) - Number(b)),
  ];

  const filteredApplications = applications.filter(
    (application: Application) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        application.companyName.toLowerCase().includes(normalizedQuery) ||
        application.roleTitle.toLowerCase().includes(normalizedQuery);

      const matchesPriority =
        selectedPriority === 'All' ||
        String(application.priorityScore) === selectedPriority;

      return matchesSearch && matchesPriority;
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Applications"
        subtitle={`${applications.length} tracked`}
      />

      <PrimaryButton
        label="Add Application"
        onPress={() => router.push({ pathname: '../add' })}
      />

      <View style={styles.targetCard}>
        <Text style={styles.targetTitle}>Targets</Text>

        <Text style={styles.targetText}>
          Weekly: {weeklyProgress} / {weeklyTarget ? weeklyTarget.amount : 0}
        </Text>
        <Text style={styles.targetText}>
          Remaining: {weeklyTarget ? Math.max(weeklyTarget.amount - weeklyProgress, 0) : 0}
        </Text>

        <Text style={styles.targetText}>
          Monthly: {monthlyProgress} / {monthlyTarget ? monthlyTarget.amount : 0}
        </Text>
        <Text style={styles.targetText}>
          Remaining: {monthlyTarget ? Math.max(monthlyTarget.amount - monthlyProgress, 0) : 0}
        </Text>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by company or role"
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        {priorityOptions.map((priority) => {
          const isSelected = selectedPriority === priority;

          return (
            <Pressable
              key={priority}
              accessibilityLabel={`Filter by priority ${priority}`}
              accessibilityRole="button"
              onPress={() => setSelectedPriority(priority)}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {priority}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredApplications.length === 0 ? (
          <Text style={styles.emptyText}>
            No applications match your filters
          </Text>
        ) : (
          filteredApplications.map((application: Application) => (
            <ApplicationCard
              key={application.id}
              application={application}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
  targetCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  targetTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  targetText: {
    color: '#475569',
    fontSize: 15,
    marginBottom: 4,
  },
});