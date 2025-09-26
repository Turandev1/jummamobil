// mobil/src/utils/tokenUtils.js - NEW FILE
import jwtDecode from "jwt-decode";

export const TokenUtils = {
  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // If can't decode, consider expired
    }
  },

  // Get token expiration time
  getTokenExpiration(token) {
    try {
      const decoded = jwtDecode(token);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  },

  // Check if token needs refresh (expires in next 5 minutes)
  needsRefresh(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const fiveMinutes = 5 * 60;
      return (decoded.exp - currentTime) < fiveMinutes;
    } catch (error) {
      return true;
    }
  }
};