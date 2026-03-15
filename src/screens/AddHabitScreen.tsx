import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Switch,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../theme';
import {BRAND_COLORS, HABIT_PALETTE} from '../theme/colors';
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';
import { 
  Bell, 
  Calendar, 
  Archive, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react-native';

const AddHabitScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🧘');
  const [selectedColor, setSelectedColor] = useState<typeof HABIT_PALETTE[number]>(HABIT_PALETTE[0]);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Custom'>('Daily');
  const [dailyGoal, setDailyGoal] = useState(1);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const icons = ['🧘', '💧', '🏋️', '📖', '⚙️', '🌙', '☕'];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[typography.body, {color: colors.textSecondary}]}>Cancel</Text>
        </Pressable>
        <Text style={[typography.title2, {fontWeight: '700', color: colors.text}]}>New Habit</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[typography.bodyMedium, {color: colors.text}]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Habit Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.overline, {color: colors.textSecondary}]}>HABIT NAME</Text>
            <Text style={[typography.caption2, {color: colors.textSecondary}]}>{`${habitName.length}/24`}</Text>
          </View>
          <TextInput
            style={[styles.input, {backgroundColor: colors.surfaceAlt, color: colors.text, ...typography.body}]}
            placeholder="e.g. Morning Meditation"
            placeholderTextColor={colors.textTertiary}
            value={habitName}
            onChangeText={(text) => setHabitName(text.slice(0, 24))}
          />
        </View>

        {/* Icon Selection */}
        <View style={styles.section}>
          <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>ICON</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
            {icons.map((icon) => (
              <Pressable
                key={icon}
                onPress={() => setSelectedIcon(icon)}
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
          </ScrollView>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>COLOR</Text>
          <View style={styles.colorRow}>
            {HABIT_PALETTE.map((color) => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
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
          <View style={[styles.tabContainer, {backgroundColor: colors.surfaceAlt}]}>
            {(['Daily', 'Weekly', 'Custom'] as const).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setFrequency(tab)}
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
        </View>

        {/* Daily Goal */}
        <View style={[styles.goalCard, {backgroundColor: colors.surfaceAlt}]}>
          <View>
            <Text style={[typography.title3, {color: colors.text}]}>Daily Goal</Text>
            <Text style={[typography.caption1, {color: colors.textSecondary}]}>Times per day</Text>
          </View>
          <View style={styles.counter}>
            <Pressable 
              onPress={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
              style={[styles.counterBtn, {borderColor: BRAND_COLORS.primary}]}
            >
              <Minus size={18} color={BRAND_COLORS.primary} strokeWidth={3} />
            </Pressable>
            <Text style={[typography.title2, {color: colors.text, marginHorizontal: SPACING.lg}]}>{dailyGoal}</Text>
            <Pressable 
              onPress={() => setDailyGoal(dailyGoal + 1)}
              style={[styles.counterBtn, {backgroundColor: BRAND_COLORS.primary}]}
            >
              <Plus size={18} color="#FFF" strokeWidth={3} />
            </Pressable>
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.reminderRow}>
           <Text style={[typography.overline, {color: colors.textSecondary}]}>REMINDERS</Text>
           <Switch 
            value={remindersEnabled} 
            onValueChange={setRemindersEnabled} 
            trackColor={{true: colors.primary}}
           />
        </View>

        <View style={[styles.reminderCard, {backgroundColor: colors.surfaceAlt}]}>
           <View style={styles.timeLabel}>
              <View style={[styles.bellIcon, {backgroundColor: BRAND_COLORS.primaryUltraLight}]}>
                <Bell size={16} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
              </View>
              <Text style={[typography.body, {color: colors.text, marginLeft: SPACING.md}]}>08:00 AM</Text>
           </View>
           <Calendar size={20} color={colors.textSecondary} />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[typography.overline, {color: colors.textSecondary, marginBottom: SPACING.md}]}>NOTES</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={[styles.notesInput, {backgroundColor: colors.surfaceAlt, color: colors.text, ...typography.body}]}
            placeholder="Add a motivating thought..."
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Archive Habit Button */}
        <Pressable style={styles.archiveBtn}>
          <Archive size={18} color={colors.textSecondary} style={{marginRight: 8}} />
          <Text style={[typography.body, {color: colors.textSecondary}]}>Archive Habit</Text>
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
    paddingBottom: SPACING.lg,
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
    borderWidth: 1,
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
});

export default AddHabitScreen;
