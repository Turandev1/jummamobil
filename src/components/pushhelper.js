import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

/**
 * Push token al - Expo & FCM destekli
 */
export async function registerpushnotificationsasync() {
  try {

    if (!Device.isDevice) {
      console.warn("Push notification için fiziksel cihaz gerekli");
      return null;
    }

    // 🔹 Bildirim izinleri kontrol et
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Bildirim izni verilmedi.");
      return null;
    }

    // 🔹 Expo push token al
    const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", expoToken);

    // 🔹 Android için kanal ayarı (NotificationService'de zaten yapılıyor, burada tekrar yapmaya gerek yok)
    // if (Platform.OS === "android") {
    //   await Notifications.setNotificationChannelAsync("default", {
    //     name: "default",
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: "#FF231F7C",
    //   });
    // }

    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    console.log("🔔 Permission details:", { status, canAskAgain });
    // 🔹 FCM token almak (Expo SDK 48+ ve EAS ile çalışır)
    let fcmToken = null;
    try {
      fcmToken = (
        await Notifications.getDevicePushTokenAsync({
          projectId: "bbc5b722-ca06-4224-a998-f8191c2c8b10",
        })
      ).data;
      console.log("FCM Token:", fcmToken);
    } catch (e) {
      console.warn("FCM token alınamadı, sadece Expo token kullanılacak.");
    }

    // 🔹 Tercihen FCM token, yoksa Expo token dön
    return fcmToken || expoToken;
  } catch (err) {
    console.error("Push token error:", err);
    return null;
  }
}

/**
 * Token'ı backend'e gönder
 */
export async function sendTokenToBackend(apiUrl, authToken, token) {

  if (!token) return null;
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ fcmToken: token }),
    });
    return await res.json();
  } catch (e) {
    console.error("sendTokenToBackend error:", e);
    return null;
  }
}
