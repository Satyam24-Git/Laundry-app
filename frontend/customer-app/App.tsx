import React from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3LightTheme, MD3DarkTheme, PaperProvider, configureFonts } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import RootNavigator from './src/navigation/RootNavigator';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { View } from 'react-native';

const fontConfig = {
  fontFamily: 'Inter_400Regular',
};

const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0093D9',
    secondary: '#03dac6',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0093D9',
    secondary: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
  },
};

export default function App() {
  const { theme } = useAppStore();
  const paperTheme = theme === 'dark' ? darkTheme : lightTheme;
  const navTheme = theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
