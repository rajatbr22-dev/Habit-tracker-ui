import React, {useState, useMemo} from 'react';
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
import {z} from 'zod';
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
} from 'lucide-react-native';

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(24, 'Max 24 characters'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string(),
  frequency: z.enum(['Daily', 'Weekly', 'Custom']),
  daysOfWeek: z.array(z.number()).optional(),
  interval: z.number().min(1).optional(),
  goal: z.number().min(1),
  remindersEnabled: z.boolean(),
  reminderTime: z.date(),
  notes: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

const ICONS = ['🧘', '💧', '🏋️', '📖', '⚙️', '🌙', '☕'];

const EMOJI_CATEGORIES = [
  {name: 'Mindfulness', emojis: ['🧘', '🧘‍♀️', '🧘‍♂️', '🕯️', '✨', '☁️', '🌊']},
  {name: 'Health', emojis: ['💧', '🍎', '🥦', '💊', '🥗', '🥑', '🍋']},
  {name: 'Fitness', emojis: ['🏋️', '🏃', '🚴', '🏊', '🥊', '⚽', '🏀']},
  {name: 'Productivity', emojis: ['📖', '✍️', '💻', '💡', '📅', '🎯', '⌛']},
  {name: 'Growth', emojis: ['⚙️', '📈', '🌱', '🚀', '🧠', '🛠️', '🧱']},
  {name: 'Leisure', emojis: ['🌙', '☕', '🍵', '🎨', '🎸', '🎮', '📸']},
];

const AddHabitScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      frequency: 'Daily',
      daysOfWeek: [1, 2, 3, 4, 5, 6 ,7], // Default Mon-Sun
      interval: 2,
      goal: 1,
      remindersEnabled: false,
      reminderTime: new Date(new Date().setHours(8, 0, 0, 0)),
      notes: '',
    },
  });

  const frequency = watch('frequency');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const dailyGoal = watch('goal');
  const remindersEnabled = watch('remindersEnabled');
  const reminderTime = watch('reminderTime');
  const habitName = watch('name');
  const daysOfWeek = watch('daysOfWeek') || [];
  const interval = watch('interval') || 2;

  const onSubmit = (data: HabitFormData) => {
    console.log('Habit Data:', data);
    navigation.goBack();
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

          {/* Frequency */}
          <View style={styles.section}>
            <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>FREQUENCY</Text>
            <View style={[styles.tabContainer, {backgroundColor: colors.surfaceAlt, marginBottom: SPACING.md}]}>
              {(['Daily', 'Weekly', 'Custom'] as const).map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setValue('frequency', tab)}
                  style={[
                    styles.tab,
                    frequency === tab && {backgroundColor: BRAND_COLORS.primary, ...SHADOWS.sm},
                  ]}
                >
                  <Text style={[typography.subheadMedium, {color: frequency === tab ? '#FFF' : colors.textSecondary}]}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>

            {frequency === 'Weekly' && (
              <View style={styles.daySelector}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                  const isSelected = daysOfWeek.includes(index);
                  return (
                    <Pressable
                      key={`${day}-${index}`}
                      onPress={() => {
                        const newDays = isSelected
                          ? daysOfWeek.filter((d) => d !== index)
                          : [...daysOfWeek, index];
                        setValue('daysOfWeek', newDays);
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
                        {day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {frequency === 'Custom' && (
              <View style={[styles.customInterval, {backgroundColor: colors.surfaceAlt}]}>
                <Text style={[typography.body, {color: colors.text}]}>Every</Text>
                <View style={styles.intervalControls}>
                  <Pressable
                    onPress={() => setValue('interval', Math.max(1, interval - 1))}
                    style={[styles.intervalBtn, {borderColor: colors.border}]}
                  >
                    <Minus size={16} color={colors.text} />
                  </Pressable>
                  <Text style={[typography.title3, {color: colors.text, marginHorizontal: SPACING.md}]}>
                    {interval}
                  </Text>
                  <Pressable
                    onPress={() => setValue('interval', interval + 1)}
                    style={[styles.intervalBtn, {borderColor: colors.border}]}
                  >
                    <Plus size={16} color={colors.text} />
                  </Pressable>
                </View>
                <Text style={[typography.body, {color: colors.text}]}>days</Text>
              </View>
            )}
          </View>

          {/* Goal */}
          <View style={[styles.goalCard, {backgroundColor: colors.surfaceAlt}]}>
            <View>
              <Text style={[typography.title3, {color: colors.text}]}>
                {frequency === 'Daily' ? 'Daily Goal' : frequency === 'Weekly' ? 'Weekly Goal' : 'Custom Goal'}
              </Text>
              <Text style={[typography.caption1, {color: colors.textSecondary}]}>
                {frequency === 'Daily' ? 'Times per day' : frequency === 'Weekly' ? 'Times per week' : 'Times per period'}
              </Text>
            </View>
            <View style={styles.counter}>
              <Pressable 
                onPress={() => setValue('goal', Math.max(1, dailyGoal - 1))}
                style={[styles.counterBtn, {borderColor: BRAND_COLORS.primary}]}
              >
                <Minus size={18} color={BRAND_COLORS.primary} strokeWidth={3} />
              </Pressable>
              <Text style={[typography.title2, {color: colors.text, marginHorizontal: SPACING.lg}]}>{dailyGoal}</Text>
              <Pressable 
                onPress={() => setValue('goal', dailyGoal + 1)}
                style={[styles.counterBtn, {backgroundColor: BRAND_COLORS.primary}]}
              >
                <Plus size={18} color="#FFF" strokeWidth={3} />
              </Pressable>
            </View>
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
  customEmojiContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADII.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  emojiInput: {
    width: 100,
    fontSize: 14,
    padding: 0,
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
  customInterval: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginTop: SPACING.sm,
  },
  intervalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intervalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddHabitScreen;
