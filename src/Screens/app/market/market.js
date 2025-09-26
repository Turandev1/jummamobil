import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import tw from "twrnc";

const Market = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={[
        tw`flex-1 bg-green-50 justify-center items-center`,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <Text style={tw`text-2xl font-bold`}>{t("tezlikle")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("mainpage")}
        style={tw`absolute top-12 left-4 z-10`}
      >
        <Icon name="chevron-left" size={60} />
      </TouchableOpacity>
    </View>
  );
};

export default Market;
