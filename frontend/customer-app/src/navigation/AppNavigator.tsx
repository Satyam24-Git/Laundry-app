import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SchedulePickupScreen from '../screens/SchedulePickupScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Orders') iconName = focused ? 'text-box-outline' : 'text-box-outline';
          else if (route.name === 'Schedule') iconName = focused ? 'truck-delivery' : 'truck-delivery-outline';
          else if (route.name === 'Wallet') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';
          
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: 50 }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  width: 24,
                  height: 12,
                  backgroundColor: '#0093D9',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }} />
              )}
              <MaterialCommunityIcons name={iconName} size={28} color={color} style={{ marginTop: focused ? 4 : 0 }} />
            </View>
          );
        },
        tabBarActiveTintColor: '#0093D9',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#EFEFEF',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 75,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Schedule" component={SchedulePickupScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
