/**
 * HabitTracker – Redesigned Habits List Screen
 * 
 * Matches the latest UI mockup with horizontal date picker,
 * sectioned habit lists, and Lucide icons.
 */

import React, {useState, useCallback} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Calendar,
  Flame,
  Plus,
  Check,
  ChevronDown,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';

// ──────────────────────────────────────────────
// Types & Mock Data
// ──────────────────────────────────────────────

interface MockHabit {
  id: string;
  name: string;
  meta: string;
  streak: number;
  completed: boolean;
  color: string;
}

const MOCK_HABITS: MockHabit[] = [
  { id: '1', name: 'Morning Meditation', meta: '12 Day Streak', streak: 12, completed: false, color: '#00CEC9' },
  { id: '2', name: 'Read 20 Pages', meta: '5 Day Streak', streak: 5, completed: false, color: '#6C5CE7' },
  { id: '3', name: 'Drink 2L Water', meta: '24 Day Streak', streak: 24, completed: true, color: '#0984E3' },
  { id: '4', name: 'Journaling', meta: '8 Day Streak', streak: 8, completed: true, color: '#E17055' },
  { id: '5', name: 'Vitamin Intake', meta: '45 Day Streak', streak: 45, completed: true, color: '#FDCB6E' },
  { id: '6', name: 'Evening Walk', meta: '3 Day Streak', streak: 3, completed: true, color: '#2ECC71' },
];

const DAYS = [
  { day: 'TH', date: 10 },
  { day: 'FR', date: 11 },
  { day: 'SA', date: 12 },
  { day: 'SU', date: 13 },
  { day: 'MO', date: 14, active: true },
  { day: 'TU', date: 15 },
  { day: 'WE', date: 16 },
];

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const DatePicker: React.FC = () => {
  const {colors, typography} = useTheme();
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.datePickerContainer}
    >
      {DAYS.map((item, idx) => (
        <View 
          key={idx} 
          style={[
            styles.dateBtn, 
            item.active && { backgroundColor: BRAND_COLORS.primary, transform: [{scale: 1.1}] }
          ]}
        >
          <Text style={[typography.overline, { color: item.active ? '#FFF' : colors.textSecondary, marginBottom: 4 }]}>
            {item.day}
          </Text>
          <Text style={[typography.title3, { color: item.active ? '#FFF' : colors.text, fontWeight: '700' }]}>
            {item.date}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const HabitCard: React.FC<{habit: MockHabit}> = ({habit}) => {
  const {colors, typography} = useTheme();
  return (
    <View style={[styles.habitCard, { backgroundColor: colors.card, ...SHADOWS.sm }]}>
      <View style={[styles.habitIndicator, { backgroundColor: habit.color }]} />
      <View style={styles.habitMain}>
        <Text style={[typography.bodyMedium, { color: colors.text }]}>{habit.name}</Text>
        <View style={styles.habitMeta}>
          <Flame size={12} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
          <Text style={[typography.caption1, { color: colors.textSecondary, marginLeft: 4 }]}>{habit.meta}</Text>
        </View>
      </View>
      <Pressable 
        style={[
          styles.actionBtn, 
          { 
            backgroundColor: habit.completed ? '#F5F5F7' : '#FFFFFF',
            borderColor: habit.completed ? 'transparent' : '#F0F0F0',
            borderWidth: habit.completed ? 0 : 1
          }
        ]}
      >
        {habit.completed ? (
          <Check size={20} color={colors.text} strokeWidth={2.5} />
        ) : (
          <Plus size={20} color={colors.text} strokeWidth={2} />
        )}
      </Pressable>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const HabitsListScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const toDoHabits = MOCK_HABITS.filter(h => !h.completed);
  const completedHabits = MOCK_HABITS.filter(h => h.completed);

  return (
    <View style={[styles.container, { backgroundColor: '#FBFCFD' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={[typography.title3, { color: colors.text, fontWeight: '700' }]}>Today</Text>
          <Text style={[typography.caption2, { color: colors.textSecondary }]}>Monday, 14 Mar</Text>
        </View>
        <Pressable>
          <Calendar color={colors.text} size={24} />
        </Pressable>
      </View>

      <DatePicker />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.chartWrapper}>
            <PieChart
              donut
              radius={45}
              innerRadius={36}
              data={[
                { value: 4, color: BRAND_COLORS.primary },
                { value: 2, color: '#DCD9FF' },
              ]}
              centerLabelComponent={() => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={[typography.title2, { color: colors.text, fontWeight: '700' }]}>4/6</Text>
                  <Text style={[typography.caption2, { color: colors.textSecondary }]}>Done</Text>
                </View>
              )}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={[typography.title2, { color: colors.text, fontWeight: '700' }]}>Almost there!</Text>
            <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: 4 }]}>
              Complete 2 more habits to reach your daily goal.
            </Text>
            <Pressable style={styles.keepGoingBtn}>
              <Text style={[typography.subheadMedium, { color: '#FFF' }]}>Keep going 🔥</Text>
            </Pressable>
          </View>
        </View>

        {/* To Do List */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>To Do</Text>
          <Text style={[typography.caption1, { color: colors.textSecondary }]}>{toDoHabits.length} Remaining</Text>
        </View>
        {toDoHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}

        {/* Completed List */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ChevronDown size={16} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginLeft: 8 }]}>Completed</Text>
          </View>
        </View>
        {completedHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </ScrollView>

      {/* FAB */}
      <Pressable 
        style={[styles.fab, SHADOWS.xl]} 
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Plus color="#FFF" size={20} strokeWidth={3} />
        <Text style={[typography.buttonSmall, { color: '#FFF', marginLeft: 8 }]}>New Habit</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  datePickerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  dateBtn: {
    width: 48,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  progressCard: {
    flexDirection: 'row',
    backgroundColor: '#EFEEFF',
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  chartWrapper: {
    marginRight: SPACING.lg,
  },
  progressInfo: {
    flex: 1,
  },
  keepGoingBtn: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.md,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  habitIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  habitMain: {
    flex: 1,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    backgroundColor: BRAND_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADII.pill,
  },
});

export default HabitsListScreen;
