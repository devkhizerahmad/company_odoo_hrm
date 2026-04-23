import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

interface AnimatedTabIconProps {
  focused: boolean;
  iconName: any;
}

export const AnimatedTabIcon = ({ focused, iconName }: AnimatedTabIconProps) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={[
      styles.iconContainer,
      focused && styles.activeIconContainer,
      { transform: [{ scale }] }
    ]}>
      <MaterialCommunityIcons 
        name={iconName} 
        size={24} 
        color={focused ? Colors.primary : "#94A3B8"} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  activeIconContainer: {
    backgroundColor: "rgba(53, 99, 234, 0.1)",
  },
});
