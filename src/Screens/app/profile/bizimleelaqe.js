import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { API_URLS } from "../../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Bizimleelaqe = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [title, settitle] = useState("");
  const [message, setmessage] = useState("");
  const [fullname, setfullname] = useState("");
  const maxtitlelength = 40;
  const maxmessagelength = 3000;

  const sendmessage = async () => {
    const userstring = await AsyncStorage.getItem("user");
    if (!userstring) {
      console.log("Istifadəçi tapilmadi");
      return;
    }

    const user = JSON.parse(userstring);

    const userId = user._id;
    try {
      const res = await axios.post(
        `${API_URLS.AUTH.SENDMESSAGES}`,
        {
          fullname,
          title,
          message,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (res.status === 201 || res.status === 200) {
        Alert.alert("✅", t("mesajgonderildi"));
        setfullname("");
        settitle("");
        setmessage("");
      } else {
        Alert.alert("⚠️", data?.hata || "Hata oluştu");
      }
    } catch (error) {
      console.log("Send Message Error:", error.response?.data || error.message);
      Alert.alert("⚠️", "Sunucuya bağlanılamadı");
      Alert.alert("Hata", error.response?.data, error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f0f0f0" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ marginTop: insets.top, flex: 1, alignItems: "center" }}>
        <Text style={tw`mt-6 text-2xl font-bold`}>{t("elaqe")}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("profilepage")}
          style={tw`absolute top-4 left-4 w-20 h-16`}
        >
          <Icon name="chevron-left" size={50} />
        </TouchableOpacity>

        {/* input field */}

        <View style={tw`w-full items-center mt-7`}>
          <TextInput
            style={tw`border w-[85%] mb-3 rounded-md px-3 text-base`}
            placeholder={t("adsoyad")}
            value={fullname}
            onChangeText={setfullname}
          />

          <TextInput
            style={tw`border w-[85%] mb-3 rounded-md px-3 text-base`}
            placeholder={t("basliq")}
            value={title}
            onChangeText={settitle}
            maxLength={maxtitlelength}
            multiline={true}
            textAlignVertical="top"
          />
          <Text style={tw`absolute top-[90px] right-10 text-xs`}>
            {maxtitlelength - title.length}/{maxtitlelength}
          </Text>
          <View style={tw`w-full items-center`}>
            <TextInput
              multiline={true}
              textAlignVertical="top"
              style={tw`border w-[85%] h-44 px-3 pb-5 text-base rounded-md`}
              placeholder={t("mesajyazin")}
              value={message}
              onChangeText={setmessage}
              maxLength={maxmessagelength}
            />
            <Text style={tw`absolute bottom-1 right-10`}>
              {maxmessagelength - message.length}/{maxmessagelength}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={sendmessage}
          style={tw`w-[85%] bg-green-600 h-14 mt-6 flex items-center justify-center rounded-lg`}
        >
          <Text style={tw`text-white text-3xl font-bold`}>{t("gonder")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Bizimleelaqe;
