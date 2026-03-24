import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";
import { SPACING } from "../theme/spacing";

type Props = {
    title?: string;
    description?: string;
};

const EmptyState = ({
    title = "No Data Found",
    description = "There is nothing to display right now.",
}: Props) => {
    const { colors, typography } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[typography.title3, { color: colors.text }]}>{title}</Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: SPACING.sm, textAlign: 'center' }]}>
                {description}
            </Text>
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING.xl,
        marginTop: SPACING.xl,
    },
});