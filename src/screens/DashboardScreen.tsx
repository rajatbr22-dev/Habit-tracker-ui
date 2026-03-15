import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PieChart} from 'react-native-gifted-charts';
import {
  Bell,
  Check,
  Flame,
  Plus,
  Sparkles,
  TrendingUp,
  Target,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';

const {width} = Dimensions.get('window');

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

const TODAY_HABITS = [
  {id: '1', name: 'Meditation', streak: 12, progress: 0.7, color: '#6C5CE7'},
  {id: '2', name: 'Drink Water', streak: 5, progress: 0.4, color: '#0984E3'},
  {id: '3', name: 'Grateful', streak: 24, progress: 1.0, color: '#00CEC9'},
  {id: '4', name: 'Gym', streak: 3, progress: 0.2, color: '#E17055'},
];

const WEEK_DAYS = [
  {day: 'M', status: 'done'},
  {day: 'T', status: 'done'},
  {day: 'W', status: 'missed'},
  {day: 'T', status: 'done'},
  {day: 'F', status: 'active'},
  {day: 'S', status: 'pending'},
  {day: 'S', status: 'pending'},
];

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const HabitCard = ({item}: {item: typeof TODAY_HABITS[0]}) => {
  const {colors, typography} = useTheme();
  return (
    <View style={[styles.habitCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
      <View style={styles.chartContainer}>
        <PieChart
          donut
          radius={32}
          innerRadius={26}
          data={[
            {value: item.progress * 100, color: item.color},
            {value: (1 - item.progress) * 100, color: colors.surfaceAlt},
          ]}
          centerLabelComponent={() => (
            <Text style={[typography.caption2, {fontWeight: '700', color: colors.text}]}>
              {Math.round(item.progress * 100)}%
            </Text>
          )}
        />
      </View>
      <Text style={[typography.bodyMedium, styles.habitName, {color: colors.text}]} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.habitFooter}>
        <View style={styles.streakRow}>
          <Flame size={12} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
          <Text style={[typography.caption2, {color: colors.textSecondary, marginLeft: 4}]}>
            {item.streak}d
          </Text>
        </View>
        <Pressable 
          style={[
            styles.checkBtn, 
            {backgroundColor: item.progress === 1 ? colors.success : colors.surfaceAlt}
          ]}
        >
          <Check size={16} color={item.progress === 1 ? '#FFF' : colors.textTertiary} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
};

const StatCard = ({title, value, icon: Icon, color}: any) => {
  const {colors, typography} = useTheme();
  return (
    <View style={[styles.statCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
      <View style={[styles.statIconWrapper, {backgroundColor: colors.surfaceAlt}]}>
        <Icon size={18} color={color} />
      </View>
      <View style={{marginTop: SPACING.md}}>
        <Text style={[typography.caption1, {color: colors.textSecondary}]}>{title}</Text>
        <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>{value}</Text>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const DashboardScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <View>
          <Text style={[typography.title1, {color: colors.text, fontWeight: '800'}]}>Good morning,</Text>
          <Text style={[typography.title1, {color: BRAND_COLORS.primary, fontWeight: '800'}]}>Alex</Text>
        </View>
        <Pressable style={[styles.notifBtn, {backgroundColor: colors.surfaceAlt}]}>
          <Bell size={22} color={colors.text} />
          <View style={[styles.notifDot, {backgroundColor: BRAND_COLORS.primary}]} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Today's Habits Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>Today's Habits</Text>
          <Pressable>
            <Text style={[typography.subheadMedium, {color: BRAND_COLORS.primary}]}>See all</Text>
          </Pressable>
        </View>

        <FlatList
          data={TODAY_HABITS}
          renderItem={({item}) => <HabitCard item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitsList}
          keyExtractor={(item) => item.id}
        />

        {/* This Week Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>This Week</Text>
        </View>
        <View style={[styles.weekRow, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
          {WEEK_DAYS.map((item, idx) => (
            <View key={idx} style={styles.weekDay}>
              <Text style={[typography.caption2, {color: colors.textSecondary, marginBottom: 8}]}>
                {item.day}
              </Text>
              <View 
                style={[
                  styles.weekCircle,
                  item.status === 'done' && {backgroundColor: colors.success},
                  item.status === 'missed' && {backgroundColor: colors.error},
                  item.status === 'active' && {borderColor: BRAND_COLORS.primary, borderWidth: 2},
                  item.status === 'pending' && {backgroundColor: colors.surfaceAlt},
                ]}
              >
                {item.status === 'done' && <Check size={12} color="#FFF" strokeWidth={4} />}
              </View>
            </View>
          ))}
        </View>

        {/* Streaks Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>Streaks</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard title="Longest Streak" value="32 Days" icon={Flame} color="#FF7675" />
          <StatCard title="Global Rank" value="Top 5%" icon={TrendingUp} color="#6C5CE7" />
          <StatCard title="Total Done" value="142" icon={Check} color="#00B894" />
          <StatCard title="Completion" value="92%" icon={Target} color="#0984E3" />
        </View>

        {/* AI Tip Card */}
        <View style={[styles.aiCard, {backgroundColor: BRAND_COLORS.primary}]}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color="#FFF" />
            <Text style={[typography.subheadMedium, {color: '#FFF', marginLeft: 8}]}>AI INSIGHTS · PRO</Text>
          </View>
          <Text style={[typography.body, {color: '#FFF', marginTop: 12}]}>
            "You are 24% more likely to stick to your Morning Meditation if you do it before 8:00 AM."
          </Text>
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable 
        style={[styles.fab, {backgroundColor: BRAND_COLORS.primary}, SHADOWS.xl]}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Plus size={24} color="#FFF" strokeWidth={3} />
      </Pressable>
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
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  habitsList: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  habitCard: {
    width: 160,
    height: 180,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  chartContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  habitName: {
    fontWeight: '700',
    marginBottom: SPACING.sm,
    width: '100%',
    textAlign: 'center',
  },
  habitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekRow: {
    marginHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: RADII.xl,
  },
  weekDay: {
    alignItems: 'center',
  },
  weekCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  statCard: {
    width: (width - SPACING.xl * 2 - SPACING.md) / 2,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
