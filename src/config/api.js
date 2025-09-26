// API Configuration

import axios from "axios";

// Change this URL based on your environment

// const API_BASE_URL = "http://192.168.1.68:5000"; // Development
// 
const API_BASE_URL = "https://jummabackendapi.onrender.com"; // Production

// const API_BASE_URL = "http://10.218.138.201:5000"; // Development


export const API_URLS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`, // New refresh token endpoint
    LOGOUT: `${API_BASE_URL}/api/auth/logout`, // New logout endpoint
    ME: `${API_BASE_URL}/api/auth/getme`,
    SET_GENDER: `${API_BASE_URL}/api/auth/setgender`,
    CHANGEPASSWORD: `${API_BASE_URL}/api/auth/changepassword`,
    UPDATEUSERINFO: `${API_BASE_URL}/api/auth/updateuserinfo`,
    DELETEACCOUNT: `${API_BASE_URL}/api/auth/deleteaccount`,
    SENDMESSAGES: `${API_BASE_URL}/api/auth/message/sendmessages`,
    GETMESSAGES: `${API_BASE_URL}/api/auth/message/getmessages`,
    REPLYMESSAGES: `${API_BASE_URL}/api/auth/message/:id/reply`,
    FORGOTPASSSENDCODE: `${API_BASE_URL}/api/auth/forgotpasssendcode`,
    FORGOTPASSVERIFY: `${API_BASE_URL}/api/auth/forgotpassverify`,
    FORGOTPASSCHANGE: `${API_BASE_URL}/api/auth/forgotpasschange`,
    RESENDCODE: `${API_BASE_URL}/api/auth/resendcode`,
    REGISTERTOKEN: `${API_BASE_URL}/api/auth/register-token`,
    GETNOTIFICATIONS: `${API_BASE_URL}/api/auth/getnotifications`,
    CHANGEMESCID: `${API_BASE_URL}/api/auth/changemescid`,
  },
  APP: {
    GETVERSION: `${API_BASE_URL}/api/app/getversion`,
    GETMUSHAFAZ: `${API_BASE_URL}/api/app/getmushafaz`,
  },
  ADMINS: {
    IMAMLOGIN: `${API_BASE_URL}/webapi/auth/imamlogin`,
    GETMESCIDS: `${API_BASE_URL}/webapi/auth/getmescids`,
    SENDNOTIFICATION: `${API_BASE_URL}/api/notification/sendnotification`,
  },
  // Add other API endpoints here
};

export default API_BASE_URL;

export const fetchmonthlypraytimes = async (olke,sheher,metod) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const nextmonth = month === 12 ? 1 : month + 1;
  const nextyear = month === 12 ? year + 1 : year;

  try {
    const res1 = await axios.get(
      `https://api.aladhan.com/v1/calendarByCity?city=${sheher}&country=${olke}&method=${
        metod ?? 13
      }&month=${month}&year=${year}`
    );

    const res2 = await axios.get(
      `https://api.aladhan.com/v1/calendarByCity?city=${sheher}&country=${olke}&method=${
        metod ?? 13
      }&month=${nextmonth}&year=${nextyear}`
    );

    const alldays = [...res1.data.data, ...res2.data.data];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // günün başını al
    const todaytimestamp = Math.floor(today.getTime() / 1000);

    const next30days = alldays
      .filter((day) => Number(day.date.timestamp) >= todaytimestamp) // timestamp'i Number'a çevir
      .slice(0, 31);

    return next30days
  } catch (error) {
    console.error(error);
    console.log("error");
  }
};
