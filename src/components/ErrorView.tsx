import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../theme";
import { RADII, SPACING, SHADOWS } from "../theme/spacing";
import { AlertCircle, RefreshCw } from "lucide-react-native";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ 
  message = "Something went wrong while fetching data.", 
  onRetry 
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, ...SHADOWS.md }]}>
        <AlertCircle size={48} color={colors.error} style={styles.icon} />
        <Text style={[typography.title3, { color: colors.text, marginBottom: SPACING.sm }]}>
          Oops!
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: SPACING.xl }]}>
          {message}
        </Text>
        
        {onRetry && (
          <Pressable 
            onPress={onRetry}
            style={({ pressed }) => [
              styles.retryBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.8 }
            ]}
          >
            <RefreshCw size={18} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={[typography.subheadMedium, { color: colors.white }]}>
              Try Again
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: RADII.xl,
    alignItems: 'center',
  },
  icon: {
    marginBottom: SPACING.md,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADII.lg,
  },
});