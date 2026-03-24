import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../theme';
import { SPACING, RADII, LAYOUT } from '../theme/spacing';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ style }: { style?: any }) => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.skeleton, opacity },
        style,
      ]}
    />
  );
};

export const AnalyticsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonItem style={styles.titleSkeleton} />
      </View>

      {/* Time Selector Skeleton */}
      <View style={[styles.timeSelector, { backgroundColor: colors.surfaceAlt }]}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonItem key={i} style={styles.timeBtnSkeleton} />
        ))}
      </View>

      <SkeletonItem style={styles.subtitleSkeleton} />

      {/* Stats Cards Skeleton */}
      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <SkeletonItem key={i} style={styles.statCardSkeleton} />
        ))}
      </View>

      {/* Chart Skeleton */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <SkeletonItem style={styles.chartHeaderSkeleton} />
        <SkeletonItem style={styles.chartBodySkeleton} />
      </View>

      {/* Performance List Skeleton */}
      <View style={styles.performanceContainer}>
        <SkeletonItem style={styles.performanceTitleSkeleton} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.performanceRow, { backgroundColor: colors.card }]}>
            <SkeletonItem style={styles.perfIndicatorSkeleton} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <SkeletonItem style={styles.perfTextSkeleton} />
              <SkeletonItem style={styles.perfSubtextSkeleton} />
            </View>
            <SkeletonItem style={styles.perfProgressSkeleton} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    marginBottom: SPACING.lg,
  },
  titleSkeleton: {
    width: 150,
    height: 34,
    borderRadius: RADII.sm,
  },
  timeSelector: {
    flexDirection: 'row',
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: 4,
    borderRadius: RADII.md,
    marginBottom: SPACING.lg,
  },
  timeBtnSkeleton: {
    flex: 1,
    height: 36,
    marginHorizontal: 2,
    borderRadius: RADII.sm,
  },
  subtitleSkeleton: {
    marginLeft: LAYOUT.screenPaddingHorizontal,
    width: 120,
    height: 16,
    borderRadius: 4,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCardSkeleton: {
    width: 120,
    height: 100,
    borderRadius: RADII.lg,
  },
  chartContainer: {
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    height: 250,
    marginBottom: SPACING.xl,
  },
  chartHeaderSkeleton: {
    width: 180,
    height: 24,
    borderRadius: 4,
    marginBottom: SPACING.lg,
  },
  chartBodySkeleton: {
    width: '100%',
    flex: 1,
    borderRadius: RADII.md,
  },
  performanceContainer: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  performanceTitleSkeleton: {
    width: 160,
    height: 24,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginBottom: SPACING.sm,
  },
  perfIndicatorSkeleton: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  perfTextSkeleton: {
    width: 140,
    height: 16,
    borderRadius: 4,
    marginBottom: 4,
  },
  perfSubtextSkeleton: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  perfProgressSkeleton: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
});
