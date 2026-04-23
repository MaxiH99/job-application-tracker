import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationContext } from '../_layout';

export default function CategoriesScreen() {
  const context = useContext(ApplicationContext);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#0F172A');

  if (!context) return null;

  const { categories, setCategories } = context;

  const addCategory = async () => {
    if (!name.trim()) return;

    await db.insert(categoriesTable).values({
      name,
      color,
    });

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);

    setName('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <ScreenHeader title="Categories" subtitle="Manage your categories" />

        <TextInput
          placeholder="Category name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Pick a colour</Text>

        <View style={styles.colorRow}>
          {['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'].map((c) => {
            const isSelected = color === c;

            return (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  isSelected && styles.selectedCircle,
                ]}
              />
            );
          })}
        </View>

        <PrimaryButton label="Add Category" onPress={addCategory} />

        <View style={styles.list}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: category.color },
                ]}
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: '600',
    color: '#0F172A',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  list: {
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#111827',
  },
});