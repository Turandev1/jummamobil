import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";
import surahlist from "../main/surahlist.json";

const Quran = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSurahs, setFilteredSurahs] = useState(surahlist); // 🔹 JSON’dan başlat

  const ayahnames = {
    1: t("fatiha"),
    2: t("baqara"),
    3: t("aliimran"),
    4: t("nisa"),
    5: t("maida"),
    6: t("anam"),
    7: t("araf"),
    8: t("anfal"),
    9: t("tavba"),
    10: t("yunus"),
    11: t("hud"),
    12: t("yusuf"),
    13: t("rad"),
    14: t("ibrahim"),
    15: t("hicr"),
    16: t("nahl"),
    17: t("isra"),
    18: t("kahf"),
    19: t("maryam"),
    20: t("taha"),
    21: t("anbiya"),
    22: t("hac"),
    23: t("muminun"),
    24: t("nur"),
    25: t("furqan"),
    26: t("shuara"),
    27: t("naml"),
    28: t("qasas"),
    29: t("ankabut"),
    30: t("rum"),
    31: t("luqman"),
    32: t("sacda"),
    33: t("ahzab"),
    34: t("saba"),
    35: t("fatir"),
    36: t("ya-sin"),
    37: t("saffat"),
    38: t("sad"),
    39: t("zumar"),
    40: t("ghafir"),
    41: t("fussilat"),
    42: t("shura"),
    43: t("zuxruf"),
    44: t("dukhan"),
    45: t("casiya"),
    46: t("ahqaf"),
    47: t("muhammad"),
    48: t("fetih"),
    49: t("hujurat"),
    50: t("qaf"),
    51: t("zariyat"),
    52: t("tur"),
    53: t("najm"),
    54: t("qamar"),
    55: t("rahman"),
    56: t("waqia"),
    57: t("hadid"),
    58: t("mujadila"),
    59: t("hashr"),
    60: t("mumtahina"),
    61: t("saff"),
    62: t("cuma"),
    63: t("munafiqun"),
    64: t("taghabun"),
    65: t("talaq"),
    66: t("tahrim"),
    67: t("mulk"),
    68: t("qalam"),
    69: t("haqqa"),
    70: t("maarij"),
    71: t("nuh"),
    72: t("jinn"),
    73: t("muzzammil"),
    74: t("muddasir"),
    75: t("qiyama"),
    76: t("insan"),
    77: t("mursalat"),
    78: t("naba"),
    79: t("naziyat"),
    80: t("abasa"),
    81: t("takwir"),
    82: t("infitar"),
    83: t("mutaffifin"),
    84: t("inshiqaq"),
    85: t("buruj"),
    86: t("tariq"),
    87: t("ala"),
    88: t("ghashiya"),
    89: t("fajr"),
    90: t("balad"),
    91: t("shams"),
    92: t("layl"),
    93: t("duha"),
    94: t("inshirah"),
    95: t("tin"),
    96: t("alaq"),
    97: t("qadr"),
    98: t("bayyina"),
    99: t("zalzala"),
    100: t("adiyat"),
    101: t("qaria"),
    102: t("takasur"),
    103: t("asr"),
    104: t("humaza"),
    105: t("fil"),
    106: t("quraysh"),
    107: t("maun"),
    108: t("kavsar"),
    109: t("kafirun"),
    110: t("nasr"),
    111: t("tebbet"),
    112: t("ikhlas"),
    113: t("falaq"),
    114: t("nas"),
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredSurahs(surahlist);
    } else {
      const filtered = surahlist.filter(
        (s) =>
          s.name.toLowerCase().includes(text.toLowerCase()) ||
          ayahnames[s.number]?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSurahs(filtered);
    }
  };

  const getSurahTranslation = (number) => ayahnames[number];

  return (
    <View
      style={[
        tw`flex-1 bg-orange-50 justify-center items-center`,
        {paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("mainpage")}
        style={tw`absolute top-12 left-4 z-10`}
      >
        <Icon name="chevron-left" size={60} />
      </TouchableOpacity>
      <View style={tw`mt-5 w-full items-end pr-5 mb-4`}>
        <View style={tw`absolute left-24 top-2 z-10`}>
          <MaterialIcons name="search" size={30} />
        </View>
        <TextInput
          style={tw`border w-[80%] relative pl-10 text-black`}
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        style={tw`w-full`}
        renderItem={({ item: surah }) => (
          <View key={surah.number} style={tw`w-full`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("surahdetails", {
                  surahnumber: surah.number,
                })
              }
              style={tw`border-b flex-row justify-between items-center px-3 h-16`}
            >
              <View>
                <View style={tw`flex-row`}>
                  <Text style={tw`font-bold text-lg`}>{surah.number}-</Text>
                  <Text style={tw`text-lg font-bold text-green-600`}>
                    {surah.name}
                  </Text>

                  <Text style={tw`text-lg font-bold`}>
                    ({getSurahTranslation(surah.number)})
                  </Text>
                </View>
                <Text style={tw`font-semibold`}>
                  {t("ayetsayi")}:{surah.numberOfAyahs}
                </Text>
              </View>
              <Icon name="chevron-right" size={45} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Quran;
