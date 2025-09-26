// Update mobil/src/screens/app/main/notifications.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../../context/authcontext";
import { API_URLS } from "../../../config/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, user } = useAuth();
  const insets = useSafeAreaInsets();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URLS.AUTH.GETNOTIFICATIONS, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View
      style={{
        marginTop: insets.top,
        paddingBottom: insets.bottom + 10,
        flex: 1,
      }}
    >
      <Text style={tw`text-center font-bold text-xl mt-6`}>Notifications</Text>
      <ScrollView
        style={tw`pt-6 w-full pb-6`}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotifications} />
        }
      >
        <View style={tw`mb-12`}>
          {notifications.map((notification, index) => (
            <TouchableOpacity
              key={index}
              style={tw`border w-full px-4 h-20 flex-row items-center`}
            >
              <View
                style={tw`border rounded-full w-16 h-16 flex items-center justify-center`}
              >
                <Icon name="bell" size={40} />
              </View>
              <View style={tw`mx-3 justify-center h-[85%]`}>
                <Text style={tw`text-base font-semibold text-green-600`}>
                  {notification.title}
                </Text>
                <Text>{notification.body}</Text>
                <Text>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;
