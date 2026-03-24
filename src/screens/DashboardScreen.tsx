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
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.services';
import { useUIStore } from '../store/useUIStore';

const {width} = Dimensions.get('window');


const HabitCard = ({item, onPress}: {item: any, onPress: () => void}) => {

  const {colors, typography} = useTheme();

  // const userName = useAuthStore.getState().user?.name;

  return (
    <Pressable 
      onPress={onPress}
      style={[styles.habitCard, {backgroundColor: colors.card, borderColor: colors.border, ...SHADOWS.sm}]}
    >
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
          <Check size={16} color={item.progress === 1 ? colors.white : colors.textTertiary} strokeWidth={3} />
        </Pressable>
      </View>
    </Pressable>
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


const DashboardScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();
  const { notifications, addNotification, showAlert, hideAlert } = useUIStore();

  const userName = useAuthStore.getState().user?.displayName;

  // console.log(useAuthStore.getState().user.displayName, "useAuthStore")

  const {
    data: todayHabits, 
    isLoading: isLoadingTodayHabits, 
    error: errorTodayHabits
  } = useQuery({
    queryKey: ['daily habits'],
    queryFn: () => DashboardService.getTodayHabits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    
  })


  const {
    data: weeklyHabits, 
    isLoading: isLoadingWeeklyHabits, 
    error: errorWeeklyHabits
  } = useQuery({
    queryKey: ['weekly habits'],
    queryFn: () => DashboardService.getWeeklyHabits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })


  const {
    data: summaryHabits, 
    isLoading: isLoadingSummaryHabits, 
    error: errorSummaryHabits
  } = useQuery({
    queryKey: ['summary habits'],
    queryFn: () => DashboardService.getSummaryHabits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })


  const unreadCount = notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    // Mock a notification if none exists for demo
    if (notifications.length === 0) {
      const mockNotif = {
        title: 'Welcome to HabitTracker!',
        message: 'Start by adding your first habit to track your progress.',
        type: 'info' as const,
      };
      addNotification(mockNotif);
      showAlert(mockNotif);
    }
  }, []);
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <View style={styles.headerText}>
          <Text style={[typography.title1, {color: colors.text, fontWeight: '800'}]}>Welcome back,</Text>
          <Text style={[typography.title1, {color: BRAND_COLORS.primary, fontWeight: '800'}]}>{userName}</Text>
        </View>
        <Pressable 
          onPress={() => navigation.navigate('Notifications')}
          style={[styles.notifBtn, {backgroundColor: colors.surfaceAlt}]}
        >
          <Bell size={22} color={colors.text} />
          {unreadCount > 0 && <View style={[styles.notifDot, {backgroundColor: BRAND_COLORS.primary}]} />}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Today's Habits Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>Today's Habits</Text>

          <Pressable
            onPress={() => navigation.navigate('Habits')}
          > 
            {/* need to add here navigation to the all habit screen */}
            <Text style={[typography.subheadMedium, {color: BRAND_COLORS.primary}]}>See all</Text>
          </Pressable>

        </View>

        <FlatList
          data={todayHabits?.data}
          renderItem={({item}) => (
            <HabitCard 
              item={item} 
              onPress={() => navigation.navigate('HabitDetail', {habitId: item.id})}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitsList}
          keyExtractor={(item) => item.id}
        />

        {/* This Week Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700', flex: 1}]}>This Week</Text>
        </View>
        <View style={[styles.weekRow, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
          {weeklyHabits?.data.map((item: any) => (
            <View key={item.date} style={styles.weekDay}>
              <Text style={[typography.caption2, {color: colors.textSecondary, marginBottom: 8}]}>
                {item.day}
              </Text>
              <View 
                style={[
                  styles.weekCircle,
                  { backgroundColor: colors.surfaceAlt },
                  item.status === 'done' && {backgroundColor: colors.success},
                  item.status === 'missed' && {backgroundColor: colors.error},
                  item.status === 'active' && {borderColor: BRAND_COLORS.primary, borderWidth: 2, backgroundColor: 'transparent'},
                  item.status === 'pending' && {backgroundColor: colors.surfaceAlt},
                ]}
              >
                {item.status === 'done' && <Check size={12} color={colors.white} strokeWidth={4} />}
              </View>
            </View>
          ))}
        </View>

        {/* Streaks Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.title3, {color: colors.text, fontWeight: '700'}]}>Streaks</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard title="Longest Streak" value={summaryHabits?.data.longestStreak} icon={Flame} color="#FF7675" />
          <StatCard title="Global Rank" value={summaryHabits?.data.globalRank} icon={TrendingUp} color="#6C5CE7" />
          <StatCard title="Total Done" value={summaryHabits?.data.totalDone} icon={Check} color="#00B894" />
          <StatCard title="Completion" value={summaryHabits?.data.completionRate} icon={Target} color="#0984E3" />
        </View>

        {/* AI Tip Card - This is only for premium users */}
        <View style={[styles.aiCard, {backgroundColor: BRAND_COLORS.primary}]}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color={colors.white} />
            <Text style={[typography.subheadMedium, {color: colors.white, marginLeft: 8}]}>AI INSIGHTS · PRO</Text>
          </View>
          <Text style={[typography.body, {color: colors.white, marginTop: 12}]}>
            "You are 24% more likely to stick to your Morning Meditation if you do it before 8:00 AM."
          </Text>
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable 
        style={[styles.fab, {backgroundColor: BRAND_COLORS.primary}, SHADOWS.xl]}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Plus size={24} color={colors.white} strokeWidth={3} />
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
  headerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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
    paddingBottom: SPACING.xs,
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
