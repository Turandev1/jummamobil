import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) await AsyncStorage.setItem("fcmToken", fcmToken);
    } catch (err) {
      console.error("FCM token error:", err);
    }
  }
  return fcmToken;
};
