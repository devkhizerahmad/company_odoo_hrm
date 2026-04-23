import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../theme/colors";
import { odooApi } from "../services/odooApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DashboardScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState("Team Member");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await odooApi.getCurrentUser();
      if (user) {
        setUserName(user.name);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await odooApi.logout();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>ByteScripterz HRM</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Welcome, {userName}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>09:15 AM</Text>
          <Text style={styles.statLabel}>Check In</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>--:--</Text>
          <Text style={styles.statLabel}>Check Out</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🏖️</Text>
            <Text style={styles.actionText}>Leaves</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Payslips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>Attendance marked for yesterday</Text>
          <Text style={styles.activityTime}>Yesterday, 06:00 PM</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.surface,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    marginTop: -30,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: Colors.surface,
    width: "48%",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: Colors.surface,
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  activityText: {
    fontSize: 14,
    color: Colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default DashboardScreen;
