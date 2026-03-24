import React, {useState, useMemo, useRef} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronRight,
  Archive,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';
import { useMutation, useQuery } from '@tanstack/react-query';
import HabitService from '../services/habit.services';
import { CATEGORIES, CheckInPayload, YYYYMMDD } from '../types';
import { useDebounce } from '../hooks/debounce';
import Loader from '../components/Loader';
import ErrorView from '../components/ErrorView';
import EmptyState from '../components/EmptyState';
import CategoryPill from '../components/habit-screen/CategoryPill';
import DateItem from '../components/habit-screen/DateItem';
import SwipeableHabitItem from '../components/habit-screen/SwipeableHabitItem';

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


const HabitsListScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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

    staleTime: 0,        // always stale
    gcTime: 0,        // do not keep cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  // const archivedHabits = useMemo(() => {
  //   return habits.filter(h => h.isArchived);
  // }, [habits]);


  const {data: archivedHabits, refetch: refetchArchivedHabits} = useQuery({
    queryKey: ["archived-habits"],
    queryFn: () => HabitService.getAllArchivedHabits(),

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  console.log("archived habits", archivedHabits);

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


  const archiveHabitMutation = useMutation({
    mutationKey: ["archive-habit"],
    mutationFn: HabitService.archiveHabit,

    onSuccess: (data) => {
      console.log("data after archive", data);
      refetchArchivedHabits()
      refetch()
    },

    onError: (err) => {
      console.log(err);
    }
  })



  const unArchiveHabitMutation = useMutation({
    mutationKey: ["unarchive-habit"],
    mutationFn: HabitService.unarchiveHabit,

    onSuccess: (data) => {
      console.log("data after unarchive", data);
      refetchArchivedHabits()
      refetch()
    },

    onError: (err) => {
      console.log(err);
    }
  })


  const deleteHabitMutation = useMutation({
    mutationKey: ["delete-habit"],
    mutationFn: HabitService.deleteHabit,

    onSuccess: (data) => {
      console.log("data after delete", data);
      refetchArchivedHabits()
      refetch()
    },

    onError: (err) => {
      console.log(err);
    }
  })

  const archiveHabit = (id: string) => {
    archiveHabitMutation.mutate(id)
  };

  const unarchiveHabit = (id: string) => {
    unArchiveHabitMutation.mutate(id)
  };

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id)
  };

  const editHabit = (id: string) => {
    navigation.navigate('AddHabit', {habitId: id});
    // refetch()
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
            onEdit={() => editHabit(habit.id)}
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
              Archived Habits ({archivedHabits?.data.length})
            </Text>
          </View>
          <ChevronRight 
            size={18} 
            color={colors.textTertiary} 
            style={{transform: [{rotate: showArchived ? '90deg' : '0deg'}]}}
          />
        </Pressable>

        {showArchived && archivedHabits?.data.map((habit: Habit) => (
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
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
  
});

export default HabitsListScreen;
