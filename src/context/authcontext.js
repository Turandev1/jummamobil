import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { API_URLS } from "../config/api";
import * as SecureStore from "expo-secure-store";
import {
  registerpushnotificationsasync,
  sendTokenToBackend,
} from "../components/pushhelper";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuth: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isOnline: true,
    lastSyncTime: null,
  });

  // Network state management
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable;

      setAuthState((prev) => {
        // Eğer offline’dan online’a geçiş varsa sync yap
        if (isOnline && prev.isOnline === false) {
          syncWithServer();
        }
        return { ...prev, isOnline };
      });
    });
    return () => unsubscribe();
  }, []);

  // Single initialization effect
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Load stored data
      const [storedAccessToken, storedRefreshToken, storedUser] =
        await Promise.all([
          AsyncStorage.getItem("accessToken"),
          SecureStore.getItemAsync("refreshToken"),
          AsyncStorage.getItem("user"),
        ]);

      if (!storedAccessToken || !storedRefreshToken) {
        setAuthState((prev) => ({ ...prev, isAuth: false, isLoading: false }));
        return;
      }
      // Set initial state
      setAuthState((prev) => ({
        ...prev,
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: storedUser ? JSON.parse(storedUser) : null,
        isAuth: true,
      }));

      // Verify with server if online
      const netstate = await NetInfo.fetch();
      if (netstate.isConnected && netstate.isInternetReachable) {
        await verifyTokenWithServer(storedAccessToken);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      await clearAuthData();
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const verifyTokenWithServer = async (token) => {
    try {
      const res = await axios.get(API_URLS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const userData = res.data.data;
        setAuthState((prev) => ({
          ...prev,
          user: userData,
          isAuth: true,
          lastSyncTime: Date.now(),
        }));

        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        await handleTokenRefresh();
      } else {
        console.log("Internet xetasi,maintaining offline auth");
      }
    }
  };

  const handleTokenRefresh = async () => {
    try {
      const newtokens = await refreshAccessToken();

      if (newtokens) {
        setAuthState((prev) => ({
          ...prev,
          accessToken: newtokens.accessToken,
          refreshToken: newtokens.refreshToken,
          isAuth: true,
        }));
        await verifyTokenWithServer(newtokens.accessToken);
      } else {
        await clearAuthData();
      }
    } catch (error) {
      console.error("Token yenileme ugursuzdur", error);
      await clearAuthData();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) return null;

      const response = await axios.post(API_URLS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.data.accessToken && response.data.refreshToken) {
        await Promise.all([
          AsyncStorage.setItem("accessToken", response.data.accessToken),
          SecureStore.setItemAsync("refreshToken", response.data.refreshToken),
        ]);

        return {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear invalid tokens
      await clearAuthData();
      return null;
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("accessToken"),
        AsyncStorage.removeItem("user"),
        AsyncStorage.removeItem("admin"),
        SecureStore.deleteItemAsync("adminaccesstoken"),
        SecureStore.deleteItemAsync("adminrefreshtoken"),
      ]);

      setAuthState({
        isAuth: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isOnline: authState.isOnline,
        lastSyncTime: null,
      });
    } catch (error) {
      console.error("Clear auth data error:", error);
    }
  };

  const syncWithServer = async () => {
    if (!authState.isAuth || !authState.accessToken) return;
    try {
      await verifyTokenWithServer(authState.accessToken);
    } catch (error) {
      console.error("Sync with server failed:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_URLS.AUTH.LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens securely
      await Promise.all([
        AsyncStorage.setItem("accessToken", accessToken),
        SecureStore.setItemAsync("refreshToken", refreshToken),
        AsyncStorage.setItem("user", JSON.stringify(user)),
      ]);
      console.log("accestoken:", accessToken);
      setAuthState((prev) => ({
        ...prev,
        isAuth: true,
        user,
        accessToken,
        refreshToken,
        lastSyncTime: Date.now(),
      }));

      if (authState.isOnline) {
        try {
          const fcmToken = await registerpushnotificationsasync();
          if (fcmToken) {
            console.log("📱 Registering push token:", fcmToken);

            const tokenResult = await sendTokenToBackend(
              API_URLS.AUTH.REGISTERTOKEN,
              accessToken,
              fcmToken
            );
            console.log("fcmtoken:", fcmToken);
            if (tokenResult?.success) {
              console.log("✅ Push token registered successfully");
            } else {
              console.warn("⚠️ Push token registration failed:", tokenResult);
            }
          } else {
            console.warn("⚠️ Failed to get push token");
          }
        } catch (tokenError) {
          console.error("❌ Push token registration error:", tokenError);
          // Don't fail login if push token registration fails
        }
      }

      console.log("refresh", refreshToken);
      console.log("access", accessToken);
      console.log("user", user);
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if online
      if (authState.isOnline && authState.accessToken) {
        try {
          await axios.post(
            API_URLS.AUTH.LOGOUT,
            {},
            {
              headers: { Authorization: `Bearer ${authState.accessToken}` },
            }
          );
        } catch (error) {
          console.log("Backend logout failed:", error.message);
        }
      }

      await clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      await clearAuthData(); // Ensure cleanup even if logout fails
    }
  };

  // Verify email function
  const verifyEmail = async (email, code) => {
    try {
      const response = await axios.post(
        API_URLS.AUTH.VERIFY,
        { email, code },
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  };

  // Update user info function
  const updateUserInfo = async (userData) => {
    try {
      const response = await axios.put(API_URLS.AUTH.UPDATEUSERINFO, userData, {
        headers: { Authorization: `Bearer ${authState.accessToken}` },
      });

      console.log("Update user response:", response.data);

      // Sunucunun gönderdiği format
      if (response.data.profil) {
        setAuthState((prev) => ({
          ...prev,
          user: response.data.profil,
        })); // ✅ user state güncellenir
        return {
          success: true,
          user: response.data.profil,
          mesaj: response.data.mesaj,
        };
      }

      return {
        success: false,
        mesaj: response.data.mesaj || "Məlumat yenilənmədi",
      };
    } catch (error) {
      console.error(
        "Update user info error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Change password function
  const changePassword = async (
    currentpassword,
    newpassword,
    confirmpassword
  ) => {
    try {
      const response = await axios.put(
        API_URLS.AUTH.CHANGEPASSWORD,
        {
          currentpassword: currentpassword,
          newpassword: newpassword,
          confirmpassword: confirmpassword,
        },
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };

  // Delete account function
  const deleteAccount = async (email, password) => {
    try {
      if (!authState.accessToken) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Access token yok, logout gerekli");
        setAuthState((prev) => ({
          ...prev,
          accessToken: newToken.accessToken,
          refreshToken: newToken.refreshToken,
        }));
      }

      const response = await axios.delete(API_URLS.AUTH.DELETEACCOUNT, {
        data: { email, password },
        headers: { Authorization: `Bearer ${authState.accessToken}` },
      });

      if (response.data.message === "Hesab ugurla silindi") {
        await logout();
      }

      return response.data;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  // Set gender function
  const setuserinfo = async () => {
    try {
      const email = await AsyncStorage.getItem("lastemail");
      const gender = await AsyncStorage.getItem("genderinfo");
      const mesciddata = await AsyncStorage.getItem("cumemescidi");
      const cumemescidi = JSON.parse(mesciddata);
      console.log("mescid:", mesciddata);
      console.log("mesci:", cumemescidi);
      const response = await axios.post(API_URLS.AUTH.SET_GENDER, {
        email: email,
        cins: gender,
        cumemescidi,
      });
      return response.data;
    } catch (error) {
      console.error("Set gender error:", error);
      throw error;
    }
  };

  const setcumemescid = async (cumemescidi) => {
    const newtoken = await refreshAccessToken();
    console.log("new", newtoken);
    try {
      const res = await axios.put(API_URLS.AUTH.CHANGEMESCID, cumemescidi, {
        headers: { Authorization: `Bearer ${newtoken.accessToken}` },
      });

      const data = res.data;
      console.log("data:", data.user);
    } catch (error) {
      console.error(error);
    }
  };

  // Send message function
  const sendMessage = async (messageData) => {
    try {
      const response = await axios.post(
        API_URLS.AUTH.SENDMESSAGES,
        messageData,
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Send message error:", error);
      throw error;
    }
  };

  // Get messages function
  const getMessages = async () => {
    try {
      const response = await axios.get(API_URLS.AUTH.GETMESSAGES, {
        headers: { Authorization: `Bearer ${authState.accessToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get messages error:", error);
      throw error;
    }
  };



  // Reply to message function
  const replyToMessage = async (messageId, reply) => {
    try {
      const response = await axios.put(
        API_URLS.AUTH.REPLYMESSAGES.replace(":id", messageId),
        { reply },
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Reply to message error:", error);
      throw error;
    }
  };

  const loginimamaccount = async (email, password) => {
    try {
      const response = await axios.post(API_URLS.ADMINS.IMAMLOGIN, {
        email,
        password,
      });

      const data = response.data;
      console.log("data:", data);
      // Token ve kullanıcıyı sakla
      const user = data.user;
      await Promise.all([
        AsyncStorage.setItem("admin", JSON.stringify(user)),
        SecureStore.setItemAsync("adminaccesstoken", data.accessToken),
        SecureStore.setItemAsync("adminrefreshtoken", data.refreshToken),
      ]);

      return { success: true, user };
    } catch (error) {
      console.error("İmam login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    refreshAccessToken,
    syncWithServer,
    verifyEmail,
    updateUserInfo,
    changePassword,
    deleteAccount,
    setuserinfo,
    sendMessage,
    getMessages,
    setcumemescid,
    replyToMessage,
    loginimamaccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
