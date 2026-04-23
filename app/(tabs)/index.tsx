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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortPriority, setSortPriority] = useState('None');

  if (!context) return null;

  const { applications, categories } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const categoryOptions = [
    'All',
    ...categories.map((category) => category.name),
  ];

  const filteredApplications = applications
    .filter((application: Application) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        application.companyName.toLowerCase().includes(normalizedQuery) ||
        application.roleTitle.toLowerCase().includes(normalizedQuery);

      const category = categories.find(
        (c) => c.id === application.categoryId
      );

      const matchesCategory =
        selectedCategory === 'All' ||
        category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortPriority === 'Low to High') {
        return a.priorityScore - b.priorityScore;
      }
      if (sortPriority === 'High to Low') {
        return b.priorityScore - a.priorityScore;
      }
      return 0;
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Applications"
          subtitle={`${applications.length} tracked`}
        />

        <PrimaryButton
          label="Add Application"
          onPress={() => router.push({ pathname: '../add' })}
        />

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by company or role"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />

        <Text style={styles.filterLabel}>Filter by Category</Text>
        <View style={styles.filterRow}>
          {categoryOptions.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <Pressable
                key={category}
                accessibilityLabel={`Filter by category ${category}`}
                accessibilityRole="button"
                onPress={() => setSelectedCategory(category)}
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
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.filterLabel}>Sort by Priority</Text>
        <View style={styles.filterRow}>
          {['None', 'Low to High', 'High to Low'].map((option) => {
            const isSelected = sortPriority === option;

            return (
              <Pressable
                key={option}
                accessibilityLabel={`Sort by priority ${option}`}
                accessibilityRole="button"
                onPress={() => setSortPriority(option)}
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
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listContent}>
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
        </View>
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
  pageContent: {
    paddingBottom: 24,
  },
  listContent: {
    paddingTop: 14,
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filterLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
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
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
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
    color: '#64748B',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});