// src/context/notificationcontext.js
import { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import NotificationService from "../services/notifications/notificationservice";
import SmoothNotificationCard from "../components/notification/notificationcard";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    const listener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📱 Notification received in context:", notification);
        setNotif(notification?.request?.content ?? null);
      }
    );

    return () => listener.remove();
  }, []);

  return (
    <NotificationContext.Provider value={{ notif, setNotif }}>
      {children}
      {notif && (
        <SmoothNotificationCard
          title={notif.title}
          body={notif.body}
          onHide={() => setNotif(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
