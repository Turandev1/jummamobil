import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Notifications from "expo-notifications";
import NotificationService from "../services/notifications/notificationservice";
import { Animated, Text, TouchableOpacity, View, Platform, AppState } from "react-native";
import { Audio } from "expo-av";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const NotificationContext = createContext();

const SmoothNotificationCard = ({ title, body, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-120)).current; // başlangıç yukarıda
  const soundRef = useRef(null);

  useEffect(() => {
    // Animasyon başlat
    Animated.timing(slideAnim, {
      toValue: Platform.OS === "ios" ? 60 : 20,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Bildirim sesi çal
    playNotificationSound();

    // 3 saniye sonra otomatik kapanma
    const timer = setTimeout(() => handleClose(), 3000);

    return () => {
      clearTimeout(timer);
      unloadSound();
    };
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onHide) onHide();
    });
  };

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/sounds/notify.mp3"),
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log("⚠️ Bildirim sesi çalınamadı:", error);
    }
  };

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        alignSelf: "center",
        width: "92%",
        transform: [{ translateY: slideAnim }],
        backgroundColor: "white",
        borderRadius: 14,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.65,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 9999,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 26,
        zIndex: 9999,
      }}
    >
      {/* Icon */}
      <View
        style={{
          backgroundColor: "#10B98120",
          borderRadius: 999,
          padding: 8,
          marginRight: 12,
        }}
      >
        <MaterialIcons name="notifications" size={20} color="#10B981" />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={{ fontSize: 13, marginTop: 2, color: "#555" }}
          numberOfLines={2}
        >
          {body}
        </Text>
      </View>

      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 18, color: "#999" }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notif, setNotification] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    NotificationService.initialize();

    // App state change handler
    const handleAppStateChange = (nextAppState) => {
      console.log('App state changed from', appState, 'to', nextAppState);
      setAppState(nextAppState);
      
      // If app comes to foreground, refresh notifications
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App came to foreground, refreshing notifications');
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    const notificationlistener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📱 Notification received in context:', notification);
        console.log('📱 App state when notification received:', appState);
        setNotification(notification?.request?.content ?? null);
      }
    );

    return () => {
      appStateSubscription?.remove();
      notificationlistener.remove();
    };
  }, [appState]);

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}

      {/* Bildirim varsa custom notification göster */}
      {notif && (
        <SmoothNotificationCard
          title={notif.title}
          body={notif.body}
          onHide={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
