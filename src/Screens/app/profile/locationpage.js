import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import { useAppcontext } from "../../../context/appcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { citynames, countrynames, methods } from "../main/data";

const Locationpage = () => {
  const [step, setStep] = useState("country"); // "country" | "city"
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { olke, sheher, setolke, setsheher, metod, setmetod } = useAppcontext();
  const [selectedCity, setSelectedCity] = useState(null);
  const [open, setOpen] = useState(false);
  const [oppen, setoppen] = useState(false);
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { t } = useTranslation();
  const filteredCountries = Object.keys(countrynames).filter((key) =>
    countrynames[key].toLowerCase().includes(search.toLowerCase())
  );

  // Seçilen ülkeye göre şehirleri al
  const filteredCities = selectedCountry
    ? Object.keys(citynames[selectedCountry][0]).filter((cityKey) =>
        citynames[selectedCountry][0][cityKey]
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const handleSelectCountry = async (key) => {
    setSelectedCountry(key);
    setolke(key);
    await AsyncStorage.setItem("country", key);
  };

  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setsheher(city);
    await AsyncStorage.setItem("city", city);
    setOpen(false);
    setStep("country");
  };

  const metodqeydet = async () => {
    if (selectedMethod !== null) {
      const stringselectmetod = String(selectedMethod);
      setmetod(stringselectmetod);
      await AsyncStorage.setItem("metod", stringselectmetod);
      setoppen(false);
    }
  };

  useEffect(() => {
    const getcountryandcity = async () => {
      const olke = await AsyncStorage.getItem("country");
      const sheher = await AsyncStorage.getItem("city");
      setSelectedCountry(olke);
      setSelectedCity(sheher);
    };
    getcountryandcity();
    console.log("metod:", metod);
  }, []);

  const renderCheckboxItem = (item, isSelected, onPress) => (
    <TouchableOpacity
      key={item}
      style={tw`flex-row items-center border-b px-3 h-10`}
      onPress={onPress}
    >
      {/* Checkbox */}
      {isSelected ? (
        <View style={tw`mr-2`}>
          <MaterialIcons size={20} name="radio-button-checked" />
        </View>
      ) : (
        <View style={tw`mr-2`}>
          <MaterialIcons size={20} name="radio-button-unchecked" />
        </View>
      )}
      {/* Text */}
      <Text style={tw`text-base`}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[tw`flex-1 items-center`, { marginTop: insets.top }]}>
      {/* Aç/Kapat butonu */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={tw`border mt-10 w-[80%] h-12 flex justify-center px-4 rounded-lg`}
      >
        <Text style={tw`text-black text-xl`}>
          {olke && sheher
            ? `${countrynames[olke]} - ${citynames[olke][0][sheher]}`
            : t("mekansec")}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={{ marginTop: 20, width: "80%" }}>
          {/* Search input */}
          <TextInput
            placeholder={step === "country" ? t("olkeaxtar") : t("seheraxar")}
            value={search}
            onChangeText={setSearch}
            style={tw`border rounded-t-lg px-4`}
          />

          {/* Listeyi ScrollView + map ile render et */}
          <ScrollView
            style={[tw`border rounded-b-lg h-[50%]`, { maxHeight: 400 }]}
          >
            {step === "country"
              ? filteredCountries.map((key) =>
                  renderCheckboxItem(
                    countrynames[key], // UI gösterimi
                    olke === key, // seçili mi
                    () => handleSelectCountry(key) // tıklayınca çalışacak
                  )
                )
              : filteredCities.map((cityKey) =>
                  renderCheckboxItem(
                    citynames[selectedCountry][0][cityKey], // UI gösterimi
                    sheher === cityKey, // backend key ile kontrol
                    () => handleSelectCity(cityKey) // backend key’i kaydet
                  )
                )}
          </ScrollView>

          {/* Confirm button for country */}
          {step === "country" ? (
            <TouchableOpacity
              onPress={() => {
                setolke(selectedCountry); // backend key
                setStep("city");
                setSearch("");
              }}
              disabled={!selectedCountry}
              style={tw`mt-3 h-12 rounded-lg flex items-center justify-center ${
                selectedCountry ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Text style={tw`text-white text-lg font-bold`}>
                {t("olkesec")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setsheher(selectedCity); // backend key
                setOpen(false);
                setStep("country");
              }}
              disabled={!selectedCity}
              style={tw`mt-3 h-12 rounded-lg flex items-center justify-center ${
                selectedCity ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Text style={tw`text-white text-lg font-bold`}>
                {t("sehersec")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setoppen(!oppen)}
        style={tw`border-gray-800 border w-[80%] mt-4 h-12 justify-center px-4 rounded-lg`}
      >
        <Text style={tw`text-lg`}>
          {metod
            ? methods.find((m) => m.id === Number(metod))?.name
            : t("metodsec")}
        </Text>
      </TouchableOpacity>
      {oppen && (
        <View
          style={tw`absolute inset-0 bg-black/40 justify-center items-center`}
        >
          <View
            style={tw`flex-1 items-center pt-2 justify-between shadow-lg absolute top-8 w-[80%] h-[80%] bg-gray-100`}
          >
            <Text
              style={tw`text-lg font-semibold py-3 border-b border-gray-200`}
            >
              Namaz Vakitleri Metodu
            </Text>

            <FlatList
              data={methods}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`border-b flex-row py-1 border-gray-400 pl-2 items-center justify-start`}
                  onPress={() => setSelectedMethod(item.id)}
                >
                  <Icon
                    name={
                      selectedMethod === item.id
                        ? "checkbox-outline"
                        : "checkbox-blank-outline"
                    }
                    size={28}
                    color={selectedMethod === item.id ? "#16a34a" : "#555"}
                  />
                  <Text
                    numberOfLines={0}
                    style={[tw`text-base w-[90%] ml-1`, { flexShrink: 1 }]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={tw`w-full pb-1 flex-row`}>
              <TouchableOpacity
                style={tw`w-[50%] flex items-center justify-center h-12`}
                onPress={() => setoppen(false)}
              >
                <Text style={tw`text-xl text-green-700`}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`w-[50%] flex items-center justify-center h-12`}
                onPress={metodqeydet}
              >
                <Text style={tw`text-xl text-green-700`}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Locationpage;
