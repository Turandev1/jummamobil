// mobil/src/utils/offlineStorage.js - NEW FILE
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const OfflineStorage = {
  // Store user data for offline access
  async storeUserData(userData) {
    try {
      await AsyncStorage.setItem("offline_user", JSON.stringify({
        ...userData,
        lastUpdated: Date.now()
      }));
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  },

  // Get cached user data
  async getCachedUserData() {
    try {
      const data = await AsyncStorage.getItem("offline_user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to get cached user data:", error);
      return null;
    }
  },

  // Check if cached data is still valid (24 hours)
  isCachedDataValid(cachedData) {
    if (!cachedData || !cachedData.lastUpdated) return false;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - cachedData.lastUpdated) < twentyFourHours;
  },

  // Clear offline data
  async clearOfflineData() {
    try {
      await AsyncStorage.removeItem("offline_user");
    } catch (error) {
      console.error("Failed to clear offline data:", error);
    }
  }
};