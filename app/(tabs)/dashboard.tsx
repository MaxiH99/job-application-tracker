import ScreenHeader from '@/components/ui/screen-header';
import { useContext } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationContext } from '../_layout';

export default function DashboardScreen() {
  const context = useContext(ApplicationContext);

  if (!context) return null;

  const { applications, targets, categories } = context;

  const weeklyTarget = targets.find((t) => t.type === 'weekly');
  const monthlyTarget = targets.find((t) => t.type === 'monthly');

  const weeklyProgress = applications.length;
  const monthlyProgress = applications.length;

  const weeklyPercent = weeklyTarget
    ? Math.min((weeklyProgress / weeklyTarget.amount) * 100, 100)
    : 0;

  const monthlyPercent = monthlyTarget
    ? Math.min((monthlyProgress / monthlyTarget.amount) * 100, 100)
    : 0;

  const screenWidth = Dimensions.get('window').width;

  const categoryCounts = categories.map((category) => {
    const count = applications.filter(
      (app) => app.categoryId === category.id
    ).length;

    return {
      name: category.name,
      count,
    };
  });

  const chartData = {
    labels: categoryCounts.map((c) => c.name),
    datasets: [
      {
        data: categoryCounts.map((c) => c.count),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Dashboard"
          subtitle="Progress and insights"
        />

        <View style={styles.targetCard}>
          <Text style={styles.targetTitle}>Weekly Target</Text>
          <Text style={styles.targetText}>
            {weeklyProgress} / {weeklyTarget ? weeklyTarget.amount : 0}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${weeklyPercent}%` }]} />
          </View>
        </View>

        <View style={styles.targetCard}>
          <Text style={styles.targetTitle}>Monthly Target</Text>
          <Text style={styles.targetText}>
            {monthlyProgress} / {monthlyTarget ? monthlyTarget.amount : 0}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${monthlyPercent}%` }]} />
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Applications by Category</Text>

          <BarChart
            data={chartData}
            width={screenWidth - 36}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
            }}
            style={{
              marginTop: 10,
              borderRadius: 12,
            }}
          />
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
  content: {
    paddingBottom: 24,
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
    marginBottom: 10,
  },
  progressTrack: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#0F172A',
    height: 12,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  chartTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
});