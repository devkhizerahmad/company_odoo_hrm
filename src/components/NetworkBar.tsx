import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

interface NetworkBarProps {
  visible: boolean;
  message?: string;
}

export const NetworkBar = ({
  visible,
  message = "Connection issue detected. Please check your internet.",
}: NetworkBarProps) => {
  if (!visible) return null;

  return (
    <View style={styles.networkBar}>
      <MaterialCommunityIcons name="wifi-off" size={14} color="#fff" />
      <Text style={styles.networkText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  networkBar: {
    backgroundColor: Colors.danger,
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
