import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URLS } from "../../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/authcontext";

const Sifrenideyis = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isallcompleted, setisallcompleted] = useState(false);
  const [confirmpassshown, setconfirmpassshown] = useState(false);
  const [newpassshown, setnewpassshown] = useState(false);
  const [currentpassshown, setcurrentpassshown] = useState(false);
  const [ispasswordchanged, setispasswordchanged] = useState(false);
  const { changePassword } = useAuth();
  const [form, setform] = useState({
    currentpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const handlechange = (key, value) => {
    setform({ ...form, [key]: value });
  };

  useEffect(() => {
    if (form.currentpassword && form.newpassword && form.confirmpassword) {
      setisallcompleted(true);
    } else {
      setisallcompleted(false);
    }
  }, [form]);

  const changepassword = async () => {
    if (form.newpassword !== form.confirmpassword) {
      return Alert.alert("Xəta", "Yeni şifrələr uyğun deyil");
    }

    try {
      const res = await changePassword(
        form.currentpassword,
        form.newpassword,
        form.confirmpassword
      );
      setispasswordchanged(true);
      setform({
        currentpassword: "",
        newpassword: "",
        confirmpassword: "",
      });
    } catch (error) {
      const backenderr = error.response?.data;
      Alert.alert("Xəta", backenderr.hata || "Xəta baş verdi");
    }
  };

  if (ispasswordchanged) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <View style={tw`flex items-center mb-4 bg-[#DCEBE5] rounded-full p-6`}>
          <Icon name="check-circle" size={100} color="green" style={tw`mb-4`} />
        </View>
        <Text style={tw`text-2xl font-semibold`}>{t("sifredeyisildi")}</Text>
        <TouchableOpacity
          onPressOut={() => navigation.navigate("profilepage")}
         style={tw`flex items-center justify-center mt-12 border rounded-lg border-green-600 w-[88%] h-14`}
        >
          <Text style={tw`text-3xl font-semibold text-green-700`}>
            {t("cix")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        tw`flex-1 items-center relative`,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={tw`font-semibold text-2xl my-5`}>{t("sifrenideyis")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("profilepage")}
        style={tw`absolute top-14 left-4 w-20 h-16`}
      >
        <Icon name="chevron-left" size={50} />
      </TouchableOpacity>
      <View style={tw`w-full items-center`}>
        <View style={tw`w-full items-center relative`}>
          <TextInput
            style={tw`border w-[85%] my-2 rounded-md h-12 px-6 text-lg text-black`}
            placeholder={t("movcudsifre")}
            onChangeText={(val) => handlechange("currentpassword", val)}
            value={form.currentpassword}
            secureTextEntry={!currentpassshown}
          />
          <TouchableOpacity
            onPress={() => setcurrentpassshown(!currentpassshown)}
            style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
          >
            <Icon
              name={currentpassshown ? "eye-off-outline" : "eye-outline"}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`w-full items-center`}>
          <TextInput
            style={tw`border w-[85%] my-2 rounded-md h-12 px-6 text-lg text-black`}
            placeholder={t("yenisifre")}
            onChangeText={(val) => handlechange("newpassword", val)}
            value={form.newpassword}
            secureTextEntry={!newpassshown}
          />
          <TouchableOpacity
            onPress={() => setnewpassshown(!newpassshown)}
            style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
          >
            <Icon
              name={newpassshown ? "eye-off-outline" : "eye-outline"}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`w-full items-center`}>
          <TextInput
            style={tw`border w-[85%] mt-2 rounded-md h-12 px-6 text-lg text-black`}
            placeholder={t("yenisifrenitekrarla")}
            onChangeText={(val) => handlechange("confirmpassword", val)}
            value={form.confirmpassword}
            secureTextEntry={!confirmpassshown}
          />
          <TouchableOpacity
            onPress={() => setconfirmpassshown(!confirmpassshown)}
            style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
          >
            <Icon
              name={confirmpassshown ? "eye-off-outline" : "eye-outline"}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("forgotpassword")}
          style={tw`flex items-end w-full px-9`}
        >
          <Text style={tw`font-semibold text-base text-green-700`}>
            {t("sifreniunutmusan")}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        disabled={!isallcompleted}
        onPress={changepassword}
        style={tw`mt-6 w-[85%] h-12 flex items-center justify-center rounded-lg ${
          isallcompleted ? "opacity-100 bg-green-600" : "bg-gray-300 opacity-50"
        }`}
      >
        <Text
          style={tw`text-2xl font-semibold underline ${
            isallcompleted ? "text-white" : "text-black"
          }`}
        >
          {t("yaddasaxla")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sifrenideyis;
