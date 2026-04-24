import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import { Colors } from "../theme/colors";
import { AnimatedTabIcon } from "../components/AnimatedTabIcon";
import { GenericWebViewScreen } from "../components/GenericWebView";
import { ODOO_ROUTES } from "../constants/odoo";

const Tab = createBottomTabNavigator();

// Simple Placeholder Screen
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.center}>
    <Text style={styles.text}>{name} Screen</Text>
    <Text style={styles.subtext}>Coming Soon...</Text>
  </View>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName: any;
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Leave") iconName = focused ? "calendar-clock" : "calendar-clock-outline";
          else if (route.name === "Profile") iconName = focused ? "account" : "account-outline";
          else if (route.name === "Attendance") iconName = focused ? "clock-check" : "clock-check-outline";

          return <AnimatedTabIcon focused={focused} iconName={iconName} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home"
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {() => <GenericWebViewScreen url={ODOO_ROUTES.home} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Leave"
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {() => <GenericWebViewScreen url={ODOO_ROUTES.leave} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Profile" 
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {() => <GenericWebViewScreen url={ODOO_ROUTES.profile} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Attendance"
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {() => <GenericWebViewScreen url={ODOO_ROUTES.attendance} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  text: {
    fontSize: 22,
    fontFamily: "Outfit_700Bold",
    color: Colors.text,
  },
  subtext: {
    fontSize: 16,
    fontFamily: "Outfit_400Regular",
    color: Colors.textSecondary,
    marginTop: 8,
  },
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    elevation: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    height: 75,
    paddingBottom: 12,
    paddingTop: 10,
    borderTopWidth: 0,
    shadowColor: "#3563EA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(53, 99, 234, 0.05)",
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    marginTop: 4,
  },
});

export default MainTabNavigator;
