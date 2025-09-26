import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { API_URLS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";

export default function Signup() {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [isShown, setisShown] = useState(false);
  const [isrepeatshown, setisrepeatshown] = useState(false);
  const [isallcompleted, setisallcompleted] = useState(false);

  const [form, setform] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  useEffect(() => {
    const isvalid =
      form.fullname &&
      form.email &&
      form.phone &&
      form.password &&
      form.confirmpassword &&
      isChecked;

    setisallcompleted(isvalid);
  }, [form, isChecked]);

  const handlechange = (key, value) => {
    setform({ ...form, [key]: value });
  };

  const handlesignup = async () => {
    if (form.password !== form.confirmpassword) {
      return Alert.alert("Xəta", "Şifrələr uyğun deyil");
    }

    try {
      const res = await axios.post(API_URLS.AUTH.SIGNUP, form);
      const data = res.data;
      console.log("data:", data);

      await AsyncStorage.setItem("lastemail", form.email);
      console.log("📦 Email kaydedildi:", form.email);
      navigation.navigate("verifyemail");
      
    } catch (err) {
      const msg =
        err.response?.data?.message || "Server və ya şəbəkə xətası baş verdi";
      Alert.alert("Xəta", msg);
      console.log("❌ Signup hatası:", err.response?.data || err.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={20}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1, marginTop: insets.top }}
    >
      <View style={{ marginBottom: insets.bottom + 10 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ilkinsehife")}
          style={tw`absolute top-3 left-4 z-10`}
        >
          <Icon name="chevron-left" size={55} />
        </TouchableOpacity>

        <View style={tw`flex items-center justify-center mt-3`}>
          <Image
            resizeMode="cover"
            style={tw`w-52 h-52`}
            source={require("../../../assets/mescid.png")}
          />
        </View>
        {/* input field */}
        <View style={tw`flex items-center justify-center`}>
          <TextInput
            style={tw`border-gray-300 w-[80%] h-12 border mb-3 rounded-md text-base px-3`}
            placeholder={t("adsoyad")}
            placeholderTextColor={"black"}
            value={form.fullname}
            onChangeText={(val) => handlechange("fullname", val)}
          />
          <TextInput
            style={tw`border-gray-300 w-[80%] border mb-3 rounded-md text-base px-3`}
            placeholder="Email*"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            placeholderTextColor={"black"}
            value={form.email}
            onChangeText={(val) => handlechange("email", val)}
          />
          <TextInput
            style={tw`border-gray-300 w-[80%] border mb-3 rounded-md text-base px-3`}
            placeholder={t("telefon")}
            placeholderTextColor={"black"}
            textContentType="telephoneNumber"
            autoComplete="tel"
            value={form.phone}
            onChangeText={(val) => handlechange("phone", val)}
            keyboardType="phone-pad"
          />
          <View style={tw`flex items-center justify-center w-full relative`}>
            <TextInput
              style={tw`border-gray-300 w-[80%] border mb-3 rounded-md text-base px-3 text-black`}
              placeholder={t("sifre")}
              placeholderTextColor={"black"}
              value={form.password}
              onChangeText={(val) => handlechange("password", val)}
              secureTextEntry={!isShown}
              textContentType="newPassword"
              autoComplete="new-password"
            />
            <TouchableOpacity
              onPress={() => setisShown(!isShown)}
              style={tw`absolute right-10 top-[3px] h-12 w-12 flex items-center justify-center`}
            >
              <Icon
                name={isShown ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={tw`flex items-center justify-center w-full relative`}>
            <TextInput
              style={tw`border-gray-300 w-[80%] border mb-3 rounded-md text-base px-3 text-black`}
              placeholder={t("sifrenitekrarla")}
              placeholderTextColor={"black"}
              secureTextEntry={!isrepeatshown}
              value={form.confirmpassword}
              onChangeText={(val) => handlechange("confirmpassword", val)}
              textContentType="newPassword"
              autoComplete="new-password"
            />
            <TouchableOpacity
              onPress={() => setisrepeatshown(!isrepeatshown)}
              style={tw`absolute right-10 top-[3px] h-12 w-12 flex items-center justify-center`}
            >
              <Icon
                name={isrepeatshown ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
        <View style={tw`flex-row items-center justify-center mt-4 pr-16`}>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? "#4630EB" : "black"}
          />
          <Text style={tw`ml-2`}>{t("muqavileniqebuledirem")}</Text>
        </View>
        <View style={tw`flex-row items-center justify-center mt-4 mb-4`}>
          <TouchableOpacity
            onPress={handlesignup}
            disabled={!isallcompleted}
            style={tw`items-center w-[80%] h-12 px-4 pt-2 rounded-md bg-green-700 ${
              !isallcompleted ? "opacity-50" : "opacity-100"
            }`}
          >
            <Text style={tw`text-2xl text-white font-bold`}>
              {t("qeydiyyat")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={tw`flex-row items-center justify-between w-[80%] mx-auto mt-3`}
        >
          <View style={tw`border-b border-gray-400 w-[28%] `}></View>
          <Text style={tw`text-center text-base`}>{t("hesabimvar")}</Text>
          <View style={tw`border-b border-gray-400 w-[28%] `}></View>
        </View>
        <View style={tw`flex items-center justify-center mt-3`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("login")}
            style={tw`items-center justify-center w-52 h-14 rounded-full bg-green-600`}
          >
            <Text style={tw`text-white text-3xl font-semibold`}>
              {t("daxilol")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
