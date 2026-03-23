import React, {useState, useMemo, useRef} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
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
  Edit2,
  Trash2,
  ArchiveX,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';
import { useMutation, useQuery } from '@tanstack/react-query';
import HabitService from '../services/habit.services';
import { CheckInPayload, YYYYMMDD } from '../types';
import { useDebounce } from '../hooks/debounce';
import Loader from '../components/Loader';
import ErrorView from '../components/ErrorView';
import EmptyState from '../components/EmptyState';

// ──────────────────────────────────────────────
// Types & Mock Data
// ──────────────────────────────────────────────

interface Habit {
  id: string;
  name: string;
  category: string;
  meta: string | null;
  currentStreak: number;
  completed: boolean;
  isArchived: boolean;
  icon: string;
}

const INITIAL_HABITS: Habit[] = [   
  { 
    id: '1', 
    name: 'Morning Meditation', 
    category: 'Morning', 
    meta: '10 mins • Daily', 
    currentStreak: 12, 
    completed: true, 
    isArchived: false,
    Icon: Brain 
  },
  { 
    id: '2', 
    name: 'Read 20 Pages', 
    category: 'Daily', 
    meta: '20 pages • Daily', 
    streak: 5, 
    completed: true, 
    isArchived: false,
    Icon: BookOpen 
  },
  { 
    id: '3', 
    name: 'Hydration Goal', 
    category: 'Health', 
    meta: '2.5L • Daily', 
    streak: 28, 
    completed: true, 
    isArchived: false,
    Icon: Droplets 
  },
  { 
    id: '4', 
    name: 'Gym Session', 
    category: 'Health', 
    meta: '1 hour • 4x/week', 
    streak: 3, 
    completed: true, 
    isArchived: false,
    Icon: Dumbbell 
  },
  { 
    id: '5', 
    name: 'Deep Work', 
    category: 'Work', 
    meta: '2 hours • Weekdays', 
    streak: 0, 
    completed: true, 
    isArchived: false,
    Icon: Timer 
  },
];

const CATEGORIES = ["All", "Health", "Daily", "Productivity", "Fitness", "Weekly", "Mindfulness", "Financial", "Social", "Custom", "Other"];

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

const DateItem = ({
  date,
  isSelected,
  onPress
}: {
  date: Date;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const {colors, typography} = useTheme();
  const dayName = date.toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase();
  const dayNum = date.getDate();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.dateItem,
        {
          backgroundColor: isSelected ? BRAND_COLORS.primary : 'transparent',
        }
      ]}
    >
      <Text
        style={[
          typography.caption2,
          {
            color: isSelected ? '#FFF' : colors.textTertiary,
            fontWeight: isSelected ? '700' : '500',
          }
        ]}
      >
        {dayName}
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: isSelected ? '#FFF' : colors.text,
            fontWeight: '700',
            marginTop: 4,
          }
        ]}
      >
        {dayNum}
      </Text>
    </Pressable>
  );
};

