// Notification Debug Configuration
export const NOTIFICATION_CONFIG = {
  // Enable debug logging
  DEBUG: __DEV__,
  
  // Notification settings
  ANDROID_CHANNEL_ID: 'default',
  ANDROID_IMPORTANCE: 'max',
  
  // Sound settings
  SOUND_ENABLED: true,
  VIBRATION_ENABLED: true,
  
  // Background handling
  BACKGROUND_HANDLING: true,
  
  // Token refresh interval (in milliseconds)
  TOKEN_REFRESH_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  
  // Notification display duration (in milliseconds)
  DISPLAY_DURATION: 3000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Debug logging function
export const debugLog = (message, data = null) => {
  if (NOTIFICATION_CONFIG.DEBUG) {
    console.log(`🔔 [Notification Debug] ${message}`, data || '');
  }
};

// Error logging function
export const debugError = (message, error = null) => {
  if (NOTIFICATION_CONFIG.DEBUG) {
    console.error(`❌ [Notification Error] ${message}`, error || '');
  }
};

// Success logging function
export const debugSuccess = (message, data = null) => {
  if (NOTIFICATION_CONFIG.DEBUG) {
    console.log(`✅ [Notification Success] ${message}`, data || '');
  }
};
