import { Application } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  application: Application;
};

export default function ApplicationCard({ application }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/application/[id]', params: { id: application.id.toString() } });
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
});
