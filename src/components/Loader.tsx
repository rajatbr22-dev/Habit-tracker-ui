import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../theme";

const Loader = ({ visible = true }: { visible?: boolean }) => {
    const { colors } = useTheme();
    if (!visible) return null;

    return (
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
});