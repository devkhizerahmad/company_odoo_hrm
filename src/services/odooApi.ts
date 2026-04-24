import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_STORAGE_KEY, ODOO_BASE_URL } from "../constants/odoo";
import { appError } from "../utils/logger";

const DB_NAME = "hrm_db";

export const odooApi = {
  login: async (login: string, password: string) => {
    try {
      const response = await axios.post(`${ODOO_BASE_URL}/web/session/authenticate`, {
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
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        uid: userData.uid,
        name: userData.name,
        username: userData.username,
        db: userData.db,
        session_id: userData.session_id,
      }));

      return userData;
    } catch (error: any) {
      appError("Odoo Login Error", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      // Optional: Call Odoo logout endpoint if needed
      // await axios.post(`${ODOO_BASE_URL}/web/session/destroy`, { jsonrpc: "2.0", params: {} });
    } catch (error) {
      appError("Logout Error", error);
    }
  },

  getCurrentUser: async () => {
    try {
      const session = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      return null;
    }
  }
};
