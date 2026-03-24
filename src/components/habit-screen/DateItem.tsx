import { Pressable, StyleSheet, Text } from "react-native";
import { BRAND_COLORS, useTheme } from "../../theme";

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
            color: isSelected ? colors.white : colors.textTertiary,
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
            color: isSelected ? colors.white : colors.text,
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


const styles = StyleSheet.create({
    dateItem: {
        width: 50,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
  

export default DateItem;;