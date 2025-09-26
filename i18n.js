import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import aze from "./locales/aze.json";

const detectlanguage = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const savedLang = await AsyncStorage.getItem("language");
      if (savedLang) {
        callback(savedLang); // ✅ sadece kullanıcı seçmişse uygula
      } else {
        callback(null); // ✅ hiçbir şey seçme
      }
    } catch (error) {
      console.log("Dil tapma xətası:", error);
      callback(null);
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    try {
      await AsyncStorage.setItem("language", lng);
    } catch (error) {
      console.log("Dil qeyd edilə bilmədi:", error);
    }
  },
};

i18n
  .use(detectlanguage)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    fallbackLng: 'aze', // ✅ kesinlikle false olacak
    resources: {
      en: { translation: en },
      aze: { translation: aze },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
