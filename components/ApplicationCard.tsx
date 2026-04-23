import { Application, ApplicationContext } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  application: Application;
};

export default function ApplicationCard({ application }: Props) {
  const router = useRouter();
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { categories } = context;

  const category = categories.find(
    (c) => c.id === application.categoryId
  );

  const openDetails = () =>
    router.push({
      pathname: '/application/[id]',
      params: { id: application.id.toString() },
    });

  const applicationSummary = `${application.companyName}, ${application.roleTitle}, Priority ${application.priorityScore}`;

  return (
    <Pressable
      accessibilityLabel={`${applicationSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={styles.name}>{application.companyName}</Text>
      </View>

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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
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
});
