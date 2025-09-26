import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const languages = [
  { code: "aze", label: "Azərbaycan dili", flag: "🇦🇿" },
  // { code: "tr", label: "TR Türkcə", flag: "🇹🇷" },
  { code: "en", label: "İngilis dili", flag: "🇬🇧" },
];

const Diller = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);

  useEffect(() => {
    // AsyncStorage'dan dil bilgisi varsa yükle
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("language");
      if (savedLang) {
        setSelectedLang(savedLang);
        i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (langCode) => {
    try {
      await AsyncStorage.setItem("language", langCode);
      i18n.changeLanguage(langCode);
      setSelectedLang(langCode);
    } catch (error) {
      console.error("Dil dəyişdirilərkən xəta baş verdi:", error);
    }
  };
  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <View>
        {/* Dil Seçimi */}
        <View style={tw`flex items-center justify-center`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("profilepage")}
            style={tw`absolute top-2 left-4 w-24 h-20`}
          >
            <Icon name="chevron-left" size={50} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-extrabold text-center my-4`}>
            {t("dilisec")}
          </Text>
        </View>

        {/* Dil seçenekleri */}
        <View>
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => changeLanguage(lang.code)}
                style={tw`flex-row items-center p-4 m-2 border rounded ${
                  isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
              >
                {/* Bayraq */}
                <Text style={tw`text-xl mr-4`}>{lang.flag}</Text>

                {/* Dil etiketi */}
                <Text
                  style={tw`text-base ${
                    isSelected ? "font-bold" : "font-normal"
                  }`}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Diller;
