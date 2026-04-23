import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationContext } from '../_layout';

export default function CategoriesScreen() {
  const context = useContext(ApplicationContext);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#0F172A');
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!context) return null;

  const { categories, setCategories, applications } = context;

  const colorOptions = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

  const refreshCategories = async () => {
    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
  };

  const addCategory = async () => {
    if (!name.trim()) return;

    await db.insert(categoriesTable).values({
      name,
      color,
    });

    await refreshCategories();
    setName('');
    setColor('#0F172A');
  };

  const startEditCategory = (id: number, categoryName: string, categoryColor: string) => {
    setEditingId(id);
    setName(categoryName);
    setColor(categoryColor);
  };

  const saveCategoryEdit = async () => {
    if (!editingId || !name.trim()) return;

    await db
      .update(categoriesTable)
      .set({
        name,
        color,
      })
      .where(eq(categoriesTable.id, editingId));

    await refreshCategories();
    setEditingId(null);
    setName('');
    setColor('#0F172A');
  };

  const deleteCategory = async (id: number) => {
    const inUse = applications.some((application) => application.categoryId === id);
    if (inUse) return;

    await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id));

    await refreshCategories();

    if (editingId === id) {
      setEditingId(null);
      setName('');
      setColor('#0F172A');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setColor('#0F172A');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Categories" subtitle="Manage your categories" />

        <TextInput
          placeholder="Category name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Pick a colour</Text>

        <View style={styles.colorRow}>
          {colorOptions.map((c) => {
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

        {editingId ? (
          <>
            <PrimaryButton label="Save Category Changes" onPress={saveCategoryEdit} />
            <View style={styles.cancelButton}>
              <PrimaryButton label="Cancel Edit" variant="secondary" onPress={cancelEdit} />
            </View>
          </>
        ) : (
          <PrimaryButton label="Add Category" onPress={addCategory} />
        )}

        <View style={styles.list}>
          {categories.map((category) => {
            const inUse = applications.some((application) => application.categoryId === category.id);

            return (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => startEditCategory(category.id, category.name, category.color)}
                    style={styles.smallButton}
                  >
                    <Text style={styles.smallButtonText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => deleteCategory(category.id)}
                    style={[
                      styles.smallButton,
                      inUse && styles.smallButtonDisabled,
                    ]}
                    disabled={inUse}
                  >
                    <Text style={styles.smallButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.helpText}>
          Categories in use cannot be deleted.
        </Text>
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
    flexWrap: 'wrap',
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
  cancelButton: {
    marginTop: 10,
  },
  list: {
    marginTop: 20,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  categoryLeft: {
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
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    backgroundColor: '#0F172A',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonDisabled: {
    opacity: 0.4,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  helpText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 13,
  },
});