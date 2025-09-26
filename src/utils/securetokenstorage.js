// mobil/src/utils/secureTokenStorage.js - NEW FILE
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SecureTokenStorage = {
  // Store access token (less sensitive, shorter expiry)
  async setAccessToken(token) {
    try {
      await AsyncStorage.setItem("accessToken", token);
    } catch (error) {
      console.error("Failed to store access token:", error);
    }
  },

  // Get access token
  async getAccessToken() {
    try {
      return await AsyncStorage.getItem("accessToken");
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  },

  // Store refresh token (more sensitive, longer expiry)
  async setRefreshToken(token) {
    try {
      await SecureStore.setItemAsync("refreshToken", token);
    } catch (error) {
      console.error("Failed to store refresh token:", error);
    }
  },

  // Get refresh token
  async getRefreshToken(token) {
    try {
      return await SecureStore.getItemAsync({token});
    } catch (error) {
      console.error("Failed to get refresh token:", error);
      return null;
    }
  },

  // Clear all tokens
  async clearAllTokens() {
    try {
      await Promise.all([
        AsyncStorage.removeItem("accessToken"),
        SecureStore.deleteItemAsync("refreshToken")
      ]);
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }
};