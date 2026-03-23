import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ErrorView = ({ message }: { message?: string }) => {
    if (!message) return null;

    return (
        <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
        </View>
    );
};

export default ErrorView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#e74c3c",
        padding: 12,
        borderRadius: 10,
        margin: 16,
    },
    text: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
    },
});