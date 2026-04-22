import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import { Colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Login screen ke liye header hide rakhein ge design ke mutabiq
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ 
            headerShown: true,
            title: "HRM Dashboard",
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerLeft: () => null, // Dashboard pe back button nahi chahiye login ke baad
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
