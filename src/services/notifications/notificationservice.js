// src/services/notifications/notificationservice.js
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNavigationContainerRef } from "@react-navigation/native";
import { Platform } from "react-native";
import {
  debugLog,
  debugError,
  debugSuccess,
} from "../../config/notificationConfig";

export const navigationref = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationref.isReady()) {
    navigationref.navigate(name, params);
  }
}

class NotificationService {
  static listeners = [];

  static async initialize() {
    try {
      // Android channel oluştur
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });
      }

      // Foreground davranışı: custom UI göstereceğiz, OS banner kapalı
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            shouldShowAlert: false, // OS banner kapalı
            shouldPlaySound: false, // OS sesi kapalı
            shouldSetBadge: true, // rozet açık
            shouldShowList: false, // iOS 16+ list kapalı
            shouldShowBanner: false, // iOS banner kapalı
          };
        },
      });

      // Tap listener ve cleanup
      NotificationService.setupExpoListeners();

      debugSuccess("NotificationService initialized successfully");
      return true;
    } catch (error) {
      debugError("NotificationService initialization failed", error);
      return false;
    }
  }

  static setupExpoListeners() {
    // Önce var olan listenerleri temizle
    NotificationService.clearlisteners();

    // Bildirime tıklama listener
    const tapListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          "📌 Notification tapped:",
          response.notification.request.content.data
        );
        const data = response.notification.request.content.data;
        if (data?.screen) {
          navigate(data.screen, data.params || {});
        }
      }
    );

    // Listenerleri kaydet
    NotificationService.listeners = [tapListener];
  }

  static clearlisteners() {
    NotificationService.listeners.forEach((listener) => {
      if (listener && typeof listener.remove === "function") {
        listener.remove();
      }
    });
    NotificationService.listeners = [];
  }

  // Background/Killed state için: OS banner gösterildiği için local notification schedule yok
  static async processBackgroundMessage(notification) {
    try {
      debugLog("Processing background notification", notification);

      const notificationData = {
        title: notification.request?.content?.title || "Notification",
        body: notification.request?.content?.body || "New message",
        data: notification.request?.content?.data,
        timestamp: new Date().toISOString(),
        fromBackground: true,
      };

      // AsyncStorage'a kaydet
      await NotificationService.saveNotification(notificationData);

      // OS banner zaten gösteriyor, local notification schedule etmeye gerek yok
    } catch (error) {
      debugError("Error processing background notification", error);
    }
  }

  static async scheduleNotification(notification) {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: "default",
          color: "#10B981",
          channelId: "default", // Android kanalı
        },
        trigger: notification.trigger || null, // null = hemen göster
      });

      // AsyncStorage'a kaydet
      await this.saveNotification({ ...notification, id });
      return id;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      throw error;
    }
  }

  static async saveNotification(notification) {
    try {
      const existing = await AsyncStorage.getItem("notifications");
      const notifications = existing ? JSON.parse(existing) : [];
      notifications.push(notification);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  static async getStoredNotifications() {
    try {
      const notifications = await AsyncStorage.getItem("notifications");
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }
}

export default NotificationService;
