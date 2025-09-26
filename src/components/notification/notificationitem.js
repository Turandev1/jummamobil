import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';

const NotificationItem = ({ notification, onPress, isRead = false }) => {
  const getIconName = (type) => {
    switch (type) {
      case 'prayer': return 'mosque';
      case 'announcement': return 'bullhorn';
      case 'message': return 'message';
      default: return 'bell';
    }
  };

  return (
    <TouchableOpacity
      style={[
        tw`border w-full px-4 py-3 flex-row items-center mb-2 rounded-lg`,
        isRead ? tw`bg-gray-50` : tw`bg-white`,
        !isRead && tw`border-l-4 border-l-green-500`
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={tw`border rounded-full w-12 h-12 flex items-center justify-center mr-3`}>
        <Icon 
          name={getIconName(notification.type)} 
          size={24} 
          color={isRead ? '#6B7280' : '#10B981'} 
        />
      </View>
      <View style={tw`flex-1`}>
        <Text>
          Ilahiyyat
        </Text>
        <Text style={[
          tw`text-base font-semibold`,
          isRead ? tw`text-gray-600` : tw`text-green-600`
        ]}>
          {notification.title} Ilahiyyat
        </Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>
          {notification.body}
        </Text>
        <Text style={tw`text-xs text-gray-400 mt-1`}>
          {new Date(notification.createdAt).toLocaleString()}
        </Text>
      </View>
      {!isRead && (
        <View style={tw`w-2 h-2 bg-green-500 rounded-full`} />
      )}
    </TouchableOpacity>
  );
};

export default NotificationItem;