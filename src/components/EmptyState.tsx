import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
    title?: string;
    description?: string;
};

const EmptyState = ({
    title = "No Data Found",
    description = "There is nothing to display right now.",
}: Props) => {
    return (
        <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#555",
    },
    description: {
        fontSize: 14,
        color: "#777",
        marginTop: 8,
        textAlign: "center",
    },
    button: {
        marginTop: 16,
        backgroundColor: "#6C5CE7",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});