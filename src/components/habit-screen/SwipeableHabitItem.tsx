import { useRef } from "react";
import { BRAND_COLORS, RADII, SHADOWS, SPACING, useTheme } from "../../theme";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { Archive, ArchiveX, Check, Edit2, Flame, Trash2 } from "lucide-react-native";
const {width} = Dimensions.get('window');


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
          style={[styles.actionBtn, {backgroundColor: colors.primary}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onEdit();
          }}
        >
          <Edit2 size={20} color={colors.white} />
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, {backgroundColor: colors.warning}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onArchive();
          }}
        >
          {
            !isArchived ? 
            <Archive size={20} color={colors.white} />
            : 
            <ArchiveX size={20} color={colors.white} />
          }
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, {backgroundColor: colors.error}]} 
          onPress={() => {
            Animated.timing(translateX, {toValue: 0, duration: 200, useNativeDriver: true}).start();
            onDelete();
          }}
        >
          <Trash2 size={20} color={colors.white} />
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
            borderColor: colors.border,
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
              backgroundColor: habit.completed ? colors.primaryUltraLight : colors.surfaceAlt,
            }
          ]}
        >
          <Check
            size={20}
            color={habit.completed ? colors.primary : colors.textTertiary}
            strokeWidth={3}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({

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

    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
        borderRadius: RADII.xl,
        padding: SPACING.md,
        paddingLeft: SPACING.lg,
        borderWidth: 1,
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


})
  

export default SwipeableHabitItem;;