const SwipeableHabitItem = ({
  habit,
  onToggle,
  onPress,
  onArchive,
  onDelete,
  onEdit,
  isArchived,
}: {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isArchived?: boolean;
}) => {
  const {colors, typography} = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -120) {
          Animated.spring(translateX, {
            toValue: -180,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.actionRow}>
        <Pressable 
          style={[styles.actionBtn, {backgroundColor: '#6C5CE7'}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onEdit();
          }}
        >
          <Edit2 size={20} color="#FFF" />
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, {backgroundColor: '#FF7675'}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onArchive();
          }}
        >
          {
            !isArchived ? 
            <Archive size={20} color="#FFF" />
            : 
            <ArchiveX size={20} color="#FFF" />
          }
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, {backgroundColor: '#e74c3c'}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onDelete();
          }}
        >
          <Trash2 size={20} color="#FFF" />
        </Pressable>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.habitCard,
          {
            backgroundColor: colors.card,
            ...SHADOWS.sm,
            transform: [{translateX}],
            marginHorizontal: 0, // override margin for swiping
            width: width - SPACING.xl * 2,
            alignSelf: 'center',
          },
        ]}
      >
        <Pressable onPress={onPress} style={styles.habitMain}>
          <View style={styles.habitPrimaryInfo}>
            <Text style={[typography.bodyMedium, {color: colors.text, fontWeight: '700'}]}>
              {habit.name}
            </Text>
            <View style={styles.habitMetaRow}>
              <Text style={{ fontSize: 14 }}>
                {habit.icon}
              </Text>
              <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 6}]}>
                {habit.meta || "xyz"}
              </Text>
            </View>
          </View>

          <View style={styles.habitStreakInfo}>
            <View style={styles.streakLabelRow}>
              <Flame size={14} color="#FF7675" fill="#FF7675" />
              <Text style={[typography.bodyMedium, {color: colors.text, fontWeight: '700', marginLeft: 4}]}>
                {habit.currentStreak}
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
      </Animated.View>
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showArchived, setShowArchived] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500)

  console.log("date selected", selectedDate.toISOString().split("T")[0])

  const formattedDate = selectedDate.toLocaleDateString("en-CA");

  const {data: habitsData, refetch, isLoading, error, isError} = useQuery({
    queryKey: ["all-habits", 1, 10, debouncedSearch, activeCategory, formattedDate],
    queryFn: () => HabitService.getAllHabits({
      page: 1,
      pageSize: 10,
      search: debouncedSearch.trim(),
      categoryFrequency: activeCategory,
      date: formattedDate as YYYYMMDD
    }),
  })

  console.log("habits data", habitsData);

  const toggleHabitMutation = useMutation({
    mutationKey: ["check in habit"],
    mutationFn: HabitService.habitCheckIn,

    onSuccess: (data) => {
      console.log("data after check in", data);
      refetch()
    },

    onError: (err) => {
      console.log(err);
    }
  })
  

  const dates = useMemo(() => {
    const d = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      d.push(nextDate);
    }
    return d;
  }, []);

  const archivedHabits = useMemo(() => {
    return habits.filter(h => h.isArchived);
  }, [habits]);

  const toggleHabit = (id: string, completed: boolean) => {
    if(completed){
      console.log("already true", completed);
      return;
    };

    const payload: CheckInPayload = {
      habitId: id,
      completed: true,
    }

    toggleHabitMutation.mutate(payload)
  };

  const archiveHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? {...h, isArchived: true} : h))
    );
  };

  const unarchiveHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? {...h, isArchived: false} : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
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

        {/* Date Slider */}
        <View style={styles.dateSliderContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateSliderContent}
          >
            {dates.map((date, idx) => (
              <DateItem
                key={idx}
                date={date}
                isSelected={date.toDateString() === selectedDate.toDateString()}
                onPress={() => setSelectedDate(new Date(date))}
              />
            ))}
          </ScrollView>
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

        {isLoading && <Loader visible={isLoading}/>}

        {isError && <ErrorView message={error.message} />}

        {!isLoading && habitsData?.data?.length === 0 && (
          <EmptyState
            title="No Habits Found"
            description="Add new habit to see here."
          />
        )}


        {habitsData?.data.map((habit: Habit) => (
          <SwipeableHabitItem
            key={habit.id}
            habit={habit}
            onToggle={() => toggleHabit(habit.id, habit.completed)}
            onPress={() => navigation.navigate('HabitDetail', {habitId: habit.id})}
            onArchive={() => archiveHabit(habit.id)}
            onDelete={() => deleteHabit(habit.id)}
            onEdit={() => navigation.navigate('AddHabit', {habitId: habit.id})}
          />
        ))}

        {/* Archived Habits Footer */}
        <Pressable 
          style={[styles.archiveRow, {backgroundColor: colors.surfaceAlt}]}
          onPress={() => setShowArchived(!showArchived)}
        >
          <View style={styles.archiveLeft}>
            <Archive size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, {color: colors.textSecondary, marginLeft: SPACING.md}]}>
              Archived Habits ({archivedHabits.length})
            </Text>
          </View>
          <ChevronRight 
            size={18} 
            color={colors.textTertiary} 
            style={{transform: [{rotate: showArchived ? '90deg' : '0deg'}]}}
          />
        </Pressable>

        {showArchived && archivedHabits.map((habit) => (
          <SwipeableHabitItem
            key={habit.id}
            habit={habit}
            onToggle={() => toggleHabit(habit.id, habit.completed)}
            onPress={() => navigation.navigate('HabitDetail', {habitId: habit.id})}
            onArchive={() => unarchiveHabit(habit.id)} // Toggle back
            onDelete={() => deleteHabit(habit.id)}
            onEdit={() => navigation.navigate('AddHabit', {habitId: habit.id})}
            isArchived={true}
          />
        ))}
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
    marginBottom: SPACING.md,
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
  dateSliderContainer: {
    paddingVertical: SPACING.md,
  },
  dateSliderContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  dateItem: {
    width: 50,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeContainer: {
    marginVertical: 0,
    position: 'relative',
    marginBottom: SPACING.md,
    // marginRight: SPACING.xs,
  },
  actionRow: {
    position: 'absolute',
    right: SPACING['2xl'],
    top: 0,
    bottom: 0,
    width: 180,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionBtn: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HabitsListScreen;
