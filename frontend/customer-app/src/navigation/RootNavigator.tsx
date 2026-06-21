import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import OffersListScreen from '../screens/OffersListScreen';
import ServicesListScreen from '../screens/ServicesListScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={AppNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="OffersList" 
        component={OffersListScreen} 
        options={{ title: 'Special Offers', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="ServicesList" 
        component={ServicesListScreen} 
        options={{ title: 'All Services', headerBackTitleVisible: false }} 
      />
    </Stack.Navigator>
  );
}
