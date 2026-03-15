import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LineChart, BarChart} from 'react-native-gifted-charts';
import {useTheme} from '../theme';
import {BRAND_COLORS, SEMANTIC_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';

const {width} = Dimensions.get('window');

const AnalyticsScreen: React.FC = () => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const lineData = [
    {value: 65, label: 'Mon'},
    {value: 72, label: 'Tue'},
    {value: 68, label: 'Wed'},
    {value: 85, label: 'Thu'},
    {value: 92, label: 'Fri'},
    {value: 88, label: 'Sat'},
    {value: 95, label: 'Sun'},
  ];

  const barData = [
    {value: 4, label: 'M', frontColor: BRAND_COLORS.primaryLight},
    {value: 5, label: 'T', frontColor: BRAND_COLORS.primaryLight},
    {value: 7, label: 'W', frontColor: BRAND_COLORS.primaryLight},
    {value: 8, label: 'T', frontColor: BRAND_COLORS.primary},
    {value: 6, label: 'F', frontColor: BRAND_COLORS.primaryLight},
    {value: 4, label: 'S', frontColor: BRAND_COLORS.primaryLight},
    {value: 3, label: 'S', frontColor: BRAND_COLORS.primaryLight},
  ];

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={{paddingTop: insets.top + SPACING.md, paddingBottom: SPACING['2xl']}}
    >
      <View style={styles.header}>
        <Text style={[typography.largeTitle, {color: colors.text}]}>Analytics</Text>
        <Pressable style={[styles.dateSelector, {backgroundColor: colors.surfaceAlt, borderColor: colors.border}]}>
          <Text style={[typography.subheadMedium, {color: colors.text}]}>📅 Last 30 Days</Text>
        </Pressable>
      </View>

      <Text style={[typography.subhead, {color: colors.textSecondary, marginLeft: LAYOUT.screenPaddingHorizontal, marginBottom: SPACING.lg}]}>
        March 2024 Overview
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
          <View style={styles.statHeader}>
            <Text style={{fontSize: 14}}>✅</Text>
            <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 4}]}>Completion</Text>
          </View>
          <Text style={[typography.title1, {color: colors.text}]}>84%</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
          <View style={styles.statHeader}>
            <Text style={{fontSize: 14}}>🔥</Text>
            <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 4}]}>Best Streak</Text>
          </View>
          <Text style={[typography.title1, {color: colors.text}]}>12d</Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
          <View style={styles.statHeader}>
            <Text style={{fontSize: 14}}>📈</Text>
            <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 4}]}>Global Rank</Text>
          </View>
          <Text style={[typography.title1, {color: colors.text}]}>Top 5%</Text>
        </View>
      </View>

      {/* Completion Trend Chart */}
      <View style={[styles.chartContainer, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
        <View style={styles.chartHeader}>
          <Text style={[typography.title2, {color: colors.text}]}>Completion Trend</Text>
          <Text style={{fontSize: 16, color: colors.textSecondary}}>ⓘ</Text>
        </View>
        
        <View style={styles.chartWrapper}>
          <LineChart
            data={lineData}
            width={width - (LAYOUT.screenPaddingHorizontal * 4) - 40}
            height={160}
            initialSpacing={20}
            color={BRAND_COLORS.primary}
            thickness={3}
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
            dataPointsRadius={4}
            curved
          />
        </View>

        <View style={styles.chartFooter}>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>This Week</Text>
            <Text style={[typography.subheadMedium, {color: SEMANTIC_COLORS.success}]}>+12%</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>Avg Daily</Text>
            <Text style={[typography.subheadMedium, {color: colors.text}]}>5.2 habits</Text>
          </View>
        </View>
      </View>

      {/* Activity by Day Bar Chart */}
      <View style={[styles.chartContainer, {backgroundColor: colors.card, ...SHADOWS.sm, marginTop: SPACING.lg}]}>
        <Text style={[typography.title2, {color: colors.text, marginBottom: SPACING.md}]}>Activity by Day</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={barData}
            width={width - (LAYOUT.screenPaddingHorizontal * 4) - 40}
            height={150}
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor={BRAND_COLORS.primary}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            hideYAxisText
            xAxisLabelTextStyle={{color: colors.textSecondary, fontSize: 10}}
          />
        </View>
      </View>

      {/* Habit Performance List mockup part */}
      <View style={{marginTop: SPACING.xl, paddingHorizontal: LAYOUT.screenPaddingHorizontal}}>
         <Text style={[typography.title2, {color: colors.text, marginBottom: SPACING.md}]}>Habit Performance</Text>
         {[
           {name: 'Morning Meditation', progress: 0.95, color: SEMANTIC_COLORS.info},
           {name: 'Read 20 Pages', progress: 0.78, color: '#A29BFE'},
           {name: 'High Intensity Gym', progress: 0.62, color: SEMANTIC_COLORS.error},
           {name: 'Deep Work Session', progress: 0.88, color: SEMANTIC_COLORS.success},
         ].map((item, idx) => (
           <View key={idx} style={[styles.performanceRow, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
              <View style={[styles.perfIndicator, {backgroundColor: item.color}]} />
              <View style={{flex: 1, marginLeft: SPACING.md}}>
                 <Text style={[typography.bodyMedium, {color: colors.text}]}>{item.name}</Text>
                 <Text style={[typography.caption2, {color: colors.textSecondary}]}>{`${Math.round(item.progress * 100)}% completion`}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {width: `${item.progress * 100}%`, backgroundColor: item.color}]} />
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
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADII.md,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  chartContainer: {
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
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
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default AnalyticsScreen;
