import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Appcontext = createContext();

export const AppProvider = ({ children }) => {
  const [olke, setolke] = useState(null);
  const [sheher, setsheher] = useState(null);
  const [metod, setmetod] = useState(null);



  
  // Uygulama açıldığında AsyncStorage’dan yükle
  useEffect(() => {
    const loadData = async () => {
      const storedCountry = await AsyncStorage.getItem("olke");
      const storedCity = await AsyncStorage.getItem("sheher");
      const storedMetod = await AsyncStorage.getItem("metod");

      if (storedCountry) setolke(storedCountry);
      if (storedCity) setsheher(storedCity);
      if (storedMetod) setmetod(Number(storedMetod)); // string → number
    };
    loadData();
  }, []);

  // Değiştiğinde AsyncStorage’a kaydet
  const saveOlke = async (country) => {
    setolke(country);
    await AsyncStorage.setItem("olke", country);
  };

  const saveSheher = async (city) => {
    setsheher(city);
    await AsyncStorage.setItem("sheher", city);
  };

  const saveMetod = async (methodId) => {
    setmetod(methodId);
    await AsyncStorage.setItem("metod", String(methodId)); // string olarak kaydet
  };

  return (
    <Appcontext.Provider
      value={{
        olke,
        sheher,
        metod,
        setolke: saveOlke,
        setsheher: saveSheher,
        setmetod: saveMetod,
      }}
    >
      {children}
    </Appcontext.Provider>
  );
};

export const useAppcontext = () => useContext(Appcontext);
