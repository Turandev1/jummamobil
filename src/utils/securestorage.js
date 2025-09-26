import * as SecureStorage from "expo-secure-store";

export const storedadmindata = async (admindata) => {
  try {
    await SecureStorage.setItemAsync("admin", JSON.stringify(admindata));
  } catch (error) {
    console.error("Error bas verdi,Admin data qeyd edilmedi", error);

    return null;
  }
};

export const getadmindata = async () => {
  try {
    const data = await SecureStorage.getItemAsync("admin");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Xeta bas verdi,Admin data alinmadi", error);
    return null;
  }
};
