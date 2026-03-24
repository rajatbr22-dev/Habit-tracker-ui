import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import {
  Calendar,
  CheckCircle,
  Flame,
  TrendingUp,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { BRAND_COLORS, SEMANTIC_COLORS } from '../theme/colors';
import { RADII, SHADOWS, SPACING, LAYOUT } from '../theme/spacing';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.services';
import { AnalyticsSkeleton } from '../components/AnalyticsSkeleton';
import ErrorView from '../components/ErrorView';

const { width } = Dimensions.get('window');

const MOCK_DATA = {
  summary: {
    totalHabits: 8,
    activeHabits: 5,
    averageCompletionRate: 0.78,
    currentOverallStreak: 12,
    longestOverallStreak: 24,
    totalCheckIns: 156,
  },
  perHabit: [
    { habitId: '1', habitName: 'Morning Meditation', habitColor: BRAND_COLORS.primary, completionRate: 0.95, currentStreak: 15, longestStreak: 30, totalCompletions: 45 },
    { habitId: '2', habitName: 'Drink 2L Water', habitColor: '#0984E3', completionRate: 0.82, currentStreak: 8, longestStreak: 12, totalCompletions: 38 },
    { habitId: '3', habitName: 'Read 20 Pages', habitColor: '#00B894', completionRate: 0.65, currentStreak: 3, longestStreak: 7, totalCompletions: 22 },
    { habitId: '4', habitName: 'Gym Workout', habitColor: '#E17055', completionRate: 0.45, currentStreak: 1, longestStreak: 5, totalCompletions: 12 },
    { habitId: '5', habitName: 'Deep Work', habitColor: BRAND_COLORS.primaryLight, completionRate: 0.88, currentStreak: 10, longestStreak: 15, totalCompletions: 40 },
  ],
  weeklyOverview: {
    weekStart: '2024-03-18',
    dailyRates: [0.65, 0.72, 0.68, 0.85, 0.92, 0.88, 0.95],
    overallRate: 0.81,
  }
};

const HeatmapCell = ({ level, colors }: { level: number; colors: any }) => {
  const cellColor = useMemo(() => {
    if (level === 0) return colors.surfaceAlt;
    if (level === 1) return BRAND_COLORS.primaryUltraLight;
    if (level === 2) return BRAND_COLORS.primaryLight;
    if (level === 3) return BRAND_COLORS.primary;
    return BRAND_COLORS.primaryDark;
  }, [level, colors]);

  return <View style={[styles.heatCell, { backgroundColor: cellColor }]} />;
};

const AnalyticsScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState('Week');

  const { data: analyticsData, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const response = await DashboardService.getSummaryHabits();
      return response.data;
    },
  });

  const USE_MOCK = true; // Set to false to use real data
  const data = USE_MOCK ? MOCK_DATA : analyticsData;

  const summary = data?.summary;
  const weeklyOverview = data?.weeklyOverview;
  const perHabit = data?.perHabit;

  const chartWidth = width - (LAYOUT.screenPaddingHorizontal * 2) - SPACING.lg * 2;

  const lineChartData = useMemo(() => {
    if (!weeklyOverview) return [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weeklyOverview.dailyRates.map((rate: number, index: number) => ({
      value: Math.round(rate * 100),
      label: days[index],
    }));
  }, [weeklyOverview]);

  const barChartData = useMemo(() => {
    if (!perHabit) return [];
    return perHabit.slice(0, 7).map((habit: any) => ({
      value: habit.completionRate,
      label: habit.habitName.substring(0, 3),
      frontColor: habit.habitColor || BRAND_COLORS.primaryLight,
    }));
  }, [perHabit]);

  if (isLoading && !USE_MOCK) return <AnalyticsSkeleton />;
  if (isError && !USE_MOCK) return <ErrorView onRetry={refetch} />;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + SPACING.md,
        paddingBottom: SPACING['2xl']
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={[typography.largeTitle, { color: colors.text }]}>Analytics</Text>
      </View>

      {/* Time Range Selector */}
      <View style={[styles.timeSelector, { backgroundColor: colors.surfaceAlt }]}>
        {['Day', 'Week', 'Month', 'Year'].map((range) => (
          <Pressable
            key={range}
            onPress={() => setTimeRange(range)}
            style={[
              styles.timeBtn,
              timeRange === range && { backgroundColor: colors.card, ...SHADOWS.sm },
            ]}
          >
            <Text
              style={[
                typography.subheadMedium,
                { color: timeRange === range ? colors.primary : colors.textSecondary },
              ]}
            >
              {range}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[typography.subhead, { color: colors.textSecondary, marginLeft: LAYOUT.screenPaddingHorizontal, marginBottom: SPACING.lg }]}>
        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Overview
      </Text>

      {/* Stats Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.primaryUltraLight }]}>
            <CheckCircle size={16} color={colors.primary} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Completion</Text>
          <Text style={[typography.title1, { color: colors.text }]}>
            {summary?.averageCompletionRate ? `${Math.round(summary.averageCompletionRate * 100)}%` : '0%'}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.warningLight }]}>
            <Flame size={16} color={colors.warning} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Current Streak</Text>
          <Text style={[typography.title1, { color: colors.text }]}>{summary?.currentOverallStreak || 0}d</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.infoLight }]}>
            <TrendingUp size={16} color={colors.info} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Best Streak</Text>
          <Text style={[typography.title1, { color: colors.text }]}>{summary?.longestOverallStreak || 0}d</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.successLight }]}>
            <Calendar size={16} color={colors.success} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Total Check-ins</Text>
          <Text style={[typography.title1, { color: colors.text }]}>{summary?.totalCheckIns || 0}</Text>
        </View>
      </ScrollView>

      {/* Completion Trend Chart */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[typography.title2, { color: colors.text }]}>Completion Trend</Text>
            <Text style={[typography.caption1, { color: colors.textSecondary }]}>Overall progress this week</Text>
          </View>
          <Info size={16} color={colors.textSecondary} />
        </View>

        <View style={styles.chartWrapper}>
          <LineChart
            areaChart
            curved
            data={lineChartData}
            width={chartWidth}
            height={160}
            spacing={chartWidth / 6.5}
            initialSpacing={12.5}
            color={colors.primary}
            thickness={3}
            startFillColor={colors.primary}
            endFillColor={colors.primaryUltraLight}
            startOpacity={0.4}
            endOpacity={0.1}
            noOfSections={3}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            dataPointsColor={BRAND_COLORS.primary}
            dataPointsRadius={5}
            focusedDataPointRadius={7}
            pointerConfig={{
              pointerStripHeight: 140,
              pointerStripColor: BRAND_COLORS.primary,
              pointerStripWidth: 2,
              pointerColor: BRAND_COLORS.primary,
              radius: 6,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={[styles.pointerLabel, { backgroundColor: colors.card, ...SHADOWS.md }]}>
                    <Text style={[typography.subheadMedium, { color: BRAND_COLORS.primary }]}>{items[0].value}%</Text>
                  </View>
                );
              },
            }}
          />
        </View>

        <View style={[styles.chartFooter, { borderTopColor: colors.border }]}>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>Avg Rate</Text>
            <Text style={[typography.subheadMedium, { color: colors.text }]}>
              {weeklyOverview?.overallRate ? `${Math.round(weeklyOverview.overallRate * 100)}%` : '0%'}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>Active Habits</Text>
            <Text style={[typography.subheadMedium, { color: colors.text }]}>{summary?.activeHabits || 0}</Text>
          </View>
        </View>
      </View>

      {/* Global Activity Heatmap */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card, ...SHADOWS.sm, marginTop: SPACING.xl }]}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[typography.title2, { color: colors.text }]}>Activity Heatmap</Text>
            <Text style={[typography.caption1, { color: colors.textSecondary }]}>Your consistency over time</Text>
          </View>
        </View>

        <View style={styles.heatmapWrapper}>
          <View style={styles.heatmapGrid}>
            {Array.from({ length: 70 }).map((_, i) => (
              <HeatmapCell key={i} level={Math.floor(Math.random() * 5)} colors={colors} />
            ))}
          </View>
          <View style={styles.heatmapLegend}>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>Less</Text>
            <View style={styles.legendCells}>
              {[0, 1, 2, 3, 4].map(l => <HeatmapCell key={l} level={l} colors={colors} />)}
            </View>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>More</Text>
          </View>
        </View>
      </View>

      {/* Habit Performance List */}
      <View style={{ marginTop: SPACING.xl, paddingHorizontal: LAYOUT.screenPaddingHorizontal }}>
        <View style={styles.sectionHeader}>
            <Text style={[typography.title2, { color: colors.text }]}>Habit Performance</Text>
            <Pressable style={styles.seeAllBtn}>
                <Text style={[typography.caption1, { color: BRAND_COLORS.primary }]}>See All</Text>
                <ChevronRight size={14} color={BRAND_COLORS.primary} />
            </Pressable>
        </View>

        {perHabit?.map((item: any, idx: number) => (
          <View key={item.habitId || idx} style={[styles.performanceRow, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
            <View style={[styles.perfIndicator, { backgroundColor: item.habitColor || BRAND_COLORS.primary }]} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>{item.habitName}</Text>
              <View style={styles.perfMeta}>
                <Flame size={12} color={SEMANTIC_COLORS.warning} />
                <Text style={[styles.perfMetaText, { color: colors.textSecondary }]}>{item.currentStreak}d streak</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
                <Text style={[typography.caption2, { color: colors.textSecondary, marginBottom: 4, textAlign: 'right' }]}>
                    {`${Math.round(item.completionRate * 100)}%`}
                </Text>
                <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={[styles.progressBarFill, { width: `${item.completionRate * 100}%`, backgroundColor: item.habitColor || BRAND_COLORS.primary }]} />
                </View>
            </View>
          </View>
        ))}
      </View>

      {/* Weekly Activity Bar Chart */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card, ...SHADOWS.sm, marginTop: SPACING.xl }]}>
        <Text style={[typography.title2, { color: colors.text, marginBottom: SPACING.md }]}>Activity by Habit</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={150}
            barWidth={24}
            noOfSections={3}
            barBorderRadius={6}
            spacing={SPACING.lg}
            initialSpacing={10}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
            renderTooltip={(item: any) => {
              return (
                <View style={[styles.tooltipContainer, { backgroundColor: colors.card, ...SHADOWS.md }]}>
                  <Text style={[typography.caption1, { color: colors.text }]}>{Math.round(item.value * 100)}%</Text>
                </View>
              );
            }}
          />
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    marginBottom: SPACING.xs,
  },
  timeSelector: {
    flexDirection: 'row',
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: 4,
    borderRadius: RADII.md,
    marginBottom: SPACING.lg,
  },
  timeBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADII.sm,
    alignItems: 'center',
  },
  statsScroll: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  statCard: {
    width: 140,
    padding: SPACING.md,
    borderRadius: RADII.lg,
    alignItems: 'flex-start',
  },
  statIconContainer: {
    padding: SPACING.sm,
    borderRadius: RADII.sm,
  },
  chartContainer: {
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerLabel: {
    padding: SPACING.sm,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    marginTop: -30,
  },
  tooltipContainer: {
    padding: SPACING.xs,
    borderRadius: RADII.xs,
    marginBottom: 4,
  },
  heatmapWrapper: {
    marginTop: SPACING.md,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  heatCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    gap: 8,
  },
  legendCells: {
    flexDirection: 'row',
    gap: 4,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerItem: {
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
  },
  perfIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  perfMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  perfMetaText: {
    fontSize: 10,
    fontWeight: '500',
  },
  progressContainer: {
    width: 80,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default AnalyticsScreen;
