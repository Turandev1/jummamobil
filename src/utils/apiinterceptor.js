import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";




const apiclient = axios.create()




apiclient.interceptors.request.use(
    async (config) => {
        const isOnline = await NetInfo.fetch().then(state =>
            state.isConnected && state.isInternetReachable
        )


        if (!isOnline) {
            const cachedData = await AsyncStorage.getItem(`cache_${config.url}`)
            if (cachedData) {
                config.adapter = () => Promise.resolve({
                    data: JSON.parse(cachedData),
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config
                })
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)







apiclient.interceptors.response.use(
    (response) => {
      // Cache successful responses for offline use
      if (response.config.method === 'get') {
        AsyncStorage.setItem(`cache_${response.config.url}`, JSON.stringify(response.data));
      }
      return response;
    },
    async (error) => {
      if (!error.response && error.code === 'NETWORK_ERROR') {
        // Try to return cached data for GET requests
        const cachedData = await AsyncStorage.getItem(`cache_${error.config.url}`);
        if (cachedData) {
          return Promise.resolve({
            data: JSON.parse(cachedData),
            status: 200,
            statusText: 'OK (Cached)',
            headers: {},
            config: error.config
          });
        }
      }
      return Promise.reject(error);
    }
  );
  
  export default apiclient;