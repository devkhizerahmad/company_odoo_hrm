import React from "react";
import { View, StyleSheet, Animated } from "react-native";

const AnimatedShimmer = () => {
  const translateX = React.useRef(new Animated.Value(-150)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 350,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.shimmer, 
        { transform: [{ translateX }] }
      ]} 
    />
  );
};

export const SkeletonLoader = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonHeader}><AnimatedShimmer /></View>
    <View style={styles.skeletonRow}><AnimatedShimmer /></View>
    <View style={[styles.skeletonRow, { width: "80%" }]}><AnimatedShimmer /></View>
    <View style={[styles.skeletonRow, { width: "60%" }]}><AnimatedShimmer /></View>
    <View style={styles.skeletonBox}><AnimatedShimmer /></View>
  </View>
);

const styles = StyleSheet.create({
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    padding: 20,
    zIndex: 5,
  },
  skeletonHeader: {
    height: 40,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
    overflow: "hidden",
  },
  skeletonRow: {
    height: 16,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    marginBottom: 16,
    width: "100%",
    overflow: "hidden",
  },
  skeletonBox: {
    height: 200,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    overflow: "hidden",
  },
  shimmer: {
    width: 150,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
  },
});
