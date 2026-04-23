import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://attendance.bytescripterz.com";
const DB_NAME = "hrm_db";

export const odooApi = {
  login: async (login: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/web/session/authenticate`, {
        jsonrpc: "2.0",
        params: {
          db: DB_NAME,
          login,
          password,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || "Invalid credentials");
      }

      const userData = response.data.result;
      
      // Save session info
      await AsyncStorage.setItem("userSession", JSON.stringify({
        uid: userData.uid,
        name: userData.name,
        username: userData.username,
        db: userData.db,
        session_id: userData.session_id,
      }));

      return userData;
    } catch (error: any) {
      console.error("Odoo Login Error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("userSession");
      // Optional: Call Odoo logout endpoint if needed
      // await axios.post(`${BASE_URL}/web/session/destroy`, { jsonrpc: "2.0", params: {} });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  getCurrentUser: async () => {
    try {
      const session = await AsyncStorage.getItem("userSession");
      return session ? JSON.parse(session) : null;
    } catch (error) {
      return null;
    }
  }
};
