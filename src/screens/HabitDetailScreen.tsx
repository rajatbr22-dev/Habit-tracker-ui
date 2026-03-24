import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';
import { 
  ChevronLeft, 
  Pencil, 
  Flame, 
  Sparkles, 
  Archive,
  Info
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { BRAND_COLORS } from '../theme/colors';
import { RADII, SHADOWS, SPACING } from '../theme/spacing';
import { useQuery } from '@tanstack/react-query';
import HabitService from '../services/habit.services';

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

const HeatmapCell = ({ date, data, colors }: { date: string, data: any, colors: any }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    setShowTooltip(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <View style={styles.cellContainer}>
      <Pressable onPress={handlePress}>
        <AnimatedView
          style={[
            styles.heatCell,
            {
              backgroundColor: data?.completed
                ? BRAND_COLORS.primary
                : colors.surfaceAlt,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </Pressable>
      {showTooltip && (
        <View style={[styles.tooltip, { backgroundColor: colors.card, ...SHADOWS.md }]}>
          <Text style={[styles.tooltipText, { color: colors.text }]}>{date}</Text>
          <Text style={[styles.tooltipStatus, { color: data?.completed ? colors.success : colors.textSecondary }]}>
            {data?.completed ? 'Complted' : 'Missed'}
          </Text>
        </View>
      )}
    </View>
  );
};

const HabitDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { habitId } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const { data: habitData, isLoading, error } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => HabitService.getDetailedHabit(habitId),

    staleTime: 0,        // always stale
    gcTime: 0,        // do not keep cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isLoading && habitData) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, habitData]);

  const habit = habitData?.data?.habit;
  const analytics = habitData?.data?.analytics;

  const completionRate = analytics?.completionRate || 0;
  const currentMonth = analytics?.monthlyProgress?.slice(-1)[0];

  const pieData = [
    { value: completionRate, color: BRAND_COLORS.primary },
    { value: 100 - completionRate, color: BRAND_COLORS.primaryUltraLight },
  ];

  // Prepare heatmap data: last 35 days or so
  const heatmapEntries = Object.entries(analytics?.heatmapData || {})
    .sort((a, b) => b[0].localeCompare(a[0])) // Most recent first
    .slice(0, 35)
    .reverse();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.title2, { color: colors.text, fontWeight: '700' }]}>Details</Text>
        <Pressable style={styles.editButton}>
          <Pencil size={20} color={colors.text} />
        </Pressable>
      </View>

      <AnimatedView
        style={[
          styles.scrollWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Streak Circle */}
          <View style={styles.streakContainer}>
            <PieChart
              donut
              radius={80}
              innerRadius={70}
              data={pieData}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Flame size={24} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
                    <Text style={[typography.largeTitle, { color: colors.text }]}>{habit?.longestStreak || 0}</Text>
                    <Text style={[typography.caption2, { color: colors.textSecondary }]}>DAY STREAK</Text>
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.titleSection}>
            <Text style={[typography.title1, { color: colors.text, textAlign: 'center' }]}>{habit?.name}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: colors.primaryUltraLight }]}>
                <Text style={[typography.caption1, { color: colors.primary }]}>{habit?.category}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.successLight }]}>
                <Text style={[typography.caption1, { color: colors.success }]}>{analytics?.completionRate}% Success</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.smallStatCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>Total Days</Text>
              <Text style={[typography.title3, { color: colors.text }]}>{analytics?.totalCheckIns || 0}</Text>
            </View>
            <View style={[styles.smallStatCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>Best Streak</Text>
              <Text style={[typography.title3, { color: colors.text }]}>{habit?.longestStreak || 0} days</Text>
            </View>
            <View style={[styles.smallStatCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>Completion</Text>
              <Text style={[typography.title3, { color: colors.text }]}>{analytics?.completionRate || 0}%</Text>
            </View>
            <View style={[styles.smallStatCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>This Month</Text>
              <Text style={[typography.title3, { color: colors.text }]}>{currentMonth?.percentage || 0}%</Text>
            </View>
          </View>

          {/* Activity History Heatmap */}
          <View style={[styles.section, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[typography.title2, { color: colors.text }]}>Activity History</Text>
                <Text style={[typography.caption1, { color: colors.textSecondary }]}>Last 5 Weeks</Text>
              </View>
              <Pressable>
                <Info size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.heatmapGrid}>
              {heatmapEntries.map(([date, val]) => (
                <HeatmapCell key={date} date={date} data={val} colors={colors} />
              ))}
            </View>

            <View style={styles.heatLegend}>
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>Less</Text>
              <View style={[styles.heatCell, { backgroundColor: colors.surfaceAlt }]} />
              <View style={[styles.heatCell, { backgroundColor: BRAND_COLORS.primaryLight }]} />
              <View style={[styles.heatCell, { backgroundColor: BRAND_COLORS.primary }]} />
              <Text style={[typography.caption2, { color: colors.textSecondary }]}>More</Text>
            </View>
          </View>

          {/* AI performance tip */}
          <View style={[styles.tipCard, { backgroundColor: colors.primary }]}>
            <Sparkles size={20} color="#FFF" />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[typography.subheadMedium, { color: colors.white }]}>AI Performance Tip</Text>
              <Text style={[typography.caption1, { color: colors.primaryUltraLight }]}>
                {`You're 24% more likely to complete this habit when you do it before 9:00 AM.`}
              </Text>
            </View>
          </View>

          <Pressable style={[styles.archiveButton, { borderColor: colors.border }]}>
            <Archive size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.textSecondary }}>Archive Habit</Text>
          </Pressable>
        </ScrollView>
      </AnimatedView>
    </View>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  editButton: {
    padding: SPACING.xs,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING['2xl'],
  },
  streakContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADII.pill,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  smallStatCard: {
    width: (Dimensions.get('window').width - SPACING.lg * 2 - SPACING.md) / 2,
    padding: SPACING.lg,
    borderRadius: RADII.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  section: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  cellContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  heatCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  tooltip: {
    position: 'absolute',
    bottom: 20,
    padding: 8,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tooltipStatus: {
    fontSize: 10,
  },
  heatLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  tipCard: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  archiveButton: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitDetailScreen;
