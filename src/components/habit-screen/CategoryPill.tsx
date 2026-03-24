import { Pressable, StyleSheet, Text } from "react-native";
import { BRAND_COLORS, SPACING, useTheme } from "../../theme";

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
          borderColor: isActive ? 'transparent' : colors.border,
          borderWidth: isActive ? 0 : 1,
        }
      ]}
    >
      <Text
        style={[
          typography.subheadMedium,
          {color: isActive ? colors.white : colors.textSecondary}
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};


const styles = StyleSheet.create({
    categoryPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 24,
  },
})


export default CategoryPill;