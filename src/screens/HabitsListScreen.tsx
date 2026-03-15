/**
 * HabitTracker – Habits List Screen
 *
 * Shows all habits with search, category filter pills,
 * streak counters, check-in buttons, and a floating "Add Habit" FAB.
 */

import React, {useState, useCallback} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../theme';
import {BRAND_COLORS, SEMANTIC_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';
import {DEFAULT_FILTER_CATEGORIES, CATEGORY_LABELS} from '../constants/habits';
import type {HabitCategory} from '../constants/habits';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface MockHabit {
  id: string;
  name: string;
  icon: string;
  meta: string;
  frequency: string;
  streak: number;
  completed: boolean;
}

// ──────────────────────────────────────────────
// Mock data (matching UI designs)
// ──────────────────────────────────────────────

const MOCK_HABITS: MockHabit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    icon: '🧘',
    meta: '10 mins',
    frequency: 'Daily',
    streak: 12,
    completed: true,
  },
  {
    id: '2',
    name: 'Read 20 Pages',
    icon: '📖',
    meta: '20 pages',
    frequency: 'Daily',
    streak: 5,
    completed: true,
  },
  {
    id: '3',
    name: 'Hydration Goal',
    icon: '💧',
    meta: '2.5L',
    frequency: 'Daily',
    streak: 28,
    completed: true,
  },
  {
    id: '4',
    name: 'Gym Session',
    icon: '🏋️',
    meta: '1 hour',
    frequency: '4x/week',
    streak: 3,
    completed: true,
  },
  {
    id: '5',
    name: 'Deep Work',
    icon: '🧠',
    meta: '2 hours',
    frequency: 'Weekdays',
    streak: 0,
    completed: true,
  },
];

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

/** A single filter chip */
const FilterChip: React.FC<{
  label: string;
  active: boolean;
  onPress: () => void;
}> = ({label, active, onPress}) => {
  const {colors, typography} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        chipStyles.chip,
        active
          ? {backgroundColor: BRAND_COLORS.primary}
          : {backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1},
      ]}>
      <Text
        style={[
          typography.subheadMedium,
          {color: active ? '#FFFFFF' : colors.text},
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.pill,
    marginRight: SPACING.sm,
  },
});

/** A single habit row card */
const HabitCard: React.FC<{habit: MockHabit; onPress: () => void}> = ({habit, onPress}) => {
  const {colors, typography} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        cardStyles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...SHADOWS.sm,
        },
      ]}>
      <View style={cardStyles.left}>
        <Text style={[typography.title3, {color: colors.text}]}>{habit.name}</Text>
        <View style={cardStyles.metaRow}>
          <Text style={{fontSize: 13}}>{habit.icon}</Text>
          <Text style={[typography.footnote, {color: colors.textSecondary, marginLeft: 4}]}>
            {habit.meta} • {habit.frequency}
          </Text>
        </View>
      </View>

      <View style={cardStyles.right}>
        {/* Streak */}
        <View style={cardStyles.streakCol}>
          <View style={cardStyles.streakRow}>
            <Text style={{fontSize: 13}}>🔥</Text>
            <Text
              style={[
                typography.title3,
                {color: SEMANTIC_COLORS.warning, marginLeft: 2},
              ]}>
              {habit.streak}
            </Text>
          </View>
          <Text style={[typography.caption2, {color: colors.textSecondary}]}>day streak</Text>
        </View>

        {/* Check-in circle */}
        <View
          style={[
            cardStyles.checkCircle,
            {
              backgroundColor: habit.completed
                ? SEMANTIC_COLORS.success
                : colors.surfaceAlt,
              borderColor: habit.completed
                ? SEMANTIC_COLORS.success
                : colors.border,
            },
          ]}>
          <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: '700'}}>
            {habit.completed ? '✓' : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: RADII.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.md,
  },
  left: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  streakCol: {
    alignItems: 'flex-end',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/** Top Progress Card */
const TodayProgress: React.FC = () => {
  const {colors, typography} = useTheme();
  return (
    <View style={[progressStyles.container, {backgroundColor: '#EFEEFF'}]}>
      <View style={progressStyles.left}>
        <PieChart
          donut
          radius={45}
          innerRadius={35}
          data={[
            {value: 4, color: BRAND_COLORS.primary},
            {value: 2, color: '#DCD9FF'},
          ]}
          centerLabelComponent={() => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={[typography.title2, {color: colors.text}]}>4/6</Text>
              <Text style={[typography.caption2, {color: colors.textSecondary}]}>Done</Text>
            </View>
          )}
        />
      </View>
      <View style={progressStyles.right}>
        <Text style={[typography.title2, {color: colors.text}]}>Almost there!</Text>
        <Text style={[typography.subhead, {color: colors.textSecondary, marginTop: 4}]}>
          {`Complete 2 more habits\nto reach your daily goal.`}
        </Text>
        <Pressable style={progressStyles.button}>
          <Text style={[typography.subheadMedium, {color: '#FFFFFF'}]}>Keep going 🔥</Text>
        </Pressable>
      </View>
    </View>
  );
};

