// mobil/src/components/OfflineIndicator.js - NEW FILE
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../context/authcontext';
import tw from 'twrnc';

const OfflineIndicator = () => {
  const { isOnline, lastSyncTime } = useAuth();

  if (isOnline) return null;

  return (
    <View style={tw`bg-yellow-500 px-4 py-2`}>
      <Text style={tw`text-white text-center text-sm`}>
        Offline Mode - Last sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}
      </Text>
    </View>
  );
};

export default OfflineIndicator;