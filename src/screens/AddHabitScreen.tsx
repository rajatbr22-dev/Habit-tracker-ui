import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Switch,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTheme} from '../theme';
import {BRAND_COLORS, HABIT_PALETTE} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';
import { 
  Bell,
  Archive, 
  Check, 
  Plus, 
  Minus,
  ChevronLeft,
  Smile,
  Clock,
  Tag,
} from 'lucide-react-native';
import { 
  FREQUENCY_TYPES, 
  HABIT_CATEGORIES, 
  DAYS_OF_WEEK,
  CATEGORY_LABELS,
  ICONS,
  EMOJI_CATEGORIES,
} from '../constants/habits';
import type { FrequencyType, HabitCategory, DayOfWeek } from '../constants/habits';
import type { HabitFormData, HabitFormValues } from '../types/habit';
import { useMutation } from '@tanstack/react-query';
import HabitService from '../services/habit.services';
import { useAlert } from '../components/Alert';
import { habitSchema } from '../schema/habit.schema';

const AddHabitScreen: React.FC<{navigation: any, route: any}> = ({navigation, route}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const habitId = route?.params?.habitId;
  const isEditMode = !!habitId;

  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { alertProps, error: showError, success: showSuccess } = useAlert();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {errors, isValid},
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      icon: '🧘',
      color: HABIT_PALETTE[0],
      category: HABIT_CATEGORIES.HEALTH,
      frequency: FREQUENCY_TYPES.DAILY,
      customDays: [], 
      targetCount: 1,
      remindersEnabled: false,
      reminderTime: new Date(new Date().setHours(8, 0, 0, 0)),
      notes: '',
      meta: "",
      goalLabel: "",
      goalUnit: "",
    },
  });

  const frequency = watch('frequency');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const selectedCategory = watch('category');
  const targetCount = watch('targetCount');
  const remindersEnabled = watch('remindersEnabled');
  const reminderTime = watch('reminderTime');
  const habitName = watch('name');
  const customDays = watch('customDays') || [];


  const createHabitMutation = useMutation({
    mutationKey: ['create-habit'],

    mutationFn: (data: HabitFormValues) => HabitService.addNewHabit(data),

    onSuccess: () => {

      showSuccess("Habit created successfully");

      setTimeout(() => {
          navigation.goBack();
        }, 1000);

    },

    onError: (error) => {

      showError(error.message, { title: 'Habit Creation Failed' });

    }
  })

  const onSubmit = (data: HabitFormData) => {
    // Format the data to match HabitFormValues
    const habitData: HabitFormValues = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      category: data.category as HabitCategory,
      frequency: data.frequency as FrequencyType,
      targetCount: data.frequency === FREQUENCY_TYPES.CUSTOM ? data.customDays.length : data.targetCount,
      customDays: data.frequency === FREQUENCY_TYPES.CUSTOM ? (data.customDays as DayOfWeek[]) : [],
      goalLabel: data.goalLabel || "",
      goalValue: data.targetCount,
      goalUnit: data.goalUnit || "",
      reminderTime: data.remindersEnabled 
        ? data.reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ':00Z'
        : "",
      notes: data.notes,
      meta: data.meta
    };

    console.log('Processed Habit Data:', habitData);
    createHabitMutation.mutate(habitData);
  };

  const isCustomIcon = !ICONS.includes(selectedIcon);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View style={[styles.container, {backgroundColor: colors.background}]}>
        {/* Header */}
        <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text style={[typography.title2, {fontWeight: '700', color: colors.text}]}>New Habit</Text>
          <Pressable onPress={handleSubmit(onSubmit)} style={styles.headerBtn}>
            <Text style={[typography.bodyMedium, {color: isValid ? BRAND_COLORS.primary : colors.textTertiary, fontWeight: '700'}]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Habit Name */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.overline, {color: colors.textSecondary}]}>HABIT NAME</Text>
              <Text style={[typography.caption2, {color: errors.name ? colors.error : colors.textSecondary}]}>
                {`${habitName.length}/24`}
              </Text>
            </View>
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={[
                    styles.input, 
                    {
                      backgroundColor: colors.surfaceAlt, 
                      color: colors.text, 
                      ...typography.body,
                      borderColor: errors.name ? colors.error : 'transparent',
                      borderWidth: errors.name ? 1 : 0,
                    }
                  ]}
                  placeholder="e.g. Morning Meditation"
                  placeholderTextColor={colors.textTertiary}
                  value={value}
                  onChangeText={(text) => onChange(text.slice(0, 24))}
                />
              )}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>ICON</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
              {ICONS.map((icon) => (
                <Pressable
                  key={icon}
                  onPress={() => {
                    setValue('icon', icon);
                    setShowEmojiInput(false);
                  }}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor: selectedIcon === icon ? BRAND_COLORS.primaryUltraLight : colors.surfaceAlt,
                      borderColor: selectedIcon === icon ? BRAND_COLORS.primary : 'transparent',
                    },
                  ]}
                >
                  <Text style={{fontSize: 20}}>{icon}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setShowEmojiInput(true)}
                style={[
                  styles.iconOption,
                  {
                    backgroundColor: isCustomIcon ? BRAND_COLORS.primaryUltraLight : colors.surfaceAlt,
                    borderColor: isCustomIcon ? BRAND_COLORS.primary : 'transparent',
                  },
                ]}
              >
                <Smile size={20} color={colors.textSecondary} />
              </Pressable>
            </ScrollView>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>COLOR</Text>
            <View style={styles.colorRow}>
              {HABIT_PALETTE.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setValue('color', color)}
                  style={[
                    styles.colorOption,
                    {backgroundColor: color},
                  ]}
                >
                  {selectedColor === color ? (
                    <Check size={16} color="#FFF" strokeWidth={3} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {Object.values(HABIT_CATEGORIES).filter(cat => cat !== 'all' as any).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setValue('category', cat)}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: selectedCategory === cat ? BRAND_COLORS.primaryUltraLight : colors.surfaceAlt,
                      borderColor: selectedCategory === cat ? BRAND_COLORS.primary : 'transparent',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Tag size={14} color={selectedCategory === cat ? BRAND_COLORS.primary : colors.textSecondary} style={{marginRight: 6}} />
                  <Text 
                    style={[
                      typography.caption1, 
                      {color: selectedCategory === cat ? BRAND_COLORS.primary : colors.textSecondary, fontWeight: '600'}
                    ]}
                  >
                    {CATEGORY_LABELS[cat as HabitCategory]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Frequency */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>FREQUENCY</Text>
            <View style={[styles.tabContainer, {backgroundColor: colors.surfaceAlt, marginBottom: SPACING.md}]}>
              {([
                {key: FREQUENCY_TYPES.DAILY, label: 'Daily'}, 
                {key: FREQUENCY_TYPES.WEEKLY, label: 'Weekly'}, 
                {key: FREQUENCY_TYPES.CUSTOM, label: 'Custom'}
              ] as const).map((tab) => (
                <Pressable
                  key={tab.key}
                  onPress={() => setValue('frequency', tab.key)}
                  style={[
                    styles.tab,
                    frequency === tab.key && {backgroundColor: BRAND_COLORS.primary, ...SHADOWS.sm},
                  ]}
                >
                  <Text style={[typography.subheadMedium, {color: frequency === tab.key ? '#FFF' : colors.textSecondary}]}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {frequency === FREQUENCY_TYPES.CUSTOM && (
              <View style={styles.daySelector}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = customDays.includes(day.key);
                  return (
                    <Pressable
                      key={day.key}
                      onPress={() => {
                        const newDays = isSelected
                          ? customDays.filter((d) => d !== day.key)
                          : [...customDays, day.key];
                        setValue('customDays', newDays);
                      }}
                      style={[
                        styles.dayBubble,
                        {
                          backgroundColor: isSelected ? BRAND_COLORS.primary : colors.surfaceAlt,
                          borderColor: isSelected ? BRAND_COLORS.primary : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption1,
                          {color: isSelected ? '#FFF' : colors.textSecondary, fontWeight: '700'},
                        ]}
                      >
                        {day.short}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Goal / Target Count */}
          <View style={[styles.goalCard, {backgroundColor: colors.surfaceAlt}]}>
            <View>
              <Text style={[typography.title3, {color: colors.text}]}>
                {frequency === FREQUENCY_TYPES.DAILY ? 'Daily Goal' : frequency === FREQUENCY_TYPES.WEEKLY ? 'Weekly Goal' : 'Frequency Goal'}
              </Text>
              <Text style={[typography.caption1, {color: colors.textSecondary}]}>
                {frequency === FREQUENCY_TYPES.DAILY ? 'Times per day' : frequency === FREQUENCY_TYPES.WEEKLY ? 'Times per week' : 'Target completions'}
              </Text>
            </View>
            {frequency !== FREQUENCY_TYPES.CUSTOM ? (
              <View style={styles.counter}>
                <Pressable 
                  onPress={() => setValue('targetCount', Math.max(1, targetCount - 1))}
                  style={[styles.counterBtn, {borderColor: BRAND_COLORS.primary}]}
                >
                  <Minus size={18} color={BRAND_COLORS.primary} strokeWidth={3} />
                </Pressable>
                <Text style={[typography.title2, {color: colors.text, marginHorizontal: SPACING.lg}]}>{targetCount}</Text>
                <Pressable 
                  onPress={() => setValue('targetCount', targetCount + 1)}
                  style={[styles.counterBtn, {backgroundColor: BRAND_COLORS.primary}]}
                >
                  <Plus size={18} color="#FFF" strokeWidth={3} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.counter}>
                <Text style={[typography.title2, {color: colors.text}]}>{customDays.length}</Text>
                <Text style={[typography.caption1, {color: colors.textSecondary, marginLeft: 4}]}>days</Text>
              </View>
            )}
          </View>

          {/* Reminders */}
          <View style={styles.reminderRow}>
            <Text style={[typography.overline, {color: colors.textSecondary}]}>REMINDERS</Text>
            <Controller
              control={control}
              name="remindersEnabled"
              render={({field: {onChange, value}}) => (
                <Switch 
                  value={value} 
                  onValueChange={onChange} 
                  trackColor={{true: BRAND_COLORS.primary}}
                />
              )}
            />
          </View>

          {remindersEnabled && (
            <Pressable 
              style={[styles.reminderCard, {backgroundColor: colors.surfaceAlt}]}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.timeLabel}>
                  <View style={[styles.bellIcon, {backgroundColor: BRAND_COLORS.primaryUltraLight}]}>
                    <Bell size={16} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
                  </View>
                  <Text style={[typography.body, {color: colors.text, marginLeft: SPACING.md}]}>
                    {reminderTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}
                  </Text>
              </View>
              <Clock size={20} color={colors.textSecondary} />
            </Pressable>
          )}


          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.overline, {color: colors.textSecondary}]}>METAA</Text>
            </View>
            <Controller
              control={control}
              name="meta"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={[
                    styles.input, 
                    {
                      backgroundColor: colors.surfaceAlt, 
                      color: colors.text, 
                      ...typography.body,
                      borderColor: errors.meta ? colors.error : 'transparent',
                      borderWidth: errors.meta ? 1 : 0,
                    }
                  ]}
                  placeholder="10 mins • Daily"
                  placeholderTextColor={colors.textTertiary}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>NOTES</Text>
            <Controller
              control={control}
              name="notes"
              render={({field: {onChange, value}}) => (
                <TextInput
                  multiline
                  numberOfLines={4}
                  style={[styles.notesInput, {backgroundColor: colors.surfaceAlt, color: colors.text, ...typography.body}]}
                  placeholder="Add a motivating thought..."
                  placeholderTextColor={colors.textTertiary}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Archive Habit Button */}
          <Pressable style={styles.archiveBtn}>
            <Archive size={18} color={colors.textSecondary} style={{marginRight: 8}} />
            <Text style={[typography.body, {color: colors.textSecondary}]}>Archive Habit</Text>
          </Pressable>
        </ScrollView>

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) {
                setValue('reminderTime', selectedDate);
              }
            }}
          />
        )}

        {/* Categorized Emoji Picker Modal */}
        <Modal visible={showEmojiInput} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: colors.card, height: '60%'}]}>
              <View style={styles.modalHeader}>
                <Text style={[typography.title3, {color: colors.text}]}>Choose Icon</Text>
                <Pressable onPress={() => setShowEmojiInput(false)} style={styles.closeBtn}>
                  <Text style={[typography.bodyMedium, {color: BRAND_COLORS.primary}]}>Done</Text>
                </Pressable>
              </View>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {EMOJI_CATEGORIES.map((category) => (
                  <View key={category.name} style={styles.emojiCategory}>
                    <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>
                      {category.name.toUpperCase()}
                    </Text>
                    <View style={styles.emojiGrid}>
                      {category.emojis.map((emoji) => (
                        <Pressable
                          key={emoji}
                          onPress={() => {
                            setValue('icon', emoji);
                            setShowEmojiInput(false);
                          }}
                          style={[
                            styles.emojiCell,
                            {
                              backgroundColor: selectedIcon === emoji ? BRAND_COLORS.primaryUltraLight : colors.surfaceAlt,
                            },
                          ]}
                        >
                          <Text style={{fontSize: 24}}>{emoji}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>

    </KeyboardAvoidingView>
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
    paddingBottom: SPACING.lg,
  },
  headerBtn: {
    padding: SPACING.xs,
    minWidth: 44,
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  input: {
    padding: SPACING.md,
    borderRadius: RADII.md,
  },
  iconRow: {
    paddingRight: SPACING.lg,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: RADII.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1.5,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryRow: {
    paddingRight: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.pill,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: RADII.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    marginBottom: SPACING.xl,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    marginBottom: SPACING.xl,
  },
  timeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesInput: {
    padding: SPACING.md,
    borderRadius: RADII.md,
    height: 100,
    textAlignVertical: 'top',
  },
  archiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    marginTop: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    borderRadius: RADII.xl,
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeBtn: {
    padding: SPACING.sm,
  },
  emojiCategory: {
    marginBottom: SPACING.xl,
    width: '100%',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  emojiCell: {
    width: (LAYOUT.window.width - SPACING.xl * 4 - SPACING.md * 3) / 4,
    aspectRatio: 1,
    borderRadius: RADII.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  dayBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddHabitScreen;
