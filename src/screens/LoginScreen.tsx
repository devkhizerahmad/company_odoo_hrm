import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <LinearGradient
      colors={[Colors.primary, "#1e3a8a"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require("../assets/logo.png")} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>ByteScripterz</Text>
            <Text style={styles.subtitle}>HRM Portal</Text>
          </View>

          <View style={styles.glassContainer}>
            <View style={[
              styles.inputWrapper,
              focusedField === "email" && styles.inputWrapperFocused
            ]}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={20} 
                color={focusedField === "email" ? "#fff" : "rgba(255, 255, 255, 0.7)"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[
              styles.inputWrapper,
              focusedField === "password" && styles.inputWrapperFocused
            ]}>
              <MaterialCommunityIcons 
                name="lock-outline" 
                size={20} 
                color={focusedField === "password" ? "#fff" : "rgba(255, 255, 255, 0.7)"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={focusedField === "password" ? "#fff" : "rgba(255, 255, 255, 0.7)"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: "hidden", // Logo circle ke bahar na nikalay
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    textAlign: "center",
    width: "100%",
  },
  glassContainer: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 60,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  inputWrapperFocused: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default LoginScreen;
