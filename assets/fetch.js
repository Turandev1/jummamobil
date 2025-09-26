const fs = require("fs");
const axios = require("axios");

const translation = "tr.aliakse"; // İstediğiniz tercüme
const totalSurahs = 114; // Toplam sure sayısı

async function fetchAllSurahs() {
  const allSurahs = [];

  for (let surahNumber = 1; surahNumber <= totalSurahs; surahNumber++) {
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/${translation}`;
    try {
      const response = await axios.get(url);
      const data = response.data.data; // API'den gelen sure verisi
      allSurahs.push(data);
      console.log(`Surah ${surahNumber} alındı.`);
    } catch (error) {
      console.error(`Surah ${surahNumber} alınamadı:`, error.message);
    }
  }

  // Tüm sureleri tek JSON dosyasına kaydet
  fs.writeFileSync(
    "traliakse_surahs.json",
    JSON.stringify(allSurahs, null, 4),
    "utf-8"
  );
  console.log("Tüm sureler all_surahs.json dosyasına kaydedildi.");
}

fetchAllSurahs();
