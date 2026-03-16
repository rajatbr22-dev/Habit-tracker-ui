import React, {useState, useMemo} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Search,
  Mic,
  SlidersHorizontal,
  Flame,
  Plus,
  Check,
  ChevronRight,
  Archive,
  BookOpen,
  Droplets,
  Dumbbell,
  Brain,
  Timer,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';

// ──────────────────────────────────────────────
// Types & Mock Data
// ──────────────────────────────────────────────

interface Habit {
  id: string;
  name: string;
  category: string;
  meta: string;
  streak: number;
  completed: boolean;
  Icon: any;
}

const INITIAL_HABITS: Habit[] = [
  { 
    id: '1', 
    name: 'Morning Meditation', 
    category: 'Morning', 
    meta: '10 mins • Daily', 
    streak: 12, 
    completed: true, 
    Icon: Brain 
  },
  { 
    id: '2', 
    name: 'Read 20 Pages', 
    category: 'Daily', 
    meta: '20 pages • Daily', 
    streak: 5, 
    completed: true, 
    Icon: BookOpen 
  },
  { 
    id: '3', 
    name: 'Hydration Goal', 
    category: 'Health', 
    meta: '2.5L • Daily', 
    streak: 28, 
    completed: true, 
    Icon: Droplets 
  },
  { 
    id: '4', 
    name: 'Gym Session', 
    category: 'Health', 
    meta: '1 hour • 4x/week', 
    streak: 3, 
    completed: true, 
    Icon: Dumbbell 
  },
  { 
    id: '5', 
    name: 'Deep Work', 
    category: 'Work', 
    meta: '2 hours • Weekdays', 
    streak: 0, 
    completed: true, 
    Icon: Timer 
  },
];

const CATEGORIES = ['All', 'Morning', 'Health', 'Work', 'Daily'];

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const CategoryPill = ({
  label, 
  isActive, 
  onPress
}: {
  label: string; 
  isActive: boolean; 
  onPress: () => void;
}) => {
  const {colors, typography} = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryPill,
        {
          backgroundColor: isActive ? BRAND_COLORS.primary : colors.card,
          borderColor: isActive ? 'transparent' : '#F0F0F0',
          borderWidth: isActive ? 0 : 1,
        }
      ]}
    >
      <Text
        style={[
          typography.subheadMedium,
          {color: isActive ? '#FFF' : colors.textSecondary}
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const HabitCard = ({
  habit, 
  onToggle,
  onPress
}: {
  habit: Habit; 
  onToggle: () => void;
  onPress: () => void;
}) => {
  const {colors, typography} = useTheme();
  return (
    <View style={[styles.habitCard, {backgroundColor: colors.card, ...SHADOWS.sm}]}>
      <Pressable onPress={onPress} style={styles.habitMain}>
        <View style={styles.habitPrimaryInfo}>
          <Text style={[typography.bodyMedium, {color: colors.text, fontWeight: '700'}]}>
            {habit.name}
          </Text>
          <View style={styles.habitMetaRow}>
            <habit.Icon size={14} color={colors.textTertiary} />
            <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 6}]}>
              {habit.meta}
            </Text>
          </View>
        </View>

        <View style={styles.habitStreakInfo}>
          <View style={styles.streakLabelRow}>
            <Flame size={14} color="#FF7675" fill="#FF7675" />
            <Text style={[typography.bodyMedium, {color: colors.text, fontWeight: '700', marginLeft: 4}]}>
              {habit.streak}
            </Text>
          </View>
          <Text style={[typography.caption2, {color: colors.textSecondary}]}>
            day streak
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onToggle}
        style={[
          styles.checkBtn,
          {
            backgroundColor: habit.completed ? '#E0EBFF' : colors.surfaceAlt,
          }
        ]}
      >
        <Check
          size={20}
          color={habit.completed ? BRAND_COLORS.primary : colors.textTertiary}
          strokeWidth={3}
        />
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || habit.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, habits]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? {...h, completed: !h.completed} : h))
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <Text style={[typography.largeTitle, {color: colors.text, fontWeight: '800'}]}>
          My Habits
        </Text>
        <Pressable style={[styles.filterBtn, {backgroundColor: colors.surfaceAlt}]}>
          <SlidersHorizontal size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, {backgroundColor: colors.surfaceAlt}]}>
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, {color: colors.text, ...typography.body}]}
            placeholder="Search habits..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* <Mic size={20} color={colors.textTertiary} /> */}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Active Habits List */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.overline, {color: colors.textSecondary}]}>
            ACTIVE HABITS
          </Text>
          <Text style={[typography.caption2, {color: colors.textSecondary}]}>
            Swipe to edit
          </Text>
        </View>

        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={() => toggleHabit(habit.id)}
            onPress={() => navigation.navigate('HabitDetail', {habitId: habit.id})}
          />
        ))}

        {/* Archived Habits Footer */}
        <Pressable 
          style={[styles.archiveRow, {backgroundColor: colors.surfaceAlt}]}
          onPress={() => {}}
        >
          <View style={styles.archiveLeft}>
            <Archive size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, {color: colors.textSecondary, marginLeft: SPACING.md}]}>
              Archived Habits
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textTertiary} />
        </Pressable>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={[styles.fab, SHADOWS.xl, {backgroundColor: BRAND_COLORS.primary}]}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Plus size={20} color="#FFF" strokeWidth={3} />
        <Text style={[typography.buttonSmall, {color: '#FFF', marginLeft: 8}]}>
          Add Habit
        </Text>
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
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    borderRadius: RADII.xl,
    padding: SPACING.md,
    paddingLeft: SPACING.lg,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  habitMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.md,
  },
  habitPrimaryInfo: {
    flex: 1,
  },
  habitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  habitStreakInfo: {
    alignItems: 'flex-end',
    width: 80,
  },
  streakLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADII.lg,
  },
  archiveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
  },
});

export default HabitsListScreen;