const progressStyles = StyleSheet.create({
  container: {
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  left: {
    marginRight: SPACING.lg,
  },
  right: {
    flex: 1,
  },
  button: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.md,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
  },
});

// ──────────────────────────────────────────────
// HabitsListScreen
// ──────────────────────────────────────────────

interface HabitsListScreenProps {
  navigation?: any;
}

const HabitsListScreen: React.FC<HabitsListScreenProps> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HabitCategory>('all');

  const filteredHabits = MOCK_HABITS.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
      h.name.toLowerCase().includes(activeCategory.toLowerCase()) || // Very simple mapping for mock data
      (activeCategory === 'morning' && h.name === 'Morning Meditation') ||
      (activeCategory === 'health' && (h.name === 'Hydration Goal' || h.name === 'Gym Session')) ||
      (activeCategory === 'daily' && h.frequency === 'Daily') ||
      (activeCategory === 'work' && h.name === 'Deep Work');
    
    return matchesSearch && matchesCategory;
  });

  const renderHabit = useCallback(
    ({item}: {item: MockHabit}) => (
      <HabitCard 
        habit={item} 
        onPress={() => navigation?.navigate?.('HabitDetail', {habitId: item.id})} 
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: MockHabit) => item.id, []);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.headerBar,
          {paddingTop: insets.top + SPACING.md},
        ]}>
        <Text style={[typography.largeTitle, {color: colors.text}]}>My Habits</Text>
        <Pressable hitSlop={12}>
          <Text style={{fontSize: 20, color: colors.textSecondary}}>☰</Text>
        </Pressable>
      </View>

      {/* ── Today Progress Card ── */}
      <TodayProgress />

      {/* ── Search Bar ── */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
          },
        ]}>
        <Text style={{fontSize: 16, color: colors.textSecondary, marginRight: SPACING.sm}}>
          🔍
        </Text>
        <TextInput
          style={[styles.searchInput, {...typography.body, color: colors.text}]}
          placeholder="Search habits..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={{fontSize: 16, color: colors.textSecondary}}>🎤</Text>
      </View>

      {/* ── Category Filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}>
        {DEFAULT_FILTER_CATEGORIES.map(cat => (
          <FilterChip
            key={cat}
            label={CATEGORY_LABELS[cat]}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* ── Section Header ── */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            typography.overline,
            {color: colors.textSecondary, textTransform: 'uppercase'},
          ]}>
          ACTIVE HABITS
        </Text>
        <Text style={[typography.caption1, {color: colors.textSecondary}]}>Swipe to edit</Text>
      </View>

      {/* ── Habit List ── */}
      <FlatList
        data={filteredHabits}
        renderItem={renderHabit}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Pressable
            style={[
              styles.archivedRow,
              {borderTopColor: colors.border},
            ]}>
            <View style={styles.archivedLeft}>
              <Text style={{fontSize: 14, color: colors.textSecondary}}>📦</Text>
              <Text
                style={[
                  typography.body,
                  {color: colors.text, marginLeft: SPACING.sm},
                ]}>
                Archived Habits
              </Text>
            </View>
            <Text style={{fontSize: 16, color: colors.textSecondary}}>›</Text>
          </Pressable>
        }
      />

      {/* ── FAB ── */}
      <Pressable
        style={({pressed}) => [
          styles.fab,
          {
            backgroundColor: pressed
              ? BRAND_COLORS.primaryDark
              : BRAND_COLORS.primary,
            bottom: insets.bottom + SPACING.xl,
            ...SHADOWS.xl,
          },
        ]}
        onPress={() => navigation?.navigate?.('AddHabit')}>
        <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '600', marginRight: 6}}>+</Text>
        <Text style={[typography.buttonSmall, {color: '#FFFFFF'}]}>Add Habit</Text>
      </Pressable>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: RADII.sm,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    padding: 0,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: SPACING.md,
  },
  filterRow: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    marginBottom: SPACING.md,
  },
  listContent: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: 100, // space for FAB
  },
  archivedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: SPACING.sm,
  },
  archivedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADII.pill,
  },
});

export default HabitsListScreen;
