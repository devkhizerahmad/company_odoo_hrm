import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface NetworkBarProps {
  visible: boolean;
}

export const NetworkBar = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <View style={styles.networkBar}>
      <MaterialCommunityIcons name="wifi-off" size={14} color="#fff" />
      <Text style={styles.networkText}>Connection error. Please check your internet.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  networkBar: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
  networkText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Outfit_600SemiBold",
  },
});
