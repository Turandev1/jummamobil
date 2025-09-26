import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import ProgressBar from "../../../components/progressbar";

const Iane = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={{ marginTop: insets.top,alignItems:'center' }}>
      <Text style={tw`text-2xl font-bold mt-6`}>Jumma</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("mainpage")}
        style={tw`absolute top-4 left-4 w-24 h-16`}
      >
        <Icon name="chevron-left" size={50} />
      </TouchableOpacity>
      <ScrollView style={tw`w-full`}>
        <View style={tw`w-full px-8 bg-white`}>
          <Text>Funded</Text>
          <View style={tw`border-2 mb-2 rounded-full h-10 border-gray-400 justify-center px-1`}>
            <ProgressBar
              value={600}
              max={1000}
              color="#7488ED" // seçtiğin renk
              backgroundColor="white"
              height={30}
              rounded
              showLabel={false}
              animate
              
            />
          </View>
          <View style={tw`flex-row items-center gap-x-2 mb-2`}>
            <Icon name="map" size={30} />
            <Text style={tw`text-base`}>Kontent burda</Text>
          </View>
          <View style={tw`flex-row items-center gap-x-2 mb-2`}>
            <Icon name="map" size={30} />
            <Text style={tw`text-base`}>Kontent burda</Text>
          </View>
          <View style={tw`flex-row items-center gap-x-2 mb-2`}>
            <Icon name="map" size={30} />
            <Text style={tw`text-base`}>Kontent burda</Text>
          </View>
          <View style={tw`flex-row items-center gap-x-2 mb-2`}>
            <Icon name="map" size={30} />
            <Text style={tw`text-base`}>Kontent burda</Text>
          </View>
          <TouchableOpacity style={tw`bg-green-600 items-center justify-center rounded-md py-1 mt-2`}>
            <Text style={tw`text-xl text-white`}>{t("ianeet")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Iane;
