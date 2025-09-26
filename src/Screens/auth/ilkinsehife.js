import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Ilkinsehife() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1 justify-center items-center relative`}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={tw`absolute top-12 left-4`}
      >
        <Icon name="chevron-left" size={50} />
      </TouchableOpacity>
      <View style={tw`justify-center items-center w-full mt-12 mb-10 h-[45%]`}>
        <Image
          style={tw`mt-4 text-green-700 w-80 h-80`}
          source={require("../../../assets/mescidlogo.png")}
          resizeMode="cover"
        />
      </View>
      <View>
        <Text style={tw`mt-4 text-xl font-semibold text-green-600`}>
          {t("esselamualeykum")}
        </Text>
      </View>
      <View style={tw`w-full flex-row justify-evenly mb-20`}>
        <TouchableOpacity
          style={tw`bg-green-700 px-9 py-2 rounded-md mt-6 w-[42%] items-center`}
          onPress={() => {
            navigation.navigate("login");
          }}
        >
          <Text style={tw`text-white font-semibold text-xl`}>
            {t("daxilol")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-white border-black border flex items-center py-2 w-[42%] rounded-md mt-6`}
          onPress={() => {
            navigation.navigate("signup");
          }}
        >
          <Text style={tw`text-green-700 font-semibold text-xl`}>
            {t("qeydiyyat")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
