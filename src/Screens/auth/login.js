import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URLS } from "../../config/api";
import { AuthContext, useAuth } from "../../context/authcontext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";

const Login = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [isShown, setisShown] = useState(false);
  const navigation = useNavigation();
  const [isallcompleted, setisallcompleted] = useState(false);
  const { login, isLoading, isOnline } = useAuth();
  const [loginstate, setloginstate] = useState({
    email: "",
    password: "",
    isSubmitting: false,
  });

  useEffect(() => {
    const isvalid = loginstate.email && loginstate.password;

    setisallcompleted(isvalid);
  }, [loginstate]);

  const handlechange = (key, value) => {
    setloginstate({ ...loginstate, [key]: value });
  };

  const handlelogin = async () => {
    if (loginstate.isSubmitting) return;

    setloginstate((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const result = await login(loginstate.email, loginstate.password);
      console.log("result", result);
      Alert.alert("Giriş uğurludur", `Xoş gəldin, ${result.user.fullname}!`);

    } catch (err) {
      const msg =
        err.response?.data?.hata ||
        "Giriş uğursuz oldu. Zəhmət olmasa məlumatlarınızı yoxlayın.";
      console.log("Giriş xətası:", msg);
      Alert.alert("Xəta", msg);
    } finally {
      setloginstate((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={20}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1, marginTop: insets.top }}
    >
      <View style={{ flex: 1, marginTop: insets.top + 15 }}>
        <View style={tw`flex items-center justify-center mt-3`}>
          <Image
            resizeMode="cover"
            style={tw`w-52 h-52`}
            source={require("../../../assets/mescid.png")}
          />
          <View style={tw`w-[88%]`}>
            <TextInput
              placeholder="Email*"
              placeholderTextColor={"black"}
              autoCapitalize="none"
              value={loginstate.email}
              onChangeText={(val) => handlechange("email", val)}
              style={tw`border-gray-300 w-full h-12 border mb-3 rounded-md text-base px-3 text-black`}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <View style={tw`flex items-center justify-center w-full relative`}>
              <TextInput
                placeholder={t("sifre")}
                secureTextEntry={!isShown}
                placeholderTextColor={"black"}
                value={loginstate.password}
                onChangeText={(val) => handlechange("password", val)}
                style={tw`border-gray-300 w-full h-12 border mb-3 rounded-md text-base px-3 text-black`}
                textContentType="password"
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setisShown(!isShown)}
                style={tw`absolute right-1 top-[3px] h-12 w-12 flex items-center justify-center`}
              >
                <Icon
                  name={isShown ? "eye-off-outline" : "eye-outline"}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-row justify-between w-full`}>
              <TouchableOpacity
                onPress={() => navigation.navigate("verifyemail")}
                style={tw`rounded-md`}
              >
                <Text style={tw`text-green-600 font-normal text-xs`}>
                  {t("hesabidogrula")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("sifreniunutdum")}
                style={tw`rounded-md`}
              >
                <Text style={tw`text-green-600 font-normal text-xs`}>
                  {t("sifremiunutdum")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={tw`flex items-center justify-center mt-7`}>
          <TouchableOpacity
            onPress={handlelogin}
            disabled={!isallcompleted}
            style={tw`w-[88%] h-12 bg-green-600 rounded-md flex items-center justify-center mb-3 ${
              !isallcompleted ? "opacity-50" : "opacity-100"
            }`}
          >
            <Text style={tw`text-white font-bold text-2xl`}>
              {t("daxilol")}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={tw`flex flex-row items-center justify-center ml-6 mt-5 w-[88%]`}
        >
          <View style={tw`h-[1px] bg-gray-400 w-[32%]`}></View>
          <Text style={tw`text-gray-400 ml-2 font-semibold`}>{t("veya")} </Text>
          <Text style={tw`text-gray-400 mr-2 font-semibold`}>
            {t("qeydiyyat")}
          </Text>
          <View style={tw`h-[1px] bg-gray-400 w-[31%]`}></View>
        </View>
        <View style={tw`flex items-center justify-center mt-3`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("signup")}
            style={tw`w-56 bg-green-600 px-4 py-2 rounded-full h-14 flex items-center justify-center`}
          >
            <Text style={tw`text-white font-bold text-2xl`}>
              {t("qeydiyyat")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
