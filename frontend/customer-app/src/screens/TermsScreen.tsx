import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function TermsScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.title}>Terms and Conditions</Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
        Welcome to XpressLaundry!{'\n\n'}
        These terms and conditions outline the rules and regulations for the use of our application.{'\n\n'}
        By accessing this app we assume you accept these terms and conditions. Do not continue to use XpressLaundry if you do not agree to take all of the terms and conditions stated on this page.{'\n\n'}
        (Placeholder Text: Please replace with your actual legal text).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { padding: 16 }, title: { fontWeight: 'bold', marginBottom: 16 } });
