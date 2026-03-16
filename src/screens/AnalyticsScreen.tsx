import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import {
  Calendar,
  CheckCircle,
  Flame,
  TrendingUp,
  Info
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { BRAND_COLORS, SEMANTIC_COLORS } from '../theme/colors';
import { RADII, SHADOWS, SPACING, LAYOUT } from '../theme/spacing';

const { width } = Dimensions.get('window');

const AnalyticsScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState('Week');

  const DATA_BY_RANGE: any = {
    Day: {
      line: [
        { value: 60, label: '08:00' },
        { value: 75, label: '12:00' },
        { value: 65, label: '16:00' },
        { value: 90, label: '20:00' },
      ],
      bar: [
        { value: 2, label: 'AM', frontColor: BRAND_COLORS.primary },
        { value: 4, label: 'PM', frontColor: BRAND_COLORS.primaryLight },
      ],
      spacing: (width - 60) / 4,
    },
    Week: {
      line: [
        { value: 65, label: 'Mon' },
        { value: 72, label: 'Tue' },
        { value: 68, label: 'Wed' },
        { value: 85, label: 'Thu' },
        { value: 92, label: 'Fri' },
        { value: 88, label: 'Sat' },
        { value: 95, label: 'Sun' },
      ],
      bar: [
        { value: 4, label: 'Mon', frontColor: BRAND_COLORS.primaryLight },
        { value: 5, label: 'Tue', frontColor: BRAND_COLORS.primaryLight },
        { value: 7, label: 'Wed', frontColor: BRAND_COLORS.primaryLight },
        { value: 8, label: 'Thu', frontColor: BRAND_COLORS.primary },
        { value: 6, label: 'Fri', frontColor: BRAND_COLORS.primaryLight },
        { value: 4, label: 'Sat', frontColor: BRAND_COLORS.primaryLight },
        { value: 3, label: 'Sun', frontColor: BRAND_COLORS.primaryLight },
      ],
      spacing: (width - 100) / 7,
    },
    Month: {
      line: [
        { value: 50, label: 'W1' },
        { value: 70, label: 'W2' },
        { value: 65, label: 'W3' },
        { value: 85, label: 'W4' },
      ],
      bar: [
        { value: 15, label: 'W1', frontColor: BRAND_COLORS.primaryLight },
        { value: 22, label: 'W2', frontColor: BRAND_COLORS.primaryLight },
        { value: 18, label: 'W3', frontColor: BRAND_COLORS.primaryLight },
        { value: 26, label: 'W4', frontColor: BRAND_COLORS.primary },
      ],
      spacing: (width - 60) / 4,
    },
    Year: {
      line: [
        { value: 40, label: 'Q1' },
        { value: 60, label: 'Q2' },
        { value: 55, label: 'Q3' },
        { value: 80, label: 'Q4' },
      ],
      bar: [
        { value: 45, label: 'Q1', frontColor: BRAND_COLORS.primaryLight },
        { value: 70, label: 'Q2', frontColor: BRAND_COLORS.primaryLight },
        { value: 65, label: 'Q3', frontColor: BRAND_COLORS.primaryLight },
        { value: 95, label: 'Q4', frontColor: BRAND_COLORS.primary },
      ],
      spacing: (width - 60) / 4,
    },
  };

  const currentData = DATA_BY_RANGE[timeRange];

  const chartWidth = width - (LAYOUT.screenPaddingHorizontal * 2) - SPACING.lg * 2;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + SPACING.md, paddingBottom: SPACING['2xl'] }}
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
                { color: timeRange === range ? BRAND_COLORS.primary : colors.textSecondary },
              ]}
            >
              {range}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[typography.subhead, { color: colors.textSecondary, marginLeft: LAYOUT.screenPaddingHorizontal, marginBottom: SPACING.lg }]}>
        March 2024 Overview
      </Text>

      {/* Stats Grid - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: BRAND_COLORS.primaryUltraLight }]}>
            <CheckCircle size={16} color={BRAND_COLORS.primary} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Completion</Text>
          <Text style={[typography.title1, { color: colors.text }]}>84%</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF4E5' }]}>
            <Flame size={16} color={SEMANTIC_COLORS.warning} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Best Streak</Text>
          <Text style={[typography.title1, { color: colors.text }]}>12d</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: '#EEF2FF' }]}>
            <TrendingUp size={16} color={SEMANTIC_COLORS.info} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Top Percent</Text>
          <Text style={[typography.title1, { color: colors.text }]}>Top 5%</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F0FDF4' }]}>
            <Calendar size={16} color={colors.success} />
          </View>
          <Text style={[typography.caption1, { color: colors.textSecondary, marginTop: SPACING.sm }]}>Total Days</Text>
          <Text style={[typography.title1, { color: colors.text }]}>32</Text>
        </View>
      </ScrollView>

      {/* Completion Trend Chart */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
        <View style={styles.chartHeader}>
          <Text style={[typography.title2, { color: colors.text }]}>Completion Trend</Text>
          <Info size={16} color={colors.textSecondary} />
        </View>

        <View style={styles.chartWrapper}>
          <LineChart
            areaChart
            curved
            data={currentData.line}
            width={chartWidth}
            height={160}
            spacing={chartWidth / 6.5}
            initialSpacing={12.5}
            color={BRAND_COLORS.primary}
            thickness={2}
            startFillColor={BRAND_COLORS.primary}
            endFillColor={BRAND_COLORS.primaryUltraLight}
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
                    {/* <Text style={[typography.caption2, {color: colors.text}]}>{items[0].label}</Text> */}
                    <Text style={[typography.subheadMedium, { color: BRAND_COLORS.primary }]}>{items[0].value}%</Text>
                  </View>
                );
              },
            }}
          />
        </View>

        <View style={[styles.chartFooter, { borderTopColor: colors.border }]}>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>This Week</Text>
            <Text style={[typography.subheadMedium, { color: colors.success }]}>+12%</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, { color: colors.textSecondary }]}>Avg Daily</Text>
            <Text style={[typography.subheadMedium, { color: colors.text }]}>5.2 habits</Text>
          </View>
        </View>
      </View>

      {/* Activity by Day Bar Chart */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card, ...SHADOWS.sm, marginTop: SPACING.lg }]}>
        <Text style={[typography.title2, { color: colors.text, marginBottom: SPACING.md }]}>Activity by Day</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={currentData.bar}
            width={chartWidth}
            height={150}
            barWidth={24}
            noOfSections={3}
            barBorderRadius={6}
            spacing={(chartWidth - (24 * 7)) / 7}
            initialSpacing={10}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
            renderTooltip={(item: any) => {
              return (
                <View style={[styles.tooltipContainer, { backgroundColor: colors.card, ...SHADOWS.md }]}>
                  <Text style={[typography.caption1, { color: colors.text }]}>{item.value} habits</Text>
                </View>
              );
            }}
          />
        </View>
      </View>

      {/* Habit Performance List mockup part */}
      <View style={{ marginTop: SPACING.xl, paddingHorizontal: LAYOUT.screenPaddingHorizontal }}>
        <Text style={[typography.title2, { color: colors.text, marginBottom: SPACING.md }]}>Habit Performance</Text>
        {[
          { name: 'Morning Meditation', progress: 0.95, color: SEMANTIC_COLORS.info },
          { name: 'Read 20 Pages', progress: 0.78, color: '#A29BFE' },
          { name: 'High Intensity Gym', progress: 0.62, color: SEMANTIC_COLORS.error },
          { name: 'Deep Work Session', progress: 0.88, color: SEMANTIC_COLORS.success },
        ].map((item, idx) => (
          <View key={idx} style={[styles.performanceRow, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
            <View style={[styles.perfIndicator, { backgroundColor: item.color }]} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[typography.bodyMedium, { color: colors.text }]}>{item.name}</Text>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>{`${Math.round(item.progress * 100)}% completion`}</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceAlt }]}>
              <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        ))}
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.sm,
    borderWidth: 1,
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
  progressBarBg: {
    width: 80,
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
