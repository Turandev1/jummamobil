import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNavigationContainerRef } from "@react-navigation/native";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { debugLog, debugError, debugSuccess } from "../../config/notificationConfig";

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
      // Add Android channel creation
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });
      }

      // Set up Expo notification handler
      
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          console.log("📱 Notification handler called:", notification);
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          };
        },
      });

      // Expo notification listeners
      NotificationService.setupExpoListeners();

      debugSuccess("NotificationService initialized successfully");
      return true;
    } catch (error) {
      debugError("NotificationService initialization failed", error);
      return false;
    }
  }

  static setupExpoListeners() {
    // Remove existing listeners first
    NotificationService.clearlisteners();

    // Notification tap listener
    const taplistener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          "�� Notification tapped:",
          response.notification.request.content.data
        );
        const data = response.notification.request.content.data;
        if (data?.screen) {
          navigate(data.screen, data.params || {});
        }
      }
    );

    // Background notification listener
    const backgroundListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        debugLog("Background notification received", notification);
        NotificationService.processBackgroundMessage(notification);
      }
    );

    // Store listeners for cleanup
    NotificationService.listeners = [backgroundListener, taplistener];
  }

  static clearlisteners() {
    NotificationService.listeners.forEach((listener) => {
      if (listener && typeof listener.remove === "function") {
        listener.remove();
      }
    });
    NotificationService.listeners = [];
  }

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

      await NotificationService.saveNotification(notificationData);
      
      // Trigger local notification if app is in background
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        try {
          await NotificationService.scheduleNotification(notificationData);
        } catch (scheduleError) {
          debugError("Failed to schedule local notification", scheduleError);
        }
      }
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
        },
        trigger: notification.trigger || null, // null = hemen göster
      });

      // Save to local storage
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
