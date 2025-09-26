import {
  Alert,
  Appearance,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URLS } from "../../../../config/api";
import { useAuth } from "../../../../context/authcontext";
import { registerpushnotificationsasync } from "../../../../components/pushhelper";


const ListItems = ({ iconname, text, onpress }) => {
  return (
    <View style={tw`px-6 my-2 w-full absolute bottom-36`}>
      <TouchableOpacity
        onPress={onpress}
        style={tw`px-4 bg-white rounded-md h-14 flex-row justify-between items-center border border-gray-300`}
      >
        <View style={tw`flex-row items-center`}>
          <FontAwesome name={iconname} size={25} />
          <Text style={tw`absolute left-9`}>{text}</Text>
        </View>
        <Icon name="chevron-right" size={50} />
      </TouchableOpacity>
    </View>
  );
};

const Imampanel = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [role, setRole] = useState(null);
  const [admin, setadmin] = useState(null);
  const [time, setTime] = useState(""); // string olarak tut
  const [showmodal, setshowmodal] = useState(false);
  const { refreshAccessToken } = useAuth();


  useEffect(() => {
    const loadRole = async () => {
      try {
        const admindata = await AsyncStorage.getItem("admin");
        if (admindata) {
          const admin = JSON.parse(admindata);
          setRole(admin.role);
          setadmin(admin);
          console.log("admin:", admin.mescid.id);
          console.log("admin:", admin);
        }
      } catch (e) {
        console.log("Role okunamadı", e);
      }
      const newtoken = await SecureStore.getItemAsync("adminaccesstoken");
    };
    loadRole();
  }, []);

  const sendnotifications = async (type) => {
    if (!time) return alert("Zaman daxil edin");

    try {
      const newtoken = await SecureStore.getItemAsync("adminaccesstoken");
      const senderId = admin.id;
      console.log('senderId',senderId)
      await axios.post(
        API_URLS.ADMINS.SENDNOTIFICATION,
        {
          body: `${time} dəqiqəyə ${type} başlayır`,
          title: `${admin.mescid.name} Məscidi`,
          senderId,
          mescidId: admin.mescid.id,
          data: {
            screen: 'mainpage',
            params: { eventType: type, time },
            customKey:'announcement',
          },
        },
        {
          headers: { Authorization: `Bearer ${newtoken}` },
        }
      );
      Alert.alert(t('ugurlu'),'✅ Bildiriş ugurla göndərildi');
      setTime("");
    } catch (error) {
      console.error(
        "Notification send error:",
        error.response?.data || error.message
      );
      console.log("Axios error full:", error);

      Alert.alert(
        "Bildiriş göndərilə bilmədi ❌",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <View style={{ marginTop: insets.top, position: "relative", flex: 1 }}>
      <Text style={tw`text-center text-xl font-bold mt-8`}>Admin Panel</Text>

      <View style={tw`w-full px-6`}>
        <Text>Imam</Text>
        <TextInput
          editable={false}
          style={tw`border border-gray-400 mt-2 rounded-md px-4`}
          value={admin ? `${admin.name} ${admin.surname}` : ""}
        />
      </View>

      <View style={tw`w-full px-6 mt-4`}>
        <Text>Məscid</Text>
        <TextInput
          editable={false}
          style={tw`border border-gray-400 mt-2 rounded-md px-4`}
          value={admin?.mescid?.name ? `${admin.mescid.name} Məscidi` : ""}
        />
      </View>

      <View style={tw`px-10 mt-28`}>
        <View style={tw`flex-row justify-evenly items-center`}>
          <TextInput
            keyboardType="numeric"
            value={time}
            onChangeText={(val) => setTime(val)}
            placeholderTextColor={"black"}
            style={tw`border w-28 bg-green-100 rounded-lg px-4`}
            placeholder="Mis:10 dəq"
          />
          <Text style={tw`font-semibold text-lg`}>{t("deqiqesonra")}</Text>
        </View>

        {/* Namaz butonu */}
        <TouchableOpacity
          onPress={() => sendnotifications("Namaz")}
          style={tw`rounded-md mt-6 h-12 items-center justify-center flex bg-green-600`}
        >
          <Text style={tw`text-xl text-white`}>Namaz</Text>
        </TouchableOpacity>

        {/* Xütbə butonu */}
        <TouchableOpacity
          onPress={() => sendnotifications("Xütbə")}
          style={tw`rounded-md mt-6 h-12 items-center justify-center flex bg-blue-500`}
        >
          <Text style={tw`text-xl text-white`}>Xütbə</Text>
        </TouchableOpacity>
      </View>

      <ListItems
        onpress={() => navigation.navigate("sifrenideyis")}
        iconname="unlock-alt"
        text={t("sifrenideyis")}
      />

      <View style={tw`px-6 my-2 w-full absolute bottom-16`}>
        <TouchableOpacity
          onPress={() => setshowmodal(true)}
          style={tw`bg-white flex-row justify-between items-center px-4 rounded-md h-14 border border-[#BD2828]`}
        >
          <View style={tw`flex-row items-center`}>
            <Ionicons size={28} name="exit" color={"#BD2828"} />
            <Text style={tw`absolute left-9 text-[#BD2828]`}>{t("cixis")}</Text>
          </View>
          <Icon name="chevron-right" size={50} color={"#BD2828"} />
        </TouchableOpacity>
      </View>


      <Modal animationType="slide" transparent={true} visible={showmodal}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-lg p-6 w-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Təsdiqlə</Text>
            <Text style={tw`mb-6`}>Admin paneldən çıxırsınız</Text>
            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                onPress={() => setshowmodal(false)}
                style={tw`mr-4 px-4 py-2 rounded-md bg-gray-300`}
              >
                <Text style={tw`text-lg`}>Ləğv et</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.removeItem("admin");
                  navigation.navigate("profilepage");
                }}
                style={tw`px-4 py-2 rounded-md bg-red-600`}
              >
                <Text style={tw`text-white text-lg px-3`}>Çıx</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Imampanel;
