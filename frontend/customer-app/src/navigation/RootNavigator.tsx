import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import OffersListScreen from '../screens/OffersListScreen';
import ServicesListScreen from '../screens/ServicesListScreen';
import ManageAddressScreen from '../screens/ManageAddressScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';

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
      <Stack.Screen 
        name="ManageAddress" 
        component={ManageAddressScreen} 
        options={{ title: 'Manage Address', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="Terms" 
        component={TermsScreen} 
        options={{ title: 'Terms & Conditions', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen} 
        options={{ title: 'Privacy Policy', headerBackTitleVisible: false }} 
      />
    </Stack.Navigator>
  );
}
