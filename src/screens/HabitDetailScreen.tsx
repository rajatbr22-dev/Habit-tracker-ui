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
import {PieChart} from 'react-native-gifted-charts';
import {useTheme} from '../theme';
import {BRAND_COLORS, SEMANTIC_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';

const HabitDetailScreen: React.FC<{route: any, navigation: any}> = ({route, navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();
  
  // Mock data for the habit
  const habit = {
    name: 'Morning Meditation',
    category: 'Daily',
    successRate: '92%',
    streak: 24,
    totalDays: 142,
    bestStreak: 31,
    completion: '88%',
    thisMonth: '18/22',
  };

  const pieData = [
    {value: 70, color: BRAND_COLORS.primary, text: '24'},
    {value: 30, color: BRAND_COLORS.primaryUltraLight},
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{fontSize: 24, color: colors.text}}>‹</Text>
        </Pressable>
        <Text style={[typography.title2, {color: colors.text}]}>Habit Details</Text>
        <Pressable style={styles.editButton}>
          <Text style={{fontSize: 20, color: colors.text}}>✎</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Streak Circle */}
        <View style={styles.streakContainer}>
          <PieChart
            donut
            radius={80}
            innerRadius={70}
            data={pieData}
            centerLabelComponent={() => {
              return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 24}}>🔥</Text>
                  <Text style={[typography.largeTitle, {color: colors.text}]}>{habit.streak}</Text>
                  <Text style={[typography.caption2, {color: colors.textSecondary}]}>DAY STREAK</Text>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.titleSection}>
          <Text style={[typography.title1, {color: colors.text, textAlign: 'center'}]}>{habit.name}</Text>
          <View style={styles.badgeRow}>
             <View style={[styles.badge, {backgroundColor: '#EFEEFF'}]}>
                <Text style={[typography.caption1, {color: BRAND_COLORS.primary}]}>{habit.category}</Text>
             </View>
             <View style={[styles.badge, {backgroundColor: '#E7F9EE'}]}>
                <Text style={[typography.caption1, {color: SEMANTIC_COLORS.success}]}>{habit.successRate} Success</Text>
             </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.smallStatCard, {backgroundColor: colors.card}]}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>Total Days</Text>
            <Text style={[typography.title3, {color: colors.text}]}>{habit.totalDays}</Text>
          </View>
          <View style={[styles.smallStatCard, {backgroundColor: colors.card}]}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>Best Streak</Text>
            <Text style={[typography.title3, {color: colors.text}]}>{habit.bestStreak} days</Text>
          </View>
          <View style={[styles.smallStatCard, {backgroundColor: colors.card}]}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>Completion</Text>
            <Text style={[typography.title3, {color: colors.text}]}>{habit.completion}</Text>
          </View>
          <View style={[styles.smallStatCard, {backgroundColor: colors.card}]}>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>This Month</Text>
            <Text style={[typography.title3, {color: colors.text}]}>{habit.thisMonth}</Text>
          </View>
        </View>

        {/* Activity History Heatmap mockup */}
        <View style={[styles.section, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
           <View style={styles.sectionHeader}>
              <Text style={[typography.title2, {color: colors.text}]}>Activity History</Text>
              <Text style={[typography.caption1, {color: colors.textSecondary}]}>Last 12 Months</Text>
           </View>
           
           {/* Heatmap mockup using small views */}
           <View style={styles.heatmapGrid}>
              {Array.from({length: 35}).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.heatCell, 
                    {backgroundColor: i % 7 === 0 ? colors.surfaceAlt : (i % 3 === 0 ? BRAND_COLORS.primaryLight : BRAND_COLORS.primary)}
                  ]} 
                />
              ))}
           </View>
           
           <View style={styles.heatLegend}>
              <Text style={[typography.caption2, {color: colors.textSecondary}]}>Less</Text>
              <View style={[styles.heatCell, {backgroundColor: BRAND_COLORS.primaryUltraLight}]} />
              <View style={[styles.heatCell, {backgroundColor: BRAND_COLORS.primaryLight}]} />
              <View style={[styles.heatCell, {backgroundColor: BRAND_COLORS.primary}]} />
              <Text style={[typography.caption2, {color: colors.textSecondary}]}>More</Text>
           </View>
        </View>

        {/* AI performance tip mockup */}
        <View style={[styles.tipCard, {backgroundColor: BRAND_COLORS.primary}]}>
           <Text style={{fontSize: 20}}>✨</Text>
           <View style={{flex: 1, marginLeft: SPACING.md}}>
              <Text style={[typography.subheadMedium, {color: '#FFFFFF'}]}>AI Performance Tip</Text>
              <Text style={[typography.caption1, {color: BRAND_COLORS.primaryUltraLight}]}>
                {`You're 24% more likely to complete this habit when you do it before 9:00 AM.`}
              </Text>
           </View>
        </View>

        <Pressable style={[styles.archiveButton, {borderColor: colors.border}]}>
          <Text style={{color: colors.textSecondary}}>📦 Archive Habit</Text>
        </Pressable>
      </ScrollView>
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
    borderColor: '#EEEEEE',
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
    gap: 4,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  heatCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
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
