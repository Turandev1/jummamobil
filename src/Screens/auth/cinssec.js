import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URLS } from "../../config/api";
import { AuthContext, useAuth } from "../../context/authcontext";
import tw from "twrnc";

const Cinssec = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectgender, setselectgender] = useState(null);
  const navigation = useNavigation();

  const setgender = async () => {
    try {
      await AsyncStorage.setItem("genderinfo", selectgender);

      if (selectgender === "male") {
        navigation.navigate("mescidsec");
      } else {
        navigation.navigate("cumebildirisi");
      }
    } catch (error) {
      console.error(error);
      console.log("Xəta baş verdi");
      Alert.alert("Xəta", "Xəta baş verdi");
    }
  };

  return (
    <View
      style={[
        tw`flex-1`,
        {
          marginTop: insets.top,
        },
      ]}
    >
      <Text style={tw`text-2xl text-center font-bold mt-6`}>Jumma</Text>
      <View style={tw`flex items-center justify-center mt-16`}>
        <Image
          resizeMode="cover"
          style={tw`w-60 h-52`}
          source={require("../../../assets/mescid.png")}
        />
      </View>
      <Text style={tw`text-center text-3xl font-bold mt-8`}>{t("cins")}</Text>
      <View style={tw`flex items-center justify-center w-full`}>
        <View style={tw`flex-row justify-center items-center mt-14 w-[90%]`}>
          <TouchableOpacity
            onPress={() => setselectgender("female")}
            style={tw`rounded-md border-black border h-12 flex items-center justify-center w-[45%] mr-4 px-4 mt-6 ${
              selectgender === "female"
                ? "border-blue-500 bg-blue-100"
                : "border-black"
            }`}
          >
            <Text style={tw`text-center text-black text-xl font-semibold`}>
              {t("qadin")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setselectgender("male")}
            style={tw`rounded-md border-black border h-12 flex items-center justify-center w-[45%] px-4 mt-6 ${
              selectgender === "male"
                ? "border-blue-500 bg-blue-100"
                : "border-black"
            }`}
          >
            <Text style={tw`text-center text-black text-xl font-semibold`}>
              {t("kisi")}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={!selectgender}
          onPress={setgender}
          style={tw`bg-green-600 mx-6 rounded-md mt-10 flex items-center justify-center w-[87%] ${
            !selectgender ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text style={tw`text-white text-xl font-semibold py-3`}>
            {t("novbeti")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cinssec;
