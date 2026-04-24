import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_STORAGE_KEY } from "../constants/odoo";
import { appError, appLog } from "../utils/logger";

export interface StoredSession {
  uid?: number;
  loginDetectedAt: string;
  source: "webview";
}

export const authSession = {
  async save(session: StoredSession) {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      appLog("Session marker saved", session);
    } catch (error) {
      appError("Failed to save session marker", error);
    }
  },

  async get(): Promise<StoredSession | null> {
    try {
      const rawValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!rawValue) {
        appLog("No stored session marker found");
        return null;
      }

      const parsedValue = JSON.parse(rawValue) as StoredSession;
      appLog("Stored session marker found", parsedValue);
      return parsedValue;
    } catch (error) {
      appError("Failed to read session marker", error);
      return null;
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      appLog("Session marker cleared");
    } catch (error) {
      appError("Failed to clear session marker", error);
    }
  },
};